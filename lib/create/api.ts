import type { CreateFlowState } from "../../app/(app)/create/types";
import { migrateLegacyCreateFlowState } from "./migrateLegacyCreateFlowState";

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

/** CR-103: send verify link to `newEmail` for the signed-in user. */
export async function requestEmailChange(
  newEmail: string,
): Promise<{ ok: true } | { ok: false; error: string; retryAfterMs?: number }> {
  const res = await fetch("/api/user/email-change/request", {
    method: "POST",
    credentials: "include",
    headers: jsonHeaders,
    body: JSON.stringify({ newEmail }),
  });
  const data: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    let retryAfterMs: number | undefined;
    if (
      res.status === 429 &&
      data &&
      typeof data === "object" &&
      "details" in data
    ) {
      const d = (data as { details?: { retryAfterMs?: unknown } }).details;
      if (d && typeof d.retryAfterMs === "number") {
        retryAfterMs = d.retryAfterMs;
      }
    }
    return {
      ok: false,
      error: readApiErrorMessage(data),
      retryAfterMs,
    };
  }
  return { ok: true };
}

export async function fetchDraftFromServer(): Promise<CreateFlowState | null> {
  const res = await fetch("/api/drafts/me", { credentials: "include" });
  if (res.status === 401) return null;
  if (!res.ok) return null;
  const data = await parseJson<{ draft: { payload: unknown } | null }>(res);
  if (!data.draft?.payload || typeof data.draft.payload !== "object") {
    return null;
  }
  return migrateLegacyCreateFlowState(
    data.draft.payload as Record<string, unknown>,
  );
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

/**
 * Wipe the signed-in user's saved draft. Fire-and-forget: any non-2xx (including
 * the sync-flag-off `503` and the unauthenticated `401`) is swallowed because
 * callers only invoke this on already-published / explicitly-discarded flows
 * where a leftover server draft is acceptable.
 */
export async function deleteServerDraft(): Promise<void> {
  try {
    await fetch("/api/drafts/me", {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    /* ignore — server draft cleanup is best-effort */
  }
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

export type MyPublishedRule = {
  id: string;
  title: string;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Lists the signed-in user’s published rules (newest first). Returns `null` on
 * network failure or unauthenticated response.
 */
export async function fetchMyPublishedRules(): Promise<
  MyPublishedRule[] | null
> {
  try {
    const res = await fetch("/api/rules/me", { credentials: "include" });
    if (res.status === 401) return null;
    if (!res.ok) return null;
    const data = (await safeParseJsonResponse(res)) as {
      rules?: MyPublishedRule[];
    } | null;
    if (!data || !Array.isArray(data.rules)) return null;
    return data.rules;
  } catch {
    return null;
  }
}

export type PublishedRuleDetailForClient = {
  id: string;
  title: string;
  summary: string | null;
  document: unknown;
};

export type FetchPublishedRuleDetailResult = {
  rule: PublishedRuleDetailForClient;
  viewerIsOwner: boolean;
};

/**
 * Fetches a published rule for the browser (credentials included).
 * Returns `null` on network failure or non-OK response.
 */
export async function fetchPublishedRuleDetail(
  id: string,
): Promise<FetchPublishedRuleDetailResult | null> {
  try {
    const res = await fetch(`/api/rules/${encodeURIComponent(id)}`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = (await safeParseJsonResponse(res)) as {
      rule?: PublishedRuleDetailForClient;
      viewerIsOwner?: unknown;
    } | null;
    if (
      !data ||
      !data.rule ||
      typeof data.rule.id !== "string" ||
      typeof data.rule.title !== "string" ||
      typeof data.viewerIsOwner !== "boolean"
    ) {
      return null;
    }
    return { rule: data.rule, viewerIsOwner: data.viewerIsOwner };
  } catch {
    return null;
  }
}

export type DeleteRuleResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

export async function deletePublishedRule(
  id: string,
): Promise<DeleteRuleResult> {
  try {
    const res = await fetch(`/api/rules/${encodeURIComponent(id)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      return { ok: true as const };
    }
    const data = await safeParseJsonResponse(res);
    return {
      ok: false as const,
      error: readApiErrorMessage(data),
      status: res.status,
    };
  } catch {
    return {
      ok: false as const,
      error: DRAFT_SAVE_NETWORK_ERROR,
      status: 0,
    };
  }
}

export type DuplicateRuleResult =
  | { ok: true; id: string; title: string }
  | { ok: false; error: string; status: number };

export async function duplicatePublishedRule(
  id: string,
): Promise<DuplicateRuleResult> {
  try {
    const res = await fetch(
      `/api/rules/${encodeURIComponent(id)}/duplicate`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    const data = (await safeParseJsonResponse(res)) as {
      rule?: { id: string; title: string };
    } | null;
    const rule = data && typeof data === "object" ? data.rule : undefined;
    if (!res.ok || !rule) {
      const fromBody =
        data && typeof data === "object" ? readApiErrorMessage(data) : null;
      const msg =
        fromBody && fromBody !== "Request failed"
          ? fromBody
          : PUBLISH_FAILED_FALLBACK;
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
      status: 0,
    };
  }
}

export type DeleteAccountResult = { ok: true } | { ok: false; error: string };

/**
 * Permanently deletes the signed-in user. Caller should redirect and refresh UI.
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  try {
    const res = await fetch("/api/user/me", {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      return { ok: true as const };
    }
    const data = await safeParseJsonResponse(res);
    return {
      ok: false as const,
      error: readApiErrorMessage(data),
    };
  } catch {
    return {
      ok: false as const,
      error: DRAFT_SAVE_NETWORK_ERROR,
    };
  }
}

export type ServerDraftForProfile =
  | { hasDraft: false }
  | { hasDraft: true; updatedAt: string; state: CreateFlowState };

/**
 * Fetches the signed-in user’s server draft for the profile page. Returns
 * `null` on auth/transport failure.
 */
export async function fetchServerDraftForProfile(): Promise<
  ServerDraftForProfile | null
> {
  try {
    const res = await fetch("/api/drafts/me", { credentials: "include" });
    if (res.status === 401) return null;
    if (!res.ok) return null;
    const data = (await parseJson(res)) as {
      draft: { payload: unknown; updatedAt: string } | null;
    };
    if (!data.draft) {
      return { hasDraft: false };
    }
    const payload = data.draft.payload;
    const state: CreateFlowState =
      payload && typeof payload === "object"
        ? migrateLegacyCreateFlowState(
            payload as Record<string, unknown>,
          )
        : {};
    const rawUpdated = data.draft.updatedAt;
    const updatedAt =
      typeof rawUpdated === "string"
        ? rawUpdated
        : new Date().toISOString();
    return { hasDraft: true, updatedAt, state };
  } catch {
    return null;
  }
}
