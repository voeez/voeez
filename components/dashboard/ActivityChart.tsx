"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface DailyDataPoint {
  date: string; // "YYYY-MM-DD"
  words: number;
  minutes: number;
  transcriptions: number;
}

type Metric = "words" | "minutes" | "transcriptions";
type Preset = 7 | 30 | 90;

const METRIC_CONFIG: Record<
  Metric,
  { label: string; unit: string; color: string }
> = {
  words: { label: "Wörter", unit: "Wörter", color: "#3B82F6" },
  minutes: { label: "Zeit gespart", unit: "Min.", color: "#10B981" },
  transcriptions: { label: "Transkriptionen", unit: "", color: "#A78BFA" },
};

function formatDate(dateStr: string, short = false): string {
  const date = new Date(dateStr + "T00:00:00");
  if (short) {
    return date.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  }
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

function toInputDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, metric }: any) {
  if (!active || !payload?.length) return null;
  const cfg = METRIC_CONFIG[metric as Metric];
  const value = payload[0]?.value ?? 0;
  return (
    <div className="rounded-xl border border-border/60 bg-foreground px-3.5 py-2.5 shadow-xl">
      <p className="text-xs text-white/50">{formatDate(label)}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">
        {value.toLocaleString("de-DE")}
        {cfg.unit ? ` ${cfg.unit}` : ""}
      </p>
    </div>
  );
}

interface Props {
  data: DailyDataPoint[];
}

export default function ActivityChart({ data }: Props) {
  const [metric, setMetric] = useState<Metric>("words");
  const [preset, setPreset] = useState<Preset | null>(30);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filtered = useMemo(() => {
    if (preset) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - preset);
      const cutoffStr = toInputDate(cutoff);
      return data.filter((d) => d.date >= cutoffStr);
    }
    if (fromDate && toDate) {
      return data.filter((d) => d.date >= fromDate && d.date <= toDate);
    }
    return data;
  }, [data, preset, fromDate, toDate]);

  const cfg = METRIC_CONFIG[metric];

  // Summary stats for the filtered range
  const totalWords = filtered.reduce((s, d) => s + d.words, 0);
  const totalMinutes = filtered.reduce((s, d) => s + d.minutes, 0);
  const totalTranscriptions = filtered.reduce((s, d) => s + d.transcriptions, 0);

  // X-axis tick density
  const tickInterval = filtered.length <= 7 ? 0 : filtered.length <= 31 ? 6 : 13;

  const gradientId = `gradient-${metric}`;

  return (
    <div className="rounded-2xl border border-border/50 bg-surface p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Aktivität</h2>
          <p className="mt-0.5 text-sm text-muted">
            Deine Nutzung im Zeitverlauf
          </p>
        </div>

        {/* Metric toggle */}
        <div className="flex rounded-xl border border-border/60 bg-surface-light p-1 gap-1">
          {(Object.keys(METRIC_CONFIG) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                metric === m
                  ? "bg-white shadow-sm text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {METRIC_CONFIG[m].label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary numbers */}
      <div className="mt-4 flex gap-6 border-b border-border/40 pb-4">
        <div>
          <p className="text-xs text-muted">Wörter</p>
          <p className="text-xl font-bold text-foreground">
            {totalWords.toLocaleString("de-DE")}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Zeit gespart</p>
          <p className="text-xl font-bold text-foreground">
            {totalMinutes.toLocaleString("de-DE")} Min.
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Transkriptionen</p>
          <p className="text-xl font-bold text-foreground">
            {totalTranscriptions.toLocaleString("de-DE")}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filtered}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cfg.color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E2E8F0"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickLine={false}
              axisLine={false}
              interval={tickInterval}
              tickFormatter={(v) => formatDate(v, true)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
              }
            />
            <Tooltip
              content={<CustomTooltip metric={metric} />}
              cursor={{ stroke: cfg.color, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={cfg.color}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: cfg.color, stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Date range controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {/* Preset buttons */}
        {([7, 30, 90] as Preset[]).map((p) => (
          <button
            key={p}
            onClick={() => {
              setPreset(p);
              setFromDate("");
              setToDate("");
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all border ${
              preset === p
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 text-muted hover:text-foreground hover:border-border"
            }`}
          >
            {p === 7 ? "7 Tage" : p === 30 ? "30 Tage" : "3 Monate"}
          </button>
        ))}

        <span className="text-muted text-xs">·</span>

        {/* Custom range */}
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={fromDate}
            max={toDate || toInputDate(new Date())}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPreset(null);
            }}
            className="rounded-lg border border-border/60 bg-surface-light px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
          />
          <span className="text-xs text-muted">–</span>
          <input
            type="date"
            value={toDate}
            min={fromDate}
            max={toInputDate(new Date())}
            onChange={(e) => {
              setToDate(e.target.value);
              setPreset(null);
            }}
            className="rounded-lg border border-border/60 bg-surface-light px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
