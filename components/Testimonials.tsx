import ScrollReveal from "@/components/ScrollReveal";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

const avatarColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Ich spare jeden Tag mindestens eine halbe Stunde. Mein Posteingang ist leer, meine Notizen sind vollständig, und ich kann mich auf die eigentliche Arbeit konzentrieren.",
    name: "Marvin H.",
    role: "Freelance Designer",
    company: "Berlin",
    initials: "MH",
  },
  {
    quote:
      "Am ersten Tag hat voeez mir direkt eine Stunde zurückgegeben. Ich kann jetzt direkt viel mehr schreiben und komme entspannter im Feierabend an.",
    name: "Julia M.",
    role: "Product Managerin",
    company: "München",
    initials: "JM",
  },
  {
    quote:
      "Selbst wenn im ICE das WLAN wieder weg ist kann ich voeez weiter nutzen. Seitdem schreibe ich meine ganzen Gedanken nach einem Call direkt mit voeez auf und vergesse viel weniger.",
    name: "Jonas G.",
    role: "Produkt Manager",
    company: "Berlin",
    initials: "JG",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-primary/25 bg-primary-light px-4 py-1.5">
            <span className="text-xs font-semibold tracking-wide text-primary">
              Was andere sagen
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Echte Menschen. Echte Ergebnisse.
          </h2>
        </div>

        {/* Testimonial grid */}
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, index: number) => (
            <ScrollReveal key={t.name} delay={index * 100}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:shadow-md sm:p-8">
                {/* Stars */}
                <div className="mb-4 flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-base">★</span>
                  ))}
                </div>

                {/* Large decorative opening quote */}
                <div className="mb-0 text-6xl font-black leading-none text-primary/12 select-none">
                  &ldquo;
                </div>

                {/* Quote */}
                <p className="flex-1 -mt-2 text-sm leading-relaxed text-foreground">
                  {t.quote}
                </p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${avatarColors[index % avatarColors.length]} text-sm font-bold text-white shadow-sm`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
