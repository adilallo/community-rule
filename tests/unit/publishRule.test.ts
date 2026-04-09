import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { publishRule } from "../../lib/create/api";

const input = {
  title: "T",
  document: { sections: [] as unknown[] },
};

describe("publishRule", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("returns ok on 200 with rule", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ rule: { id: "r1", title: "T" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const result = await publishRule(input);
    expect(result).toEqual({ ok: true, id: "r1", title: "T" });
  });

  it("does not throw when body is empty (e.g. connection reset)", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response("", {
        status: 503,
        statusText: "Service Unavailable",
      }),
    );
    const result = await publishRule(input);
    expect(result.ok).toBe(false);
    if (result.ok === false) {
      expect(result.status).toBe(503);
      expect(result.error).toBe("Service Unavailable");
    }
  });

  it("parses validation error when JSON present", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { code: "validation_error", message: "title required" },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      ),
    );
    const result = await publishRule(input);
    expect(result).toEqual({
      ok: false,
      error: "title required",
      status: 400,
    });
  });

  it("returns network message when fetch rejects", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("offline"));
    const result = await publishRule(input);
    expect(result).toEqual({
      ok: false,
      error: "Something went wrong. Check your connection and try again.",
    });
  });
});
