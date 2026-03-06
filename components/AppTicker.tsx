const apps = [
  { emoji: "📧", name: "Mail" },
  { emoji: "💬", name: "Slack" },
  { emoji: "📝", name: "Notion" },
  { emoji: "🐙", name: "GitHub" },
  { emoji: "💻", name: "VS Code" },
  { emoji: "📱", name: "WhatsApp" },
  { emoji: "📄", name: "Google Docs" },
  { emoji: "🎮", name: "Discord" },
  { emoji: "✈️", name: "Telegram" },
  { emoji: "📖", name: "Pages" },
  { emoji: "📓", name: "Notes" },
  { emoji: "⌨️", name: "Terminal" },
  { emoji: "🔮", name: "Obsidian" },
  { emoji: "🌐", name: "Safari" },
  { emoji: "🖊️", name: "Word" },
];

export default function AppTicker() {
  const doubled = [...apps, ...apps];

  return (
    <section className="border-y border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-muted">
          Funktioniert überall, wo du tippst
        </p>
      </div>

      {/* Ticker */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-28 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-28 bg-gradient-to-l from-surface to-transparent" />

        <div
          className="flex gap-3"
          style={{ animation: "marquee 25s linear infinite" }}
        >
          {doubled.map((app, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-background px-5 py-3 text-sm font-medium text-foreground shadow-sm"
            >
              <span className="text-lg leading-none">{app.emoji}</span>
              <span>{app.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
