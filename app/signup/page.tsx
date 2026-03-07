"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import TurnstileWidget from "@/components/TurnstileWidget";

export default function SignupPage() {
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [captchaToken, setCaptchaToken]       = useState<string | null>(null);
  const [error, setError]                     = useState("");
  const [success, setSuccess]                 = useState(false);
  const [loading, setLoading]                 = useState(false);

  const handleCaptchaToken  = useCallback((token: string) => setCaptchaToken(token), []);
  const handleCaptchaExpire = useCallback(() => setCaptchaToken(null), []);

  // Block submit until Turnstile passes (only when site key is configured)
  const captchaRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const canSubmit       = !captchaRequired || Boolean(captchaToken);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }

    if (captchaRequired && !captchaToken) {
      setError("Bitte schließe die Sicherheitsprüfung ab.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        ...(captchaToken ? { options: { captchaToken } } : {}),
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(true);
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
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
              <Image
                src="/images/goose-hero.png"
                alt="voeez Gans"
                width={80}
                height={80}
                className="drop-shadow-md"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Konto erstellen
            </h1>
            <p className="mt-2 text-sm text-muted">
              30 Tage kostenlos — kein Risiko
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground">
                  Bestätigungsmail gesendet
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Überprüfe dein E-Mail-Postfach und klicke auf den
                  Bestätigungslink, um dein Konto zu aktivieren.
                </p>
              </div>
              <Link
                href="/login"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Zur Anmeldung
              </Link>
            </div>
          ) : (
            <>
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
                      placeholder="Mindestens 6 Zeichen"
                      className="w-full rounded-xl border border-border bg-background py-3 pr-4 pl-10 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Confirm */}
                <div>
                  <label
                    htmlFor="passwordConfirm"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Passwort bestätigen
                  </label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted" />
                    <input
                      id="passwordConfirm"
                      type="password"
                      required
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="Passwort wiederholen"
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
                      Konto wird erstellt...
                    </span>
                  ) : (
                    "Kostenlos registrieren"
                  )}
                </button>
              </form>

              {/* Footer link */}
              <p className="mt-6 text-center text-sm text-muted">
                Schon ein Konto?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary transition-colors hover:text-primary-dark"
                >
                  Anmelden
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
