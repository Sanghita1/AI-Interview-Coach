import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, MessageSquare, Send, Sparkles } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  extractProgress,
  extractQuestionText,
  getSessionId,
  startInterview,
  submitAnswer,
} from "@/lib/api";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "Interview — AI Interview Coach" },
      { name: "description", content: "Your personalized AI interview in progress." },
      { property: "og:title", content: "Interview in progress" },
      { property: "og:description", content: "Answer questions and get instant feedback." },
    ],
  }),
  component: InterviewPage,
});

interface Evaluation {
  score?: number | string;
  feedback?: string;
  [k: string]: any;
}

function InterviewPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<string>("");
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!getSessionId()) {
      toast.error("No active session — please start again");
      navigate({ to: "/" });
      return;
    }

    const cached = sessionStorage.getItem("aic_start_payload");
    if (cached) {
      try {
        applyStart(JSON.parse(cached));
        setLoading(false);
        sessionStorage.removeItem("aic_start_payload");
        return;
      } catch {
        // fallthrough
      }
    }
    (async () => {
      try {
        const data = await startInterview();
        applyStart(data);
      } catch (e: any) {
        toast.error(e?.message ?? "Failed to load interview");
        navigate({ to: "/job" });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyStart(data: any) {
    setQuestion(extractQuestionText(data?.question));
    setProgress(extractProgress(data?.progress));
  }

  const pct = useMemo(() => {
    if (!progress.total) return 0;
    return Math.min(100, Math.round((progress.current / progress.total) * 100));
  }, [progress]);

  async function handleSubmit() {
    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }
    setSubmitting(true);
    setEvaluation(null);
    try {
      const data = await submitAnswer(answer);
      setEvaluation(data?.evaluation ?? null);

      const completed =
        data?.completed === true ||
        data?.is_complete === true ||
        data?.interview_complete === true ||
        data?.status === "completed" ||
        data?.done === true;

      const nextRaw =
        data?.next_question ??
        (data as any)?.question ??
        (data as any)?.followup ??
        (data as any)?.follow_up ??
        (data as any)?.next;
      const nextQ = extractQuestionText(nextRaw);
      const nextProgress = extractProgress(data?.progress);
      if (nextProgress.total) setProgress(nextProgress);

      if (completed || !nextQ) {
        setDone(true);
      } else {
        setQuestion(nextQ);
        setAnswer("");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="mt-8 h-40 w-full animate-pulse rounded-2xl bg-muted" />
          <div className="mt-6 h-32 w-full animate-pulse rounded-2xl bg-muted" />
        </div>
      </AppShell>
    );
  }

  if (done) {
    return (
      <AppShell>
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-success text-success-foreground shadow-elegant">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">Interview complete</h1>
          <p className="mt-2 text-muted-foreground">
            Nice work. Generate your report to see the full breakdown.
          </p>
          <Button
            onClick={() => navigate({ to: "/report" })}
            className="mt-8 bg-gradient-primary text-primary-foreground shadow-elegant"
            size="lg"
          >
            Generate Final Report <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Question {Math.max(1, progress.current || 1)}
            {progress.total ? ` / ${progress.total}` : ""}
          </span>
          <span className="text-muted-foreground">{pct}%</span>
        </div>
        <Progress value={pct} className="mt-2 h-2" />

        <div className="mt-8 rounded-2xl border bg-card p-6 sm:p-8 shadow-soft animate-fade-in-up">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-soft">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Interviewer
              </p>
              <p className="mt-1 text-lg sm:text-xl font-medium leading-relaxed">
                {question || "..."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border bg-card p-4 shadow-soft">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... Be specific — use examples from your experience."
            className="min-h-[180px] resize-y border-0 focus-visible:ring-0 shadow-none"
            disabled={submitting}
          />
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">
              {answer.length} characters
            </span>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !answer.trim()}
              className="bg-gradient-primary text-primary-foreground shadow-elegant"
            >
              {submitting ? "Evaluating..." : "Submit Answer"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {evaluation && <EvaluationCard evaluation={evaluation} />}
      </div>
    </AppShell>
  );
}

function EvaluationCard({ evaluation }: { evaluation: Evaluation }) {
  const score =
    evaluation.score ??
    evaluation.rating ??
    (evaluation as any).overall_score ??
    null;
  const feedback =
    evaluation.feedback ??
    (evaluation as any).comment ??
    (evaluation as any).comments ??
    (evaluation as any).explanation ??
    "";

  return (
    <div className="mt-6 rounded-2xl border bg-accent/40 p-6 shadow-soft animate-fade-in-up">
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" /> Evaluation
      </div>
      {score !== null && score !== undefined && (
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-bold">{String(score)}</span>
          {typeof score === "number" && score <= 10 && (
            <span className="text-sm text-muted-foreground">/ 10</span>
          )}
        </div>
      )}
      {feedback && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {feedback}
        </p>
      )}
      {!score && !feedback && (
        <pre className="mt-3 overflow-auto rounded bg-background/60 p-3 text-xs">
          {JSON.stringify(evaluation, null, 2)}
        </pre>
      )}
    </div>
  );
}
