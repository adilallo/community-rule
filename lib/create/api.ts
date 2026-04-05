import type { CreateFlowState } from "../../app/create/types";

const jsonHeaders = { "Content-Type": "application/json" };

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T;
  return data;
}

/** Supports legacy `{ error: string }` and `{ error: { message: string } }` from API routes. */
function readApiErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object" || !("error" in data)) {
    return "Request failed";
  }
  const err = (data as { error: unknown }).error;
  if (typeof err === "string") {
    return err;
  }
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message: unknown }).message;
    if (typeof m === "string") {
      return m;
    }
  }
  return "Request failed";
}

export async function fetchAuthSession(): Promise<{
  user: { id: string; email: string } | null;
}> {
  const res = await fetch("/api/auth/session", {
    credentials: "include",
  });
  if (!res.ok) {
    return { user: null };
  }
  return parseJson(res);
}

export async function requestOtp(email: string): Promise<{ ok: true } | { error: string }> {
  const res = await fetch("/api/auth/otp/request", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify({ email }),
  });
  const data = await parseJson<{ error?: string }>(res);
  if (!res.ok) {
    return { error: readApiErrorMessage(data) };
  }
  return { ok: true };
}

export async function verifyOtp(
  email: string,
  code: string,
): Promise<
  { ok: true; user: { id: string; email: string } } | { error: string }
> {
  const res = await fetch("/api/auth/otp/verify", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify({ email, code }),
  });
  const data = await parseJson<{
    error?: string;
    user?: { id: string; email: string };
  }>(res);
  if (!res.ok || !data.user) {
    return { error: readApiErrorMessage(data) };
  }
  return { ok: true, user: data.user };
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchDraftFromServer(): Promise<CreateFlowState | null> {
  const res = await fetch("/api/drafts/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  const data = await parseJson<{ draft: { payload: unknown } | null }>(res);
  if (!data.draft?.payload || typeof data.draft.payload !== "object") {
    return null;
  }
  return data.draft.payload as CreateFlowState;
}

export async function saveDraftToServer(state: CreateFlowState): Promise<boolean> {
  const res = await fetch("/api/drafts/me", {
    method: "PUT",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify({ payload: state }),
  });
  return res.ok;
}

export async function publishRule(input: {
  title: string;
  summary?: string;
  document: Record<string, unknown>;
}): Promise<
  | { ok: true; id: string; title: string }
  | { error: string }
> {
  const res = await fetch("/api/rules", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify({
      title: input.title,
      summary: input.summary,
      document: input.document,
    }),
  });
  const data = await parseJson<{
    error?: string;
    rule?: { id: string; title: string };
  }>(res);
  if (!res.ok || !data.rule) {
    return { error: readApiErrorMessage(data) };
  }
  return { ok: true, id: data.rule.id, title: data.rule.title };
}
