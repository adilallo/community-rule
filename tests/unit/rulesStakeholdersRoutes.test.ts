import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findManyStakeholdersMock = vi.fn();
const findFirstRuleMock = vi.fn();
const getSessionUserMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => true,
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    publishedRule: {
      findFirst: (...args: unknown[]) => findFirstRuleMock(...args),
    },
    ruleStakeholder: {
      findMany: (...args: unknown[]) => findManyStakeholdersMock(...args),
    },
  },
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

import { GET } from "../../app/api/rules/[id]/stakeholders/route";

beforeEach(() => {
  findManyStakeholdersMock.mockReset();
  findFirstRuleMock.mockReset();
  getSessionUserMock.mockReset();
  getSessionUserMock.mockResolvedValue({ id: "owner-1", email: "o@example.com" });
});

describe("GET /api/rules/[id]/stakeholders", () => {
  it("returns 401 when unauthenticated", async () => {
    getSessionUserMock.mockResolvedValueOnce(null);
    const res = await GET(
      new NextRequest("https://x.test/api/rules/r1/stakeholders"),
      { params: Promise.resolve({ id: "r1" }) },
    );
    expect(res.status).toBe(401);
  });

  it("returns stakeholders for the rule owner", async () => {
    findFirstRuleMock.mockResolvedValueOnce({
      id: "r1",
      title: "My rule",
    });
    findManyStakeholdersMock.mockResolvedValueOnce([
      {
        id: "s1",
        email: "a@b.c",
        invitedAt: new Date("2026-01-01T00:00:00Z"),
        acceptedAt: null,
        inviteTokenHash: "hash",
      },
      {
        id: "s2",
        email: "x@y.z",
        invitedAt: new Date("2026-01-02T00:00:00Z"),
        acceptedAt: new Date("2026-01-03T00:00:00Z"),
        inviteTokenHash: null,
      },
    ]);
    const res = await GET(
      new NextRequest("https://x.test/api/rules/r1/stakeholders"),
      { params: Promise.resolve({ id: "r1" }) },
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      stakeholders: Array<{ status: string; email: string }>;
    };
    expect(body.stakeholders).toHaveLength(2);
    expect(body.stakeholders[0].status).toBe("pending");
    expect(body.stakeholders[1].status).toBe("accepted");
  });
});
