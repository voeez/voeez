"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "voeez-cookie-notice";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't dismissed it yet
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-2xl border border-border bg-surface/95 p-4 shadow-2xl backdrop-blur-md sm:items-center sm:px-6 sm:py-4">
        {/* Text */}
        <p className="flex-1 text-sm text-muted leading-relaxed">
          Diese Website verwendet ausschließlich{" "}
          <strong className="text-foreground">technisch notwendige Cookies</strong>{" "}
          für die Authentifizierung. Keine Tracking- oder Werbe-Cookies.{" "}
          <Link
            href="/datenschutz"
            className="text-primary underline underline-offset-2 hover:text-primary-dark"
          >
            Datenschutzerklärung
          </Link>
        </p>

        {/* Dismiss button */}
        <button
          onClick={dismiss}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          aria-label="Cookie-Hinweis schließen"
        >
          OK
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
