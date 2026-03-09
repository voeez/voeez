"use client";

import { useState } from "react";
import { User, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  email: string;
}

export default function ProfilForm({ email }: Props) {
  const [newEmail, setNewEmail]           = useState("");
  const [emailStatus, setEmailStatus]     = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError]       = useState("");

  const [currentPassword, setCurrent]     = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirm]     = useState("");
  const [pwStatus, setPwStatus]           = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwError, setPwError]             = useState("");

  const inputClass = "w-full rounded-xl border border-border bg-background py-2.5 px-4 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none";

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailStatus("loading");
    setEmailError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) { setEmailError(error.message); setEmailStatus("error"); return; }
      setEmailStatus("success");
      setNewEmail("");
    } catch {
      setEmailError("Ein Fehler ist aufgetreten.");
      setEmailStatus("error");
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (newPassword !== confirmPassword) {
      setPwError("Passwörter stimmen nicht überein.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("Mindestens 6 Zeichen.");
      return;
    }
    setPwStatus("loading");
    try {
      const supabase = createClient();
      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (signInError) { setPwError("Aktuelles Passwort ist falsch."); setPwStatus("error"); return; }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) { setPwError(error.message); setPwStatus("error"); return; }
      setPwStatus("success");
      setCurrent("");
      setNewPassword("");
      setConfirm("");
    } catch {
      setPwError("Ein Fehler ist aufgetreten.");
      setPwStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Konto</h1>
        <p className="mt-1 text-muted">Deine Account-Informationen.</p>
      </div>

      {/* Avatar row */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <User className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{email || "—"}</p>
          <p className="text-sm text-muted">voeez Konto</p>
        </div>
      </div>

      {/* E-Mail ändern */}
      <div className="rounded-2xl border border-border/50 bg-surface p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">E-Mail-Adresse</p>
            <p className="text-sm text-muted">Aktuelle Adresse: <span className="text-foreground">{email}</span></p>
          </div>
        </div>

        {emailStatus === "success" ? (
          <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Bestätigungslink an die neue Adresse gesendet. Bitte klicke auf den Link, um die Änderung zu aktivieren.
          </div>
        ) : (
          <form onSubmit={handleEmailChange} className="flex flex-col gap-3">
            {emailStatus === "error" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" /> {emailError}
              </div>
            )}
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Neue E-Mail-Adresse"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={emailStatus === "loading" || !newEmail}
              className="self-start rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {emailStatus === "loading" ? "Wird gesendet…" : "E-Mail ändern"}
            </button>
          </form>
        )}
      </div>

      {/* Passwort ändern */}
      <div className="rounded-2xl border border-border/50 bg-surface p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Passwort ändern</p>
            <p className="text-sm text-muted">Neues Passwort festlegen</p>
          </div>
        </div>

        {pwStatus === "success" ? (
          <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-600">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Passwort erfolgreich geändert.
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
            {pwStatus === "error" && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" /> {pwError}
              </div>
            )}
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Aktuelles Passwort"
              className={inputClass}
            />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Neues Passwort (min. 6 Zeichen)"
              className={inputClass}
            />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Neues Passwort bestätigen"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={pwStatus === "loading" || !currentPassword || !newPassword || !confirmPassword}
              className="self-start rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {pwStatus === "loading" ? "Wird gespeichert…" : "Passwort ändern"}
            </button>
          </form>
        )}
      </div>

      {/* Goose hint */}
      <div className="rounded-2xl border border-border/50 bg-surface p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">🪿</span>
          <div>
            <p className="font-semibold text-foreground">Deine Gans</p>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Deiner Gans einen Namen geben, Federn sammeln und Skins freischalten — das alles passiert in der voeez App, sobald dein Ei geschlüpft ist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
