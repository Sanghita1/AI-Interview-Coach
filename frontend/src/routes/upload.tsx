import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, FileText, Upload, CheckCircle2 } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { getSessionId, uploadResume } from "@/lib/api";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Resume — AI Interview Coach" },
      { name: "description", content: "Upload your resume to personalize your mock interview." },
      { property: "og:title", content: "Upload Resume — AI Interview Coach" },
      { property: "og:description", content: "Upload your resume as a PDF to start." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (!getSessionId()) {
      toast.error("No active session — please start again");
      navigate({ to: "/" });
    }
  }, [navigate]);

  function pick(f: File | null | undefined) {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf") && f.type !== "application/pdf") {
      toast.error("Only PDF files are accepted");
      return;
    }
    setFile(f);
    setUploaded(false);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    try {
      await uploadResume(file);
      setUploaded(true);
      toast.success("Resume uploaded");
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
        <Stepper current={1} />
        <h1 className="mt-8 text-3xl font-bold tracking-tight">Upload your resume</h1>
        <p className="mt-2 text-muted-foreground">
          We'll use it to tailor interview questions to your background. PDF only.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pick(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={`mt-8 cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
            dragging
              ? "border-primary bg-accent/40"
              : "border-border bg-card hover:border-primary/60 hover:bg-accent/20"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <div className="grid mx-auto h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-soft">
            <Upload className="h-6 w-6 text-primary-foreground" />
          </div>
          <p className="mt-4 font-medium">
            {dragging ? "Drop to upload" : "Drag & drop your PDF here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or <span className="text-primary underline">browse files</span>
          </p>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between rounded-xl border bg-card p-4 shadow-soft animate-fade-in-up">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            {uploaded && (
              <span className="flex items-center gap-1 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" /> Uploaded
              </span>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          {!uploaded ? (
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-gradient-primary text-primary-foreground shadow-elegant"
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </Button>
          ) : (
            <Button
              onClick={() => navigate({ to: "/job" })}
              className="bg-gradient-primary text-primary-foreground shadow-elegant"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export function Stepper({ current }: { current: number }) {
  const steps = ["Resume", "Job", "Interview", "Report"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = idx === current;
        const done = idx < current;
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${
                active
                  ? "bg-primary text-primary-foreground"
                  : done
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {idx}
            </div>
            <span
              className={`hidden sm:inline text-xs ${
                active ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && <div className="h-px w-6 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
