"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

export const ANALYTICS_CONSENT_KEY = "voeez-analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "voeez-analytics-consent";

// ── Pageview tracker (needs Suspense boundary because of useSearchParams) ──

function PageviewTracker() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const ph           = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;
    let url = window.location.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}

// ── Provider ───────────────────────────────────────────────────────────────

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const hasConsent = localStorage.getItem(ANALYTICS_CONSENT_KEY) === "true";

    posthog.init("phc_Pn9eLtnTWwjMJ24vmFs4c5hbSEh1sMcYCFOb8S9zwQt", {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      capture_pageview: false,        // handled manually by PageviewTracker
      capture_pageleave: true,
      autocapture: true,
      persistence: "localStorage",
      // DSGVO: start opted out until user explicitly consents
      opt_out_capturing_by_default: !hasConsent,
    });

    // If user already consented in a previous session, opt in immediately
    if (hasConsent) posthog.opt_in_capturing();

    // Listen for future consent grants (fired by CookieBanner)
    const onConsent = () => posthog.opt_in_capturing();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </PHProvider>
  );
}
