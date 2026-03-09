import { createHmac } from "crypto";

/**
 * Generates a secure HMAC-SHA256 hash for Canny's Secure Identify feature.
 * Requires CANNY_API_KEY env var (from Canny admin → Security settings).
 * Returns an empty string if the key is not configured — identify still works
 * without a hash, just without the tamper-proof guarantee.
 */
export function generateCannyHash(userId: string): string {
  const apiKey = process.env.CANNY_API_KEY;
  if (!apiKey) return "";
  return createHmac("sha256", apiKey).update(userId).digest("hex");
}
