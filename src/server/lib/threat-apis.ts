/**
 * Threat Intelligence API clients
 * Layer 1 of the phishing detection system - checks against known threat databases
 * 
 * FREE TIER OPTIMIZED:
 * - Google Safe Browsing: 10,000/day (primary - very reliable)
 * - urlscan.io: 1,000/day (secondary - domain reputation)
 */

import { env } from "~/env";

export type ThreatStatus = "SAFE" | "MALICIOUS" | "UNKNOWN" | "ERROR" | "SKIPPED";

export interface ThreatCheckResult {
  provider: string;
  status: ThreatStatus;
  details?: string;
  matchedUrls?: string[];
}

// Timeout for API calls (3 seconds as per PRD)
const API_TIMEOUT = 3000;

// Reduced URL checks to conserve quota
const MAX_URLS_PER_CHECK = 3;

/**
 * Creates a fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Google Safe Browsing API v4 Lookup
 * FREE TIER: 10,000 requests/day - very generous
 * Primary threat detection - covers malware, social engineering, unwanted software
 */
export async function checkGoogleSafeBrowsing(
  urls: string[]
): Promise<ThreatCheckResult> {
  if (urls.length === 0) {
    return { provider: "Google Safe Browsing", status: "SAFE" };
  }

  const apiKey = env.GOOGLE_SAFE_BROWSING_API_KEY;
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  // Limit URLs to conserve quota
  const urlsToCheck = urls.slice(0, MAX_URLS_PER_CHECK);

  const requestBody = {
    client: {
      clientId: "smells-phishy",
      clientVersion: "1.0.0",
    },
    threatInfo: {
      threatTypes: [
        "MALWARE",
        "SOCIAL_ENGINEERING",
        "UNWANTED_SOFTWARE",
        "POTENTIALLY_HARMFUL_APPLICATION",
      ],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: urlsToCheck.map((url) => ({ url })),
    },
  };

  try {
    const response = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`Google Safe Browsing API error: ${response.status}`);
      return { provider: "Google Safe Browsing", status: "ERROR" };
    }

    const data = (await response.json()) as {
      matches?: Array<{ threat: { url: string }; threatType: string }>;
    };

    if (data.matches && data.matches.length > 0) {
      const matchedUrls = data.matches.map((m) => m.threat.url);
      const threatTypes = [...new Set(data.matches.map((m) => m.threatType))];
      return {
        provider: "Google Safe Browsing",
        status: "MALICIOUS",
        details: `Flagged as: ${threatTypes.join(", ")}`,
        matchedUrls,
      };
    }

    return { provider: "Google Safe Browsing", status: "SAFE" };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        provider: "Google Safe Browsing",
        status: "ERROR",
        details: "Request timeout",
      };
    }
    console.error("Google Safe Browsing check failed:", error);
    return { provider: "Google Safe Browsing", status: "ERROR" };
  }
}

/**
 * urlscan.io Search API
 * FREE TIER: 1,000 searches/day
 * Secondary check - domain reputation and historical malicious verdicts
 */
export async function checkUrlscan(domains: string[]): Promise<ThreatCheckResult> {
  // Skip if no API key configured (optional service)
  const apiKey = env.URLSCAN_API_KEY;
  if (!apiKey) {
    return { 
      provider: "urlscan.io", 
      status: "SKIPPED",
      details: "API key not configured"
    };
  }

  if (domains.length === 0) {
    return { provider: "urlscan.io", status: "SAFE" };
  }

  const matchedDomains: string[] = [];

  try {
    // Only check first 2 domains to conserve quota
    for (const domain of domains.slice(0, 2)) {
      const query = encodeURIComponent(`domain:${domain} AND verdicts.malicious:true`);
      const endpoint = `https://urlscan.io/api/v1/search/?q=${query}&size=1`;

      const response = await fetchWithTimeout(endpoint, {
        method: "GET",
        headers: {
          "API-Key": apiKey,
        },
      });

      if (response.ok) {
        const data = (await response.json()) as {
          total: number;
          results?: Array<{ task: { domain: string } }>;
        };
        if (data.total > 0) {
          matchedDomains.push(domain);
        }
      }
    }

    if (matchedDomains.length > 0) {
      return {
        provider: "urlscan.io",
        status: "MALICIOUS",
        details: "Domain has historical malicious verdicts",
        matchedUrls: matchedDomains,
      };
    }

    return { provider: "urlscan.io", status: "SAFE" };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { provider: "urlscan.io", status: "ERROR", details: "Request timeout" };
    }
    console.error("urlscan.io check failed:", error);
    return { provider: "urlscan.io", status: "ERROR" };
  }
}

/**
 * Run threat intelligence checks
 * Strategy: Run Google Safe Browsing first (most reliable), then urlscan if configured
 */
export async function runThreatIntelligenceChecks(
  urls: string[],
  domains: string[]
): Promise<{
  isMalicious: boolean;
  results: ThreatCheckResult[];
  maliciousReasons: string[];
}> {
  const results: ThreatCheckResult[] = [];
  const maliciousReasons: string[] = [];

  // Helper to process and collect results
  const processResult = (result: ThreatCheckResult) => {
    results.push(result);
    if (result.status === "MALICIOUS") {
      const matchedUrls = result.matchedUrls?.join(", ") ?? "unknown";
      maliciousReasons.push(
        `${result.provider}: ${result.details ?? "Threat detected"} (${matchedUrls})`
      );
    }
  };

  // STEP 1: Run Google Safe Browsing (primary check)
  const googleResult = await checkGoogleSafeBrowsing(urls);
  processResult(googleResult);

  // Short-circuit if Google found a threat
  if (googleResult.status === "MALICIOUS") {
    return { isMalicious: true, results, maliciousReasons };
  }

  // STEP 2: Run urlscan.io if configured and we have domains
  if (env.URLSCAN_API_KEY && domains.length > 0) {
    const urlscanResult = await checkUrlscan(domains);
    processResult(urlscanResult);
  }

  return {
    isMalicious: maliciousReasons.length > 0,
    results,
    maliciousReasons,
  };
}
