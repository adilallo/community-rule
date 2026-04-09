import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { saveDraftToServer } from "../../lib/create/api";
import type { CreateFlowState } from "../../app/create/types";

const minimalState: CreateFlowState = {};

describe("saveDraftToServer", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns ok true on 200", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ draft: { payload: {}, updatedAt: "" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const result = await saveDraftToServer(minimalState);
    expect(result).toEqual({ ok: true });
  });

  it("returns message from validation error body", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { code: "validation_error", message: "Payload invalid" },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );
    const result = await saveDraftToServer(minimalState);
    expect(result).toEqual({
      ok: false,
      message: "Payload invalid",
      status: 400,
    });
  });

  it("returns message from 413 payload_too_large", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: "payload_too_large",
            message: "Request body must be at most 524288 bytes",
          },
        }),
        { status: 413, headers: { "Content-Type": "application/json" } },
      ),
    );
    const result = await saveDraftToServer(minimalState);
    expect(result.ok).toBe(false);
    if (result.ok === false) {
      expect(result.message).toContain("524288");
      expect(result.status).toBe(413);
    }
  });

  it("returns Unauthorized string from 401 legacy shape", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const result = await saveDraftToServer(minimalState);
    expect(result).toEqual({
      ok: false,
      message: "Unauthorized",
      status: 401,
    });
  });

  it("falls back when error body is not JSON", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response("not json", {
        status: 500,
        statusText: "Internal Server Error",
      }),
    );
    const result = await saveDraftToServer(minimalState);
    expect(result).toEqual({
      ok: false,
      message: "Internal Server Error",
      status: 500,
    });
  });

  it("returns network message when fetch rejects", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("offline"));
    const result = await saveDraftToServer(minimalState);
    expect(result).toEqual({
      ok: false,
      message: "Something went wrong. Check your connection and try again.",
    });
  });
});
