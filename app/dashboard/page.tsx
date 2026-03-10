import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FileText, Clock, Feather, Bird, ArrowUpRight, MessageSquarePlus, ThumbsUp } from "lucide-react";
import ActivityChart, { DailyDataPoint } from "@/components/dashboard/ActivityChart";

// Set this to your Canny board URL once you create a free account at canny.io
// e.g. "https://voeez.canny.io"
const FEATURE_BOARD_URL = "https://voeez.canny.io/voeez-beta";


interface UserStats {
  total_words: number;
  total_transcriptions: number;
  time_saved_minutes: number;
  goose_stage: string;
  daily_stats?: DailyDataPoint[];
}

interface UserProfile {
  goose_name: string | null;
  subscription_status: string | null;
  subscription_plan: string | null;
}

async function getUserData(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  let profile: UserProfile | null = null;
  let stats: UserStats | null = null;

  try {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("goose_name, subscription_status, subscription_plan")
      .eq("id", userId)
      .single();
    profile = profileData;
  } catch {
    // Table may not exist yet — that's fine
  }

  try {
    const { data: statsData } = await supabase
      .from("user_stats")
      .select("total_words, total_transcriptions, time_saved_minutes, goose_stage, daily_stats")
      .eq("user_id", userId)
      .single();
    stats = statsData;
  } catch {
    // Table may not exist yet — that's fine
  }

  return { profile, stats };
}

export default async function DashboardPage() {
  let profile: UserProfile | null = null;
  let stats: UserStats | null = null;
  let chartData: DailyDataPoint[] = [];

  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    redirect("/login");
  }
  if (!user) redirect("/login");
  const data = await getUserData(supabase, user.id);
  profile = data.profile;
  stats = data.stats;
  if (Array.isArray(stats?.daily_stats)) {
    chartData = stats.daily_stats;
  }

  const displayName =
    user?.user_metadata?.first_name ||
    profile?.goose_name ||
    "";
  const isTrialing = profile?.subscription_status === "trialing";

  const statCards = [
    {
      label: "Gesamte Wörter",
      value: stats?.total_words?.toLocaleString("de-DE") ?? "0",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Transkriptionen",
      value: stats?.total_transcriptions?.toLocaleString("de-DE") ?? "0",
      icon: Feather,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      label: "Zeitersparnis",
      value: `${stats?.time_saved_minutes ?? 0} Min.`,
      icon: Clock,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Gans-Stufe",
      value: stats?.goose_stage ?? "Egg",
      icon: Bird,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <span className="text-3xl">🪿</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {displayName ? `Willkommen, ${displayName}!` : "Willkommen!"}
          </h1>
          <p className="mt-1 text-muted">
            Hier ist dein Überblick auf einen Blick.
          </p>
        </div>
      </div>

      {/* Trial banner */}
      {isTrialing && (
        <div className="flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">⏳</span>
            <div>
              <p className="font-semibold text-foreground">Dein Test läuft</p>
              <p className="text-sm text-muted">
                Nach 7 Tagen wird automatisch dein gewählter Plan aktiviert.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/abo"
            className="shrink-0 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-light"
          >
            Plan ansehen
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="flex items-start gap-4 rounded-2xl border border-border/50 bg-surface p-5"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.bgColor}`}
            >
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted">{card.label}</p>
              <p className="mt-0.5 text-xl font-bold text-foreground">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Beta feedback banner — always visible, helps collect early feedback */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-xl">🐣</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-foreground">Du bist ein Beta-Nutzer</h2>
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                  BETA
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                Dein Feedback formt das Produkt direkt. Was vermisst du? Was nervt? Was liebst du?
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/feedback"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-light"
            >
              <MessageSquarePlus className="h-4 w-4" />
              Feedback geben
            </Link>
            <a
              data-canny-link
              href={FEATURE_BOARD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark"
            >
              <ThumbsUp className="h-4 w-4" />
              Features vorschlagen &amp; voten
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Aktivitäts-Chart */}
      <ActivityChart data={chartData} />
    </div>
  );
}
