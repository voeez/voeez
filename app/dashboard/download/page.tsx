import { Download, Monitor, Cpu, HardDrive, ShieldAlert } from "lucide-react";

const downloadUrl = process.env.NEXT_PUBLIC_DOWNLOAD_URL;
const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0";

const systemRequirements = [
  { icon: Monitor,   label: "macOS 14 Sonoma oder neuer" },
  { icon: Cpu,       label: "Apple Silicon (M1+) oder Intel" },
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
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">voeez herunterladen</h1>
        <p className="mt-1 text-muted">Für macOS — lade die App herunter und leg direkt los.</p>
      </div>

      {/* Download CTA */}
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-6">
        {downloadUrl ? (
          <>
            <a
              href={downloadUrl}
              className="group inline-flex items-center gap-3 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
            >
              <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              voeez {appVersion} herunterladen
            </a>
            <p className="text-sm text-muted">
              macOS 14+ · Universal Binary (Apple Silicon + Intel)
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-3 rounded-xl border border-border bg-surface px-6 py-3.5 text-base font-semibold text-muted">
              <Download className="h-5 w-5" />
              Download kommt in Kürze
            </div>
            <p className="text-sm text-muted">
              Du bekommst eine E-Mail sobald der Download bereit ist.
            </p>
          </>
        )}
      </div>

      {/* Gatekeeper hint */}
      {downloadUrl && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/40 dark:bg-amber-900/10">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Erster Start: macOS-Sicherheitshinweis</p>
            <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-500">
              Beim ersten Öffnen zeigt macOS eine Warnung. Klicke die App im Finder mit{" "}
              <strong>Rechtsklick → &quot;Öffnen&quot;</strong> an — dann erscheint ein Dialog mit &quot;Trotzdem öffnen&quot;.
              Das ist einmalig nötig.
            </p>
          </div>
        </div>
      )}

      {/* System requirements */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Systemanforderungen</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {systemRequirements.map((req) => (
            <div
              key={req.label}
              className="flex items-center gap-4 rounded-2xl border border-border/50 bg-surface p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <req.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">{req.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Installation guide */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">In 4 Schritten startklar</h2>
        <div className="mt-4 flex flex-col gap-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-4 rounded-2xl border border-border/50 bg-surface p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <span className="text-sm font-bold text-primary">{step.number}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
