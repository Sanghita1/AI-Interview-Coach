// API client for AI Interview Coach FastAPI backend.
// Base URL configurable via VITE_API_URL (defaults to http://localhost:8000).

const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:8000";

const SESSION_KEY = "aic_session_id";

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setSessionId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, id);
}

export function clearSessionId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) {
        msg = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export interface CreateSessionResponse {
  session_id: string;
  [k: string]: any;
}

export async function createSession(): Promise<CreateSessionResponse> {
  const res = await fetch(`${API_BASE}/session`, { method: "POST" });
  const data = await handle<CreateSessionResponse>(res);
  if (data?.session_id) setSessionId(data.session_id);
  return data;
}

export async function getSessionState(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/session/${id}`);
  return handle<any>(res);
}

export async function ensureSession(): Promise<string> {
  const existing = getSessionId();
  if (existing) {
    try {
      await getSessionState(existing);
      return existing;
    } catch {
      // stale — recreate
      clearSessionId();
    }
  }
  const created = await createSession();
  return created.session_id;
}

export async function uploadResume(file: File): Promise<any> {
  const id = getSessionId();
  if (!id) throw new Error("No active session. Please start over.");
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(
    `${API_BASE}/resume/upload?session_id=${encodeURIComponent(id)}`,
    { method: "POST", body: form },
  );
  return handle<any>(res);
}

export async function submitJobDescription(jobDescription: string): Promise<any> {
  const id = getSessionId();
  if (!id) throw new Error("No active session. Please start over.");
  const res = await fetch(
    `${API_BASE}/job-description?session_id=${encodeURIComponent(id)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobDescription }),
    },
  );
  return handle<any>(res);
}

export interface InterviewProgress {
  current?: number;
  total?: number;
  question_number?: number;
  [k: string]: any;
}

export interface StartInterviewResponse {
  plan?: any;
  question?: any;
  progress?: InterviewProgress;
  [k: string]: any;
}

export async function startInterview(): Promise<StartInterviewResponse> {
  const id = getSessionId();
  if (!id) throw new Error("No active session. Please start over.");
  const res = await fetch(
    `${API_BASE}/interview/start?session_id=${encodeURIComponent(id)}`,
    { method: "POST" },
  );
  return handle<StartInterviewResponse>(res);
}

export interface AnswerResponse {
  evaluation?: any;
  next_question?: any;
  progress?: InterviewProgress;
  [k: string]: any;
}

export async function submitAnswer(answer: string): Promise<AnswerResponse> {
  const id = getSessionId();
  if (!id) throw new Error("No active session. Please start over.");
  const res = await fetch(
    `${API_BASE}/interview/answer?session_id=${encodeURIComponent(id)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    },
  );
  return handle<AnswerResponse>(res);
}

export interface ReportResponse {
  interview_summary?: string;
  overall_score?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: string;
  recommendation_score?: number;
  reasoning?: string;
  [k: string]: any;
}

export async function getReport(): Promise<ReportResponse> {
  const id = getSessionId();
  if (!id) throw new Error("No active session. Please start over.");
  // openapi spec says POST for report generation
  const res = await fetch(
    `${API_BASE}/interview/report?session_id=${encodeURIComponent(id)}`,
    { method: "POST" },
  );
  return handle<ReportResponse>(res);
}

// Helpers for parsing loose backend shapes
export function extractQuestionText(q: any): string {
  if (!q) return "";
  if (typeof q === "string") return q;
  return q.question || q.text || q.prompt || q.content || JSON.stringify(q);
}

export function extractProgress(p: any): { current: number; total: number } {
  if (!p) return { current: 0, total: 0 };
  const current = p.current ?? p.question_number ?? p.index ?? p.answered ?? 0;
  const total = p.total ?? p.total_questions ?? p.count ?? 0;
  return { current: Number(current) || 0, total: Number(total) || 0 };
}
