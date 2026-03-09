import { PostHog } from "posthog-node";

/**
 * Server-side PostHog client.
 *
 * Uses a module-level singleton so the same client is reused across
 * invocations in long-lived environments (Node.js server, dev server).
 * In serverless/edge functions call `await posthog.flushAsync()` or
 * configure `flushAt: 1` to ensure events are sent before the function exits.
 */

declare global {
  // eslint-disable-next-line no-var
  var _posthogClient: PostHog | undefined;
}

function createClient(): PostHog {
  return new PostHog("phc_Pn9eLtnTWwjMJ24vmFs4c5hbSEh1sMcYCFOb8S9zwQt", {
    host: "https://eu.i.posthog.com",
    // Flush immediately in serverless so events aren't lost when the
    // function instance is recycled.
    flushAt: 1,
    flushInterval: 0,
  });
}

export const posthogServer: PostHog =
  globalThis._posthogClient ?? (globalThis._posthogClient = createClient());
