import { Globe, Zap, WifiOff, Languages, Bird, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  accent: string;
}

const features: Feature[] = [
  {
    icon: Globe,
    title: "In jeder App",
    description:
      "Mail, Slack, Notion, Terminal — egal wo du arbeitest. Einmal einrichten, überall diktieren. Kein Wechsel, kein Kopieren.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    accent: "group-hover:shadow-blue-100/80",
  },
  {
    icon: Zap,
    title: "Echtzeit",
    description:
      "Deine Worte erscheinen sofort als Text, während du noch redest. Keine Pause, keine Verzögerung.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    accent: "group-hover:shadow-amber-100/80",
  },
  {
    icon: WifiOff,
    title: "Offline-Modus",
    description:
      "Kein WLAN? Kein Problem. voeez läuft komplett lokal auf deinem Mac — schnell, privat, zuverlässig.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    accent: "group-hover:shadow-emerald-100/80",
  },
  {
    icon: Languages,
    title: "14+ Sprachen",
    description:
      "Sprich auf Deutsch, Text erscheint auf Englisch. Oder umgekehrt. Live-Übersetzung in über 14 Sprachen.",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    accent: "group-hover:shadow-violet-100/80",
  },
  {
    icon: Bird,
    title: "Für dich gemacht",
    description:
      "voeez merkt sich, wie du arbeitest. Deine Gans wächst mit jedem Wort — Achievements, Skins, persönliche Stats.",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    accent: "group-hover:shadow-orange-100/80",
  },
  {
    icon: Shield,
    title: "Sicher",
    description:
      "Im Offline-Modus bleiben alle Daten auf deinem Gerät. Im Cloud-Modus: TLS 1.2+ Verschlüsselung. Deine Stimme gehört dir.",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
    accent: "group-hover:shadow-teal-100/80",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/images/goose-features.png"
              alt="Produktive Gans in allen Apps"
              width={110}
              height={110}
            />
          </div>
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/25 bg-primary-light px-4 py-1.5">
            <span className="text-xs font-semibold tracking-wide text-primary">
              Was du bekommst
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Alles inklusive. Sofort.
          </h2>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 75}>
              <div className={`group h-full rounded-2xl border border-border bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg ${feature.accent} sm:p-7`}>
                <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.iconBg} ${feature.iconColor}`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
