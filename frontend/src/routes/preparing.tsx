import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { getSessionId, startInterview } from "@/lib/api";

export const Route = createFileRoute("/preparing")({
  head: () => ({
    meta: [
      { title: "Preparing Interview — AI Interview Coach" },
      { name: "description", content: "Building your personalized interview plan." },
      { property: "og:title", content: "Preparing Interview" },
      { property: "og:description", content: "Building your personalized interview plan." },
    ],
  }),
  component: PreparingPage,
});

function PreparingPage() {
  const navigate = useNavigate();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!getSessionId()) {
      toast.error("No active session — please start again");
      navigate({ to: "/" });
      return;
    }

    (async () => {
      try {
        const data = await startInterview();
        sessionStorage.setItem("aic_start_payload", JSON.stringify(data));
        navigate({ to: "/interview" });
      } catch (e: any) {
        toast.error(e?.message ?? "Failed to start interview");
        navigate({ to: "/job" });
      }
    })();
  }, [navigate]);

  return (
    <AppShell>
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 -m-6 rounded-full bg-gradient-primary opacity-20 blur-2xl animate-pulse" />
          <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-gradient-primary shadow-elegant">
            <Loader2 className="h-9 w-9 animate-spin text-primary-foreground" />
          </div>
        </div>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          Preparing your personalized interview...
        </h1>
        <p className="mt-3 text-muted-foreground">
          Analyzing your resume and the role — this usually takes a few seconds.
        </p>
      </div>
    </AppShell>
  );
}
