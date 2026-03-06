import Link from "next/link";
import { CheckCircle, Download, Mail, LayoutDashboard, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Kauf erfolgreich – voeez",
  description: "Dein voeez-Abo ist aktiv. Lade jetzt die App herunter.",
};

const steps = [
  {
    icon: Mail,
    title: "E-Mail bestätigen",
    description:
      "Du erhältst gleich eine E-Mail mit einem Link zum Festlegen deines Passworts. Bitte überprüfe auch deinen Spam-Ordner.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Download,
    title: "App herunterladen",
    description:
      "Lade voeez für macOS herunter und ziehe sie in deinen Programme-Ordner.",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard öffnen",
    description:
      "Melde dich mit deiner E-Mail an und verwalte dein Abo im Dashboard.",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
];

export default function CheckoutSuccessPage() {
  const downloadUrl = process.env.NEXT_PUBLIC_DOWNLOAD_URL ?? "/download";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
      {/* Glow background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="w-full max-w-lg">
        {/* Success icon */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-400/10">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Zahlung erfolgreich! 🎉
          </h1>
          <p className="mt-3 text-base text-muted">
            Willkommen bei voeez. Dein 7-tägiger Testzeitraum hat begonnen.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-start gap-4 rounded-2xl border border-border/50 bg-surface p-5"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${step.bgColor}`}
              >
                <step.icon className={`h-5 w-5 ${step.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted">
                    Schritt {index + 1}
                  </span>
                </div>
                <p className="font-semibold text-foreground">{step.title}</p>
                <p className="mt-0.5 text-sm text-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={downloadUrl}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
          >
            <Download className="h-4 w-4" />
            App herunterladen
          </a>
          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-light"
          >
            Dashboard öffnen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Fragen? Schreib uns an{" "}
          <a
            href="mailto:support@voeez.app"
            className="text-primary underline underline-offset-2"
          >
            support@voeez.app
          </a>
        </p>
      </div>
    </div>
  );
}
