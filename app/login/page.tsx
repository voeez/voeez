"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import TurnstileWidget from "@/components/TurnstileWidget";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [captchaToken, setCaptchaToken]       = useState<string | null>(null);
  const [error, setError]                     = useState("");
  const [loading, setLoading]                 = useState(false);

  const handleCaptchaToken  = useCallback((token: string) => setCaptchaToken(token), []);
  const handleCaptchaExpire = useCallback(() => setCaptchaToken(null), []);

  // Block submit until Turnstile passes (only when site key is configured)
  const captchaRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const canSubmit       = !captchaRequired || Boolean(captchaToken);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (captchaRequired && !captchaToken) {
      setError("Bitte schließe die Sicherheitsprüfung ab.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
        ...(captchaToken ? { options: { captchaToken } } : {}),
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Check for redirect parameter
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/dashboard";
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-16">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border/50 bg-surface p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <LogIn className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Willkommen zurück
            </h1>
            <p className="mt-2 text-sm text-muted">
              Melde dich an, um fortzufahren
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                E-Mail
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  className="w-full rounded-xl border border-border bg-background py-3 pr-4 pl-10 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dein Passwort"
                  className="w-full rounded-xl border border-border bg-background py-3 pr-4 pl-10 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Cloudflare Turnstile CAPTCHA */}
            <TurnstileWidget
              onToken={handleCaptchaToken}
              onExpire={handleCaptchaExpire}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Anmelden...
                </span>
              ) : (
                "Anmelden"
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-muted">
            Noch kein Konto?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary transition-colors hover:text-primary-dark"
            >
              Registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
