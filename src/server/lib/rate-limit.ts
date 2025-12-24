/**
 * Rate limiting for free tier protection
 * Uses Upstash Redis if configured, otherwise falls back to in-memory limiting
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "~/env";

// In-memory fallback for when Upstash is not configured
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 10; // 10 scans per hour per IP

/**
 * Rate limiter instance - uses Upstash if configured
 */
let upstashRatelimit: Ratelimit | null = null;

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  upstashRatelimit = new Ratelimit({
    redis: new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS_PER_WINDOW, "1 h"),
    analytics: true,
    prefix: "smells-phishy",
  });
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp when the limit resets
}

/**
 * Check if an identifier (IP address) is rate limited
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  // Use Upstash if available
  if (upstashRatelimit) {
    const result = await upstashRatelimit.limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  // Fallback to in-memory rate limiting
  const now = Date.now();
  const record = inMemoryStore.get(identifier);

  if (!record || now > record.resetAt) {
    // Create new window
    inMemoryStore.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      success: true,
      remaining: MAX_REQUESTS_PER_WINDOW - 1,
      reset: now + WINDOW_MS,
    };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      success: false,
      remaining: 0,
      reset: record.resetAt,
    };
  }

  record.count++;
  return {
    success: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    reset: record.resetAt,
  };
}

/**
 * Clean up old in-memory records (call periodically)
 */
export function cleanupInMemoryStore(): void {
  const now = Date.now();
  for (const [key, value] of inMemoryStore.entries()) {
    if (now > value.resetAt) {
      inMemoryStore.delete(key);
    }
  }
}

// Clean up every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupInMemoryStore, 10 * 60 * 1000);
}

