"use client";

import { useEffect, useRef } from "react";

// Extend the Window type for the Turnstile JS API
declare global {
  interface Window {
    turnstile?: {
      render:  (container: string | HTMLElement, options: Record<string, unknown>) => string;
      remove:  (widgetId: string) => void;
      reset:   (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileWidgetProps {
  /** Called with a fresh token when the challenge passes */
  onToken:  (token: string) => void;
  /** Called when the token expires — clear the stored token */
  onExpire?: () => void;
  theme?:   "light" | "dark" | "auto";
}

/**
 * Cloudflare Turnstile CAPTCHA widget.
 *
 * • Renders only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * • Loads the Turnstile script on demand (once per page).
 * • Cleans up the widget on unmount.
 *
 * Supabase will verify the token server-side — no extra API route needed.
 */
export default function TurnstileWidget({
  onToken,
  onExpire,
  theme = "dark",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef  = useRef<string | null>(null);
  const siteKey      = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const renderWidget = () => {
      // Guard: don't render twice
      if (!containerRef.current || !window.turnstile || widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey:            siteKey,
        theme,
        callback:           (token: string) => onToken(token),
        "expired-callback": () => onExpire?.(),
      });
    };

    if (window.turnstile) {
      // Script already loaded in a previous render
      renderWidget();
    } else {
      // Chain onto any previously registered onload callback
      const prev = window.onTurnstileLoad;
      window.onTurnstileLoad = () => { prev?.(); renderWidget(); };

      // Inject the script only once
      if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
        const script   = document.createElement("script");
        script.src     = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";
        script.async   = true;
        script.defer   = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
    // onToken / onExpire intentionally omitted — we don't want to re-render
    // the widget on every parent re-render. Stale-closure risk is minimal
    // because these callbacks only fire once per challenge pass/expire.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey, theme]);

  // Nothing to render if no site key is set
  if (!siteKey) return null;

  return (
    <div className="flex justify-center py-1">
      <div ref={containerRef} />
    </div>
  );
}
