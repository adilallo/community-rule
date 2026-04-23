import { NextResponse } from "next/server";
import { describe, expect, it } from "vitest";
import {
  REQUEST_ID_HEADER,
  getOrCreateRequestId,
  withRequestId,
} from "../../lib/server/requestId";

function reqWith(headers: Record<string, string>): Request {
  return new Request("https://x.test/api/x", { headers });
}

describe("lib/server/requestId", () => {
  it("generates a UUID when no header is present", () => {
    const id = getOrCreateRequestId(reqWith({}));
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("preserves a well-formed incoming x-request-id", () => {
    const incoming = "req_abc-123.456";
    const id = getOrCreateRequestId(reqWith({ [REQUEST_ID_HEADER]: incoming }));
    expect(id).toBe(incoming);
  });

  it("trims surrounding whitespace from a well-formed id", () => {
    const id = getOrCreateRequestId(
      reqWith({ [REQUEST_ID_HEADER]: "  abc-123  " }),
    );
    expect(id).toBe("abc-123");
  });

  it("rejects oversized ids and falls back to a UUID", () => {
    const huge = "a".repeat(200);
    const id = getOrCreateRequestId(reqWith({ [REQUEST_ID_HEADER]: huge }));
    expect(id).not.toBe(huge);
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("rejects ids with disallowed characters", () => {
    // Spaces, semicolons, slashes are valid HTTP header bytes but disallowed
    // by our `[A-Za-z0-9_.-]` pattern.
    const bad = "abc def;<script>";
    const id = getOrCreateRequestId(reqWith({ [REQUEST_ID_HEADER]: bad }));
    expect(id).not.toBe(bad);
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("withRequestId attaches the header to a NextResponse", () => {
    const res = NextResponse.json({ ok: true });
    const out = withRequestId(res, "req_xyz");
    expect(out).toBe(res);
    expect(out.headers.get(REQUEST_ID_HEADER)).toBe("req_xyz");
  });
});
