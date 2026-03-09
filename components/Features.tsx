import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

interface Feature {
  image: string;
  title: string;
  description: string;
  accent: string;
}

const features: Feature[] = [
  {
    image: "/images/goose-features.png",
    title: "In jeder App",
    description:
      "Mail, Slack, Notion, Terminal — egal wo du arbeitest. Einmal einrichten, überall diktieren. Kein Wechsel, kein Kopieren.",
    accent: "group-hover:shadow-blue-100/80",
  },
  {
    image: "/images/fast-transcription.png",
    title: "Blitzschnell",
    description:
      "Deine Worte erscheinen direkt als Text, sobald du die Taste wieder loslässt. Keine Verzögerung: Du kannst deine Gedanken einfach frei aussprechen.",
    accent: "group-hover:shadow-amber-100/80",
  },
  {
    image: "/images/no-wifi.png",
    title: "Offline-Modus",
    description:
      "Kein WLAN? Kein Problem. voeez bietet dir einen Offline-Modus — schnell, privat, zuverlässig.",
    accent: "group-hover:shadow-emerald-100/80",
  },
  {
    image: "/images/multilanguage.png",
    title: "14+ Sprachen",
    description:
      "Sprich auf Deutsch, Text erscheint auf Englisch. Oder umgekehrt. Live-Übersetzung in über 14 Sprachen.",
    accent: "group-hover:shadow-violet-100/80",
  },
  {
    image: "/images/multilanguage.png",
    title: "Für dich gemacht",
    description:
      "Erstelle dein eigenes Wörterbuch und Abkürzungen, damit du gleiche Sachen nicht immer komplett sagen musst. Außerdem wächst deine Gans mit jedem Wort — Achievements, Skins, persönliche Stats.",
    accent: "group-hover:shadow-orange-100/80",
  },
  {
    image: "/images/data-secure.png",
    title: "Sicher",
    description:
      "Im Offline-Modus bleiben alle Daten auf deinem Gerät. Im Cloud-Modus: TLS 1.2+ Verschlüsselung. Deine Stimme gehört dir.",
    accent: "group-hover:shadow-teal-100/80",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
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
              <div className={`group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg ${feature.accent} sm:p-7`}>
                {/* Illustration */}
                <div className="mb-5 flex h-20 items-center justify-center">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={80}
                    height={80}
                    className="object-contain drop-shadow-sm"
                  />
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
