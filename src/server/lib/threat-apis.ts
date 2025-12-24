/**
 * Threat Intelligence API clients
 * Layer 1 of the phishing detection system - checks against known threat databases
 */

import { env } from "~/env";

export type ThreatStatus = "SAFE" | "MALICIOUS" | "UNKNOWN" | "ERROR";

export interface ThreatCheckResult {
  provider: string;
  status: ThreatStatus;
  details?: string;
  matchedUrls?: string[];
}

// Timeout for API calls (3 seconds as per PRD)
const API_TIMEOUT = 3000;

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
 * Checks URLs against Google's threat database
 */
export async function checkGoogleSafeBrowsing(
  urls: string[]
): Promise<ThreatCheckResult> {
  if (urls.length === 0) {
    return { provider: "Google Safe Browsing", status: "SAFE" };
  }

  const apiKey = env.GOOGLE_SAFE_BROWSING_API_KEY;
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

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
      threatEntries: urls.map((url) => ({ url })),
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
 * PhishTank API
 * Checks URLs against community-verified phishing database
 */
export async function checkPhishTank(urls: string[]): Promise<ThreatCheckResult> {
  if (urls.length === 0) {
    return { provider: "PhishTank", status: "SAFE" };
  }

  // PhishTank requires checking each URL individually
  // We'll check the first few URLs to stay within rate limits
  const urlsToCheck = urls.slice(0, 5);
  const matchedUrls: string[] = [];

  try {
    for (const url of urlsToCheck) {
      const apiKey = env.PHISHTANK_API_KEY;
      const endpoint = "https://checkurl.phishtank.com/checkurl/";

      const formData = new URLSearchParams();
      formData.append("url", url);
      formData.append("format", "json");
      if (apiKey) {
        formData.append("app_key", apiKey);
      }

      const response = await fetchWithTimeout(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          results?: { in_database: boolean; valid: boolean };
        };
        if (data.results?.in_database && data.results?.valid) {
          matchedUrls.push(url);
        }
      }
    }

    if (matchedUrls.length > 0) {
      return {
        provider: "PhishTank",
        status: "MALICIOUS",
        details: "URL found in PhishTank database",
        matchedUrls,
      };
    }

    return { provider: "PhishTank", status: "SAFE" };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { provider: "PhishTank", status: "ERROR", details: "Request timeout" };
    }
    console.error("PhishTank check failed:", error);
    return { provider: "PhishTank", status: "ERROR" };
  }
}

/**
 * urlscan.io Search API
 * Checks if domains have historical malicious verdicts
 */
export async function checkUrlscan(domains: string[]): Promise<ThreatCheckResult> {
  if (domains.length === 0) {
    return { provider: "urlscan.io", status: "SAFE" };
  }

  const apiKey = env.URLSCAN_API_KEY;
  const matchedDomains: string[] = [];

  try {
    // Check each domain for malicious history
    for (const domain of domains.slice(0, 5)) {
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
 * Run all threat intelligence checks in parallel
 * Returns immediately if any check finds a malicious URL
 */
export async function runThreatIntelligenceChecks(
  urls: string[],
  domains: string[]
): Promise<{
  isMalicious: boolean;
  results: ThreatCheckResult[];
  maliciousReasons: string[];
}> {
  // Run all checks in parallel
  const [googleResult, phishTankResult, urlscanResult] = await Promise.allSettled([
    checkGoogleSafeBrowsing(urls),
    checkPhishTank(urls),
    checkUrlscan(domains),
  ]);

  const results: ThreatCheckResult[] = [];
  const maliciousReasons: string[] = [];

  // Process results
  const processResult = (result: PromiseSettledResult<ThreatCheckResult>) => {
    if (result.status === "fulfilled") {
      results.push(result.value);
      if (result.value.status === "MALICIOUS") {
        const urls = result.value.matchedUrls?.join(", ") ?? "unknown";
        maliciousReasons.push(
          `${result.value.provider}: ${result.value.details ?? "Threat detected"} (${urls})`
        );
      }
    } else {
      results.push({
        provider: "Unknown",
        status: "ERROR",
        details: result.reason instanceof Error ? result.reason.message : "Check failed",
      });
    }
  };

  processResult(googleResult);
  processResult(phishTankResult);
  processResult(urlscanResult);

  return {
    isMalicious: maliciousReasons.length > 0,
    results,
    maliciousReasons,
  };
}

