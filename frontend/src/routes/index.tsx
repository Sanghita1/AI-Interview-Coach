import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Sparkles, FileText, MessageSquare, BarChart3 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { createSession, clearSessionId } from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Interview Coach — Ace Your Next Interview" },
      {
        name: "description",
        content:
          "Upload your resume, paste a job description, and practice a personalized mock interview with instant AI feedback.",
      },
      { property: "og:title", content: "AI Interview Coach" },
      {
        property: "og:description",
        content:
          "Personalized AI mock interviews with instant feedback and a final performance report.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    try {
      clearSessionId();
      await createSession();
      toast.success("Session created");
      navigate({ to: "/upload" });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to start a new session");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-primary shadow-soft">
              <Sparkles className="h-3.5 w-3.5" />
              Powered by AI
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Practice smarter.{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Interview stronger.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Get a personalized mock interview built from your resume and the job
              you're targeting. Receive scores, feedback, and a full performance
              report — instantly.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                onClick={handleStart}
                disabled={loading}
                className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95"
              >
                {loading ? "Starting..." : "Start Interview"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "Upload your resume",
              body: "We extract your experience and skills to tailor the questions to you.",
            },
            {
              icon: MessageSquare,
              title: "Answer live questions",
              body: "Realistic role-specific questions with real-time evaluation.",
            },
            {
              icon: BarChart3,
              title: "Get a full report",
              body: "Strengths, weaknesses, and a hiring recommendation with reasoning.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-6 shadow-soft transition hover:shadow-elegant"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
