/**
 * Scan Router - Core phishing detection logic
 * Implements the "Swiss Cheese" security model with Layer 1 (Threat Intel) and Layer 2 (AI)
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { extractUrlsAndDomains, sanitizeEmailContent } from "~/server/lib/url-extractor";
import { runThreatIntelligenceChecks } from "~/server/lib/threat-apis";
import { analyzeWithGemini } from "~/server/lib/gemini";

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
});

export type ScanInput = z.infer<typeof scanInputSchema>;
export type ScanOutput = z.infer<typeof scanOutputSchema>;

export const scanRouter = createTRPCRouter({
  /**
   * Main analysis endpoint
   * Layer 1: Check URLs against threat intelligence databases
   * Layer 2: If no threats found, analyze content with Gemini AI
   */
  analyzeText: publicProcedure
    .input(scanInputSchema)
    .output(scanOutputSchema)
    .mutation(async ({ input }): Promise<ScanOutput> => {
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
    .mutation(async ({ input }) => {
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
      };
    }),
});

