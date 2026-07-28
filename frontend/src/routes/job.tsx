import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Stepper } from "./upload";
import { getSessionId, submitJobDescription } from "@/lib/api";

export const Route = createFileRoute("/job")({
  head: () => ({
    meta: [
      { title: "Job Description — AI Interview Coach" },
      { name: "description", content: "Paste the job description you're preparing for." },
      { property: "og:title", content: "Job Description — AI Interview Coach" },
      { property: "og:description", content: "Paste a job description to tailor your interview." },
    ],
  }),
  component: JobPage,
});

function JobPage() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!getSessionId()) {
      toast.error("No active session — please start again");
      navigate({ to: "/" });
    }
  }, [navigate]);

  async function handleSubmit() {
    if (text.trim().length < 30) {
      toast.error("Please paste a longer job description");
      return;
    }
    setSubmitting(true);
    try {
      await submitJobDescription(text);
      toast.success("Job description saved");
      navigate({ to: "/preparing" });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save job description");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
        <Stepper current={2} />
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Paste the job description</h1>
        <p className="mt-2 text-muted-foreground">
          The more detail, the better the interview questions will be.
        </p>

        <div className="mt-6 rounded-2xl border bg-card p-4 shadow-soft">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full job description here..."
            className="min-h-[280px] resize-y border-0 focus-visible:ring-0 shadow-none px-2"
          />
          <div className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
            <span>{text.length} characters</span>
            <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-gradient-primary text-primary-foreground shadow-elegant"
          >
            {submitting ? "Saving..." : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
