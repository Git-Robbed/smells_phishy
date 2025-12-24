/**
 * URL and domain extraction utilities for email analysis
 * Extracts URLs and domains from email body text for threat intelligence checks
 */

// Regex to match URLs (http, https, and bare domains)
const URL_REGEX = /https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+/gi;

// Regex to extract domain from URL
const DOMAIN_REGEX = /^(?:https?:\/\/)?(?:www\.)?([^\/\s:]+)/i;

export interface ExtractedUrls {
  urls: string[];
  domains: string[];
}

/**
 * Extracts all URLs from email content
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  if (!matches) return [];

  // Deduplicate and clean URLs
  const uniqueUrls = [...new Set(matches)].map((url) => {
    // Add protocol if missing
    if (url.startsWith("www.")) {
      return `http://${url}`;
    }
    return url;
  });

  return uniqueUrls;
}

/**
 * Extracts domain from a URL
 */
export function extractDomain(url: string): string | null {
  const match = url.match(DOMAIN_REGEX);
  return match?.[1]?.toLowerCase() ?? null;
}

/**
 * Extracts all unique domains from email content
 */
export function extractDomains(text: string): string[] {
  const urls = extractUrls(text);
  const domains = urls
    .map(extractDomain)
    .filter((domain): domain is string => domain !== null);

  return [...new Set(domains)];
}

/**
 * Extracts both URLs and domains from email content
 */
export function extractUrlsAndDomains(text: string): ExtractedUrls {
  const urls = extractUrls(text);
  const domains = urls
    .map(extractDomain)
    .filter((domain): domain is string => domain !== null);

  return {
    urls,
    domains: [...new Set(domains)],
  };
}

/**
 * Sanitizes email content by removing base64 encoded images to reduce payload size
 */
export function sanitizeEmailContent(text: string): string {
  // Remove base64 encoded images (data:image/...)
  const withoutBase64 = text.replace(
    /data:image\/[a-zA-Z]+;base64,[a-zA-Z0-9+/=]+/gi,
    "[IMAGE REMOVED]"
  );

  // Remove very long continuous strings (likely encoded content)
  const withoutLongStrings = withoutBase64.replace(/[a-zA-Z0-9+/=]{500,}/g, "[ENCODED CONTENT REMOVED]");

  return withoutLongStrings.trim();
}

