import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const listProfileMock = vi.fn();
const getSessionUserMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/publishedRules", () => ({
  listProfileRulesForUser: (...args: unknown[]) => listProfileMock(...args),
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

import { GET } from "../../app/api/rules/me/route";

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  listProfileMock.mockReset();
  getSessionUserMock.mockReset();
});

describe("GET /api/rules/me", () => {
  it("returns 503 when the database is not configured", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await GET(
      new NextRequest("https://x.test/api/rules/me"),
      undefined,
    );
    expect(res.status).toBe(503);
    expect(getSessionUserMock).not.toHaveBeenCalled();
  });

  it("returns 401 when not signed in", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue(null);
    const res = await GET(
      new NextRequest("https://x.test/api/rules/me"),
      undefined,
    );
    expect(res.status).toBe(401);
    expect(listProfileMock).not.toHaveBeenCalled();
  });

  it("returns 200 with { rules } for the session user", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "user-1", email: "a@b.c" });
    const rows = [
      {
        id: "r1",
        title: "Rule A",
        summary: "S",
        createdAt: new Date("2026-01-01T00:00:00Z"),
        updatedAt: new Date("2026-01-02T00:00:00Z"),
      },
    ];
    listProfileMock.mockResolvedValueOnce(
      rows.map((r) => ({ ...r, role: "owner" as const })),
    );
    const res = await GET(
      new NextRequest("https://x.test/api/rules/me?limit=10"),
      undefined,
    );
    expect(res.status).toBe(200);
    expect(listProfileMock).toHaveBeenCalledWith("user-1", 10);
    const body = (await res.json()) as {
      rules: Array<{ id: string; title: string; role: string }>;
    };
    expect(body.rules).toHaveLength(1);
    expect(body.rules[0].id).toBe("r1");
    expect(body.rules[0].role).toBe("owner");
  });
});
