"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ANALYTICS_CONSENT_KEY, ANALYTICS_CONSENT_EVENT } from "./PostHogProvider";

const DISMISSED_KEY = "voeez-cookie-dismissed";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner only if user hasn't made a choice yet
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function acceptAll() {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, "true");
    localStorage.setItem(DISMISSED_KEY, "1");
    window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
    setVisible(false);
  }

  function acceptNecessaryOnly() {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, "false");
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:px-6 sm:py-4">
        {/* Text */}
        <p className="flex-1 text-sm text-muted leading-relaxed">
          Wir nutzen{" "}
          <strong className="text-foreground">technisch notwendige Cookies</strong>{" "}
          für die Authentifizierung sowie{" "}
          <strong className="text-foreground">Analyse-Cookies</strong>{" "}
          (PostHog), um zu verstehen wie die Website genutzt wird.{" "}
          <Link
            href="/datenschutz"
            className="text-primary underline underline-offset-2 hover:text-primary-dark"
          >
            Datenschutzerklärung
          </Link>
        </p>

        {/* Action buttons */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={acceptNecessaryOnly}
            className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted transition-colors hover:bg-surface-muted"
          >
            Nur notwendige
          </button>
          <button
            onClick={acceptAll}
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
