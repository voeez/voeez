import { Keyboard, Mic, Type } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface Step {
  number: number;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: Keyboard,
    title: "Kürzel drücken",
    description:
      "Einmal einrichten, überall nutzen. Drücke dein Tastenkürzel und voeez hört sofort zu.",
  },
  {
    number: 2,
    icon: Mic,
    title: "Einfach reden",
    description:
      "KI wandelt deine Sprache in präzisen, sauberen Text um — in Echtzeit.",
  },
  {
    number: 3,
    icon: Type,
    title: "Text erscheint",
    description:
      "Direkt da, wo du ihn brauchst. Kein Kopieren, kein Einfügen, kein App-Wechsel.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/25 bg-primary-light px-4 py-1.5">
            <span className="text-xs font-semibold tracking-wide text-primary">
              So funktioniert&apos;s
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Drei Schritte. Fertig.
          </h2>
        </div>

        {/* Steps */}
        <div className="relative mt-16">
          {/* Connecting line - desktop */}
          <div className="absolute top-8 right-[calc(16.67%)] left-[calc(16.67%)] hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block" />

          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollReveal
                  key={step.number}
                  delay={index * 120}
                  className="flex-1"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Gradient circle with icon */}
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/25 text-white">
                      <Icon size={26} strokeWidth={1.8} />
                      {/* Step number badge */}
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-bold text-white">
                        {step.number}
                      </span>
                    </div>

                    {/* Connecting line - mobile */}
                    {step.number < 3 && (
                      <div className="my-2 h-8 w-px bg-gradient-to-b from-primary/30 to-transparent lg:hidden" />
                    )}

                    <h3 className="mt-6 text-xl font-semibold text-foreground lg:mt-8">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
