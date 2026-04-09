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

export async function requestMagicLink(
  email: string,
  nextPath?: string,
): Promise<{ ok: true } | { ok: false; error: string; retryAfterMs?: number }> {
  const res = await fetch("/api/auth/magic-link/request", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify({
      email,
      ...(nextPath ? { next: nextPath } : {}),
    }),
  });
  const data = await parseJson<{ error?: string; retryAfterMs?: number }>(res);
  if (!res.ok) {
    return {
      ok: false,
      error: readApiErrorMessage(data),
      retryAfterMs:
        typeof data.retryAfterMs === "number" ? data.retryAfterMs : undefined,
    };
  }
  return { ok: true };
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

const DRAFT_SAVE_NETWORK_ERROR =
  "Something went wrong. Check your connection and try again.";

const PUBLISH_FAILED_FALLBACK =
  "Something went wrong. Check your connection or try again.";

/** Parse JSON body; empty or invalid bodies return `null` (avoids `response.json()` throws). */
async function safeParseJsonResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}

export type SaveDraftResult =
  | { ok: true }
  | { ok: false; message: string; status?: number };

async function errorBodyMessage(res: Response): Promise<string> {
  try {
    const data: unknown = await res.json();
    const msg = readApiErrorMessage(data);
    if (msg !== "Request failed") return msg;
  } catch {
    /* non-JSON body */
  }
  const statusText = res.statusText?.trim();
  if (statusText) return statusText;
  return "Save failed";
}

export async function saveDraftToServer(
  state: CreateFlowState,
): Promise<SaveDraftResult> {
  try {
    const res = await fetch("/api/drafts/me", {
      method: "PUT",
      credentials: "include",
      headers: jsonHeaders,
      body: JSON.stringify({ payload: state }),
    });
    if (res.ok) {
      return { ok: true as const };
    }
    const message = await errorBodyMessage(res);
    return {
      ok: false as const,
      message,
      status: res.status,
    };
  } catch {
    return {
      ok: false as const,
      message: DRAFT_SAVE_NETWORK_ERROR,
    };
  }
}

export async function publishRule(input: {
  title: string;
  summary?: string;
  document: Record<string, unknown>;
}): Promise<
  | { ok: true; id: string; title: string }
  | { ok: false; error: string; status?: number }
> {
  try {
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
    const data = (await safeParseJsonResponse(res)) as {
      error?: string | { message?: string };
      rule?: { id: string; title: string };
    } | null;
    const rule = data && typeof data === "object" ? data.rule : undefined;
    if (!res.ok || !rule) {
      const fromBody =
        data && typeof data === "object" ? readApiErrorMessage(data) : null;
      const msg =
        fromBody && fromBody !== "Request failed"
          ? fromBody
          : res.statusText?.trim() || PUBLISH_FAILED_FALLBACK;
      return {
        ok: false as const,
        error: msg,
        status: res.status,
      };
    }
    return { ok: true, id: rule.id, title: rule.title };
  } catch {
    return {
      ok: false as const,
      error: DRAFT_SAVE_NETWORK_ERROR,
    };
  }
}
