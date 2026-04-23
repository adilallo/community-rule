import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const getSessionUserMock = vi.fn();
const findUniqueMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    ruleDraft: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      upsert: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

import { GET } from "../../app/api/drafts/me/route";

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  getSessionUserMock.mockReset();
  findUniqueMock.mockReset();
});

describe("GET /api/drafts/me", () => {
  it("returns 503 with the canonical shape when the database is not configured", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await GET(
      new NextRequest("https://x.test/api/drafts/me"),
      undefined,
    );
    expect(res.status).toBe(503);
    const body = (await res.json()) as {
      error: { code: string; message: string };
    };
    expect(body.error.code).toBe("db_unavailable");
    expect(res.headers.get("x-request-id")).toBeTruthy();
  });

  it("returns 401 unauthorized with the canonical shape when no session user", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValueOnce(null);
    const res = await GET(
      new NextRequest("https://x.test/api/drafts/me"),
      undefined,
    );
    expect(res.status).toBe(401);
    const body = (await res.json()) as {
      error: { code: string; message: string };
    };
    expect(body.error).toEqual({
      code: "unauthorized",
      message: "Unauthorized",
    });
    expect(res.headers.get("x-request-id")).toBeTruthy();
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("forwards an incoming x-request-id on the response", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValueOnce(null);
    const res = await GET(
      new NextRequest("https://x.test/api/drafts/me", {
        headers: { "x-request-id": "req_drafts-1" },
      }),
      undefined,
    );
    expect(res.headers.get("x-request-id")).toBe("req_drafts-1");
  });

  it("returns the draft when present", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValueOnce({
      id: "u1",
      email: "x@y.test",
    });
    findUniqueMock.mockResolvedValueOnce({
      payload: { foo: 1 },
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    });
    const res = await GET(
      new NextRequest("https://x.test/api/drafts/me"),
      undefined,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      draft: { payload: { foo: number } } | null;
    };
    expect(body.draft?.payload).toEqual({ foo: 1 });
  });
});
