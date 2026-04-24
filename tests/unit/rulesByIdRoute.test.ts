import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const findUniqueMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    publishedRule: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
    },
  },
}));

import { GET } from "../../app/api/rules/[id]/route";

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  findUniqueMock.mockReset();
});

describe("GET /api/rules/[id]", () => {
  it("returns 503 when the database is not configured", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await GET(
      new NextRequest("https://x.test/api/rules/abc"),
      makeContext("abc"),
    );
    expect(res.status).toBe(503);
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("returns 404 with the canonical error shape when no published rule matches the id", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    findUniqueMock.mockResolvedValueOnce(null);
    const res = await GET(
      new NextRequest("https://x.test/api/rules/missing"),
      makeContext("missing"),
    );
    expect(res.status).toBe(404);
    expect(res.headers.get("x-request-id")).toBeTruthy();
    const body = (await res.json()) as {
      error: { code: string; message: string };
    };
    expect(body.error.code).toBe("not_found");
    expect(typeof body.error.message).toBe("string");
    expect(findUniqueMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "missing" } }),
    );
  });

  it("forwards an incoming x-request-id on the response", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    findUniqueMock.mockResolvedValueOnce(null);
    const res = await GET(
      new NextRequest("https://x.test/api/rules/missing", {
        headers: { "x-request-id": "req_test-1" },
      }),
      makeContext("missing"),
    );
    expect(res.headers.get("x-request-id")).toBe("req_test-1");
  });

  it("returns 404 when the query throws (swallowed by helper)", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    findUniqueMock.mockRejectedValueOnce(new Error("db down"));
    const res = await GET(
      new NextRequest("https://x.test/api/rules/broken"),
      makeContext("broken"),
    );
    expect(res.status).toBe(404);
  });

  it("returns 200 with { rule } when a published rule exists", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    const row = {
      id: "rule-1",
      title: "Mutual Aid Mondays",
      summary: "A grassroots community in Denver.",
      document: { sections: [] },
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-02T00:00:00Z"),
    };
    findUniqueMock.mockResolvedValueOnce(row);
    const res = await GET(
      new NextRequest("https://x.test/api/rules/rule-1"),
      makeContext("rule-1"),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      rule: { id: string; title: string; summary: string | null };
    };
    expect(body.rule.id).toBe("rule-1");
    expect(body.rule.title).toBe("Mutual Aid Mondays");
    expect(body.rule.summary).toBe("A grassroots community in Denver.");
  });
});
