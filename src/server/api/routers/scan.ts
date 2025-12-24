/**
 * Scan Router - Core phishing detection logic
 * Implements the "Swiss Cheese" security model with Layer 1 (Threat Intel) and Layer 2 (AI)
 * 
 * FREE TIER OPTIMIZED:
 * - Rate limited per IP (10 scans/hour)
 * - Quota tracking for Gemini API
 * - urlscan.io only used if configured
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { extractUrlsAndDomains, sanitizeEmailContent } from "~/server/lib/url-extractor";
import { runThreatIntelligenceChecks } from "~/server/lib/threat-apis";
import { analyzeWithGemini, getQuotaStatus } from "~/server/lib/gemini";
import { checkRateLimit } from "~/server/lib/rate-limit";

// Input/Output schemas as defined in PRD
const scanInputSchema = z.object({
  text: z.string().min(1, "Email content is required").max(50000, "Email content too large"),
  urls: z.array(z.string()).optional(),
  source: z.enum(["web", "extension"]).default("web"),
});

const scanOutputSchema = z.object({
  verdict: z.enum(["SAFE", "SUSPICIOUS", "DANGER"]),
  score: z.number().min(0).max(100),
  reasons: z.array(z.string()),
  provider: z.enum(["ThreatIntel", "Gemini"]),
  rateLimitRemaining: z.number().optional(),
});

export type ScanInput = z.infer<typeof scanInputSchema>;
export type ScanOutput = z.infer<typeof scanOutputSchema>;

/**
 * Get client IP from headers (works with Vercel, Cloudflare, etc.)
 */
function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    "anonymous"
  );
}

export const scanRouter = createTRPCRouter({
  /**
   * Main analysis endpoint
   * Layer 1: Check URLs against threat intelligence databases
   * Layer 2: If no threats found, analyze content with Gemini AI
   */
  analyzeText: publicProcedure
    .input(scanInputSchema)
    .output(scanOutputSchema)
    .mutation(async ({ input, ctx }): Promise<ScanOutput> => {
      // Rate limiting
      const clientIp = getClientIp(ctx.headers);
      const rateLimit = await checkRateLimit(clientIp);

      if (!rateLimit.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Rate limit exceeded. You can scan again in ${Math.ceil((rateLimit.reset - Date.now()) / 60000)} minutes.`,
        });
      }

      // Sanitize input (remove base64 images, etc.)
      const sanitizedText = sanitizeEmailContent(input.text);
      
      // Extract URLs and domains from content
      const { urls: extractedUrls, domains } = extractUrlsAndDomains(sanitizedText);
      
      // Combine extracted URLs with any provided by client
      const allUrls = [...new Set([...extractedUrls, ...(input.urls ?? [])])];

      // === LAYER 1: Threat Intelligence Checks ===
      // Run parallel checks against Google Safe Browsing, PhishTank, and urlscan.io
      const threatResults = await runThreatIntelligenceChecks(allUrls, domains);

      // If any threat intelligence source flags the content, return DANGER immediately
      if (threatResults.isMalicious) {
        return {
          verdict: "DANGER",
          score: 95, // High confidence from threat intel
          reasons: threatResults.maliciousReasons,
          provider: "ThreatIntel",
          rateLimitRemaining: rateLimit.remaining,
        };
      }

      // === LAYER 2: AI Analysis ===
      // No known threats found, proceed to contextual analysis with Gemini
      const geminiResult = await analyzeWithGemini(sanitizedText);

      return {
        verdict: geminiResult.verdict,
        score: geminiResult.score,
        reasons: geminiResult.reasons,
        provider: "Gemini",
        rateLimitRemaining: rateLimit.remaining,
      };
    }),

  /**
   * Quick URL check - only runs Layer 1
   * Useful for quick link verification without full email analysis
   */
  checkUrls: publicProcedure
    .input(z.object({
      urls: z.array(z.string().url()).min(1).max(10),
    }))
    .mutation(async ({ input, ctx }) => {
      // Rate limiting
      const clientIp = getClientIp(ctx.headers);
      const rateLimit = await checkRateLimit(clientIp);

      if (!rateLimit.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Rate limit exceeded. Try again later.`,
        });
      }

      const domains = input.urls.map(url => {
        try {
          return new URL(url).hostname;
        } catch {
          return null;
        }
      }).filter((d): d is string => d !== null);

      const threatResults = await runThreatIntelligenceChecks(input.urls, domains);

      return {
        isMalicious: threatResults.isMalicious,
        results: threatResults.results,
        reasons: threatResults.maliciousReasons,
        rateLimitRemaining: rateLimit.remaining,
      };
    }),

  /**
   * Get current API quota status (for UI display)
   */
  getQuotaStatus: publicProcedure.query(() => {
    return getQuotaStatus();
  }),
});
