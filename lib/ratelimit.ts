import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Creates an Upstash Redis client from environment variables.
 * Returns null if credentials are not configured (fail-open behaviour).
 */
function makeRedis(): Redis | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = makeRedis();

/**
 * Stripe checkout + portal routes.
 * 10 requests per IP per 5 minutes.
 * Null when Upstash is not configured → rate limiting skipped (fail-open).
 */
export const checkoutRatelimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "5 m"),
      prefix: "voeez:checkout",
    })
  : null;

/**
 * Stats-sync endpoint.
 * 30 requests per IP per minute.
 * Null when Upstash is not configured → rate limiting skipped (fail-open).
 */
export const statsRatelimit: Ratelimit | null = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      prefix: "voeez:stats",
    })
  : null;
