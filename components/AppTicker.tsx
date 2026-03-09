import Image from "next/image";

const apps = [
  { icon: "/icons/slack.png",    name: "Slack" },
  { icon: "/icons/github.png",   name: "GitHub" },
  { icon: "/icons/vscode.png",   name: "VS Code" },
  { icon: "/icons/whatsapp.png", name: "WhatsApp" },
  { icon: "/icons/telegram.png", name: "Telegram" },
  { icon: "/icons/obsidian.png", name: "Obsidian" },
  { icon: "/icons/safari.png",   name: "Safari" },
  { icon: "/icons/chrome.png",   name: "Chrome" },
  { icon: "/icons/outlook.png",  name: "Outlook" },
  { icon: "/icons/teams.png",    name: "Teams" },
  { icon: "/icons/terminal.png", name: "Terminal" },
  { icon: "/icons/ppt.png",      name: "PowerPoint" },
  { icon: "/icons/gemini.png",   name: "Gemini" },
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
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {doubled.map((app, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-background px-5 py-3 text-sm font-medium text-foreground shadow-sm"
            >
              <Image
                src={app.icon}
                alt={app.name}
                width={20}
                height={20}
                className="rounded-md"
              />
              <span>{app.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
