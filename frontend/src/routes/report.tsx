import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  clearSessionId,
  getReport,
  getSessionId,
  type ReportResponse,
} from "@/lib/api";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Interview Report — AI Interview Coach" },
      { name: "description", content: "Your personalized interview performance report." },
      { property: "og:title", content: "Interview Report" },
      { property: "og:description", content: "Scores, strengths, weaknesses, and recommendation." },
    ],
  }),
  component: ReportPage,
});

function recommendationTone(rec?: string) {
  const r = (rec || "").toLowerCase();
  if (r.includes("strong hire")) return "bg-success text-success-foreground";
  if (r.includes("no hire") || r.includes("reject"))
    return "bg-destructive text-destructive-foreground";
  if (r.includes("borderline") || r.includes("maybe"))
    return "bg-warning text-warning-foreground";
  if (r.includes("hire")) return "bg-primary text-primary-foreground";
  return "bg-muted text-foreground";
}

function ReportPage() {
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getSessionId()) {
      toast.error("No active session");
      navigate({ to: "/" });
      return;
    }
    (async () => {
      try {
        const data = await getReport();
        setReport(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to generate report");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <AppShell>
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-primary shadow-elegant">
            <Loader2 className="h-9 w-9 animate-spin text-primary-foreground" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Generating your report...</h1>
          <p className="mt-2 text-muted-foreground">Compiling scores and feedback.</p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <div className="grid mx-auto h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold">Couldn't build the report</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-6" onClick={() => location.reload()}>
            Try again
          </Button>
        </div>
      </AppShell>
    );
  }

  const r = report ?? {};
  const overall = Number(r.overall_score ?? 0);
  const scoreOutOfTen = overall > 10 ? overall / 10 : overall;
  const pct = Math.max(0, Math.min(100, scoreOutOfTen * 10));

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-6">
        <div className="animate-fade-in-up">
          <p className="text-sm text-muted-foreground">Interview Report</p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
            Your Performance
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6 shadow-soft md:col-span-1 flex flex-col items-center text-center">
            <ScoreRing pct={pct} label={scoreOutOfTen.toFixed(1)} />
            <p className="mt-4 text-sm text-muted-foreground">Overall Score</p>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-soft md:col-span-2 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Recommendation
            </p>
            {r.recommendation ? (
              <span
                className={`mt-2 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${recommendationTone(
                  r.recommendation,
                )}`}
              >
                <Award className="h-4 w-4" />
                {r.recommendation}
              </span>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Not provided</p>
            )}
            {r.recommendation_score !== undefined && (
              <p className="mt-3 text-sm text-muted-foreground">
                Confidence: <span className="font-medium text-foreground">{r.recommendation_score}</span>
              </p>
            )}
            {r.interview_summary && (
              <p className="mt-4 text-sm leading-relaxed text-foreground">
                {r.interview_summary}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ListCard
            title="Strengths"
            icon={<CheckCircle2 className="h-4 w-4" />}
            tone="text-success"
            items={r.strengths ?? []}
          />
          <ListCard
            title="Weaknesses"
            icon={<AlertTriangle className="h-4 w-4" />}
            tone="text-warning-foreground"
            items={r.weaknesses ?? []}
          />
        </div>

        {r.reasoning && (
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> Reasoning
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
              {r.reasoning}
            </p>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => {
              clearSessionId();
              navigate({ to: "/" });
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Start a new interview
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function ScoreRing({ pct, label }: { pct: number; label: string }) {
  const size = 140;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="drop-shadow-sm">
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--primary-glow)" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="var(--muted)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#ring)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 800ms ease" }}
      />
      <text
        x="50%"
        y="50%"
        dy="0.35em"
        textAnchor="middle"
        className="fill-foreground"
        fontSize="28"
        fontWeight="700"
      >
        {label}
      </text>
    </svg>
  );
}

function ListCard({
  title,
  icon,
  tone,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  tone: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-soft">
      <div className={`flex items-center gap-2 text-sm font-medium ${tone}`}>
        {icon}
        {title}
      </div>
      {items && items.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {items.map((s, i) => (
            <li
              key={i}
              className="rounded-lg border bg-background/60 px-3 py-2 text-sm leading-relaxed"
            >
              {s}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">None recorded.</p>
      )}
    </div>
  );
}
