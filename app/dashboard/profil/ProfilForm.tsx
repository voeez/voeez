"use client";

import { User, Mail } from "lucide-react";

interface Props {
  email: string;
}

export default function ProfilForm({ email }: Props) {
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

      {/* E-Mail */}
      <div className="rounded-2xl border border-border/50 bg-surface p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">E-Mail-Adresse</p>
            <p className="text-sm text-muted">Dein Anmelde-Account</p>
          </div>
        </div>
        <p className="text-sm text-foreground rounded-xl border border-border/60 bg-surface-light px-4 py-2.5">
          {email || "—"}
        </p>
        <p className="mt-3 text-xs text-muted">
          E-Mail-Änderungen bitte über den Support anfragen.
        </p>
      </div>

      {/* Goose hint */}
      <div className="rounded-2xl border border-border/50 bg-surface p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">🪿</span>
          <div>
            <p className="font-semibold text-foreground">Deine Gans</p>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Deiner Gans einen Namen geben, Federn sammeln und Skins
              freischalten — das alles passiert in der voeez App, sobald
              dein Ei geschlüpft ist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
