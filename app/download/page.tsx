"use client";

import {
  Download,
  Monitor,
  Cpu,
  HardDrive,
  Sparkles,
  Shield,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { startCheckout } from "@/lib/checkout";

const downloadUrl = process.env.NEXT_PUBLIC_DOWNLOAD_URL;
const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0";

const systemRequirements = [
  { icon: Monitor, label: "macOS 14 Sonoma oder neuer" },
  { icon: Cpu,     label: "Apple Silicon (M1+) oder Intel" },
  { icon: HardDrive, label: "1,5 GB freier Speicherplatz" },
];

const steps = [
  {
    number: "1",
    title: "Herunterladen",
    description: "Lade die voeez .dmg-Datei herunter und öffne sie per Doppelklick.",
  },
  {
    number: "2",
    title: "Installieren",
    description: 'Ziehe das voeez-Symbol in den "Programme"-Ordner. Starte die App danach.',
  },
  {
    number: "3",
    title: "Berechtigungen erteilen",
    description:
      "Erlaube Mikrofon- und Bedienungshilfen-Zugriff — einmalig, damit voeez Text einfügen kann.",
  },
  {
    number: "4",
    title: "Fn-Taste konfigurieren",
    description:
      'Systemeinstellungen → Tastatur → Globe-Taste → "Nichts tun" wählen, damit Fn als Diktiertaste frei ist.',
  },
];

export default function DownloadPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">7 Tage kostenlos</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            voeez für macOS
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Lade voeez herunter und verwandle deine Stimme in Text — direkt auf
            deinem Mac, blitzschnell und privat.
          </p>

          {/* Download CTA */}
          <div className="mt-10 flex flex-col items-center gap-3">
            {downloadUrl ? (
              <>
                <a
                  href={downloadUrl}
                  className="group inline-flex items-center gap-3 rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
                >
                  <Download className="h-6 w-6 transition-transform group-hover:translate-y-0.5" />
                  Download — voeez {appVersion}
                </a>
                <p className="text-sm text-muted">
                  macOS 14+ · Universal Binary (Apple Silicon + Intel) · kostenlos testen
                </p>
              </>
            ) : (
              <>
                {/* Coming soon state */}
                <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-surface px-8 py-4 text-lg font-semibold text-muted">
                  <Download className="h-6 w-6" />
                  Download kommt bald
                </div>
                <p className="text-sm text-muted">
                  Sichere dir jetzt deinen Account — du bekommst den Link sofort nach Release.
                </p>
                <button
                  onClick={() => startCheckout("yearly")}
                  className="mt-1 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark"
                >
                  Jetzt Account sichern
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* System requirements */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            Systemanforderungen
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {systemRequirements.map((req) => (
              <div
                key={req.label}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-surface p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <req.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{req.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation guide */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
            In 4 Schritten startklar
          </h2>
          <div className="mt-12 flex flex-col gap-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-5 rounded-2xl border border-border/50 bg-surface p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <span className="text-base font-bold text-primary">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/10 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Privat by Design
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted">
                voeez läuft komplett lokal auf deinem Mac. Deine Stimme verlässt
                dein Gerät nie — kein Cloud-Zwang, keine Datenweitergabe.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                {[
                  "On-Device Processing",
                  "Kein Cloud-Zwang",
                  "DSGVO-konform",
                ].map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-foreground">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <button
                  onClick={() => startCheckout("yearly")}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
                >
                  7 Tage kostenlos testen
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
