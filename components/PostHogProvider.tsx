"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// ── Pageview tracker (needs Suspense boundary because of useSearchParams) ──

function PageviewTracker() {
  const pathname  = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

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
    posthog.init("phc_Pn9eLtnTWwjMJ24vmFs4c5hbSEh1sMcYCFOb8S9zwQt", {
      api_host: "/ingest",          // proxied through our domain
      ui_host: "https://eu.posthog.com",
      capture_pageview: false,      // handled manually by PageviewTracker
      capture_pageleave: true,
      autocapture: true,            // clicks, form submissions, etc.
      persistence: "localStorage",  // avoid 3rd-party cookie issues
    });
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
