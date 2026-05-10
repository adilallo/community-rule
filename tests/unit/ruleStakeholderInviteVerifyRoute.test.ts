import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findUniqueMock = vi.fn();
const updateMock = vi.fn();
const upsertMock = vi.fn();
const getSessionUserMock = vi.fn();
const createSessionMock = vi.fn();
const setCookieMock = vi.fn();

vi.mock("../../lib/server/db", () => ({
  prisma: {
    ruleStakeholder: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
    },
    user: {
      upsert: (...args: unknown[]) => upsertMock(...args),
    },
  },
}));

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => true,
  getSessionPepper: () => "pepper",
}));

vi.mock("../../lib/server/hash", () => ({
  hashSessionToken: (t: string) => `h-${t}`,
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
  createSessionForUser: (...args: unknown[]) => createSessionMock(...args),
  setSessionCookie: (...args: unknown[]) => setCookieMock(...args),
}));

import { GET } from "../../app/api/invites/rule-stakeholder/verify/route";

beforeEach(() => {
  findUniqueMock.mockReset();
  updateMock.mockReset();
  upsertMock.mockReset();
  getSessionUserMock.mockReset();
  createSessionMock.mockReset();
  setCookieMock.mockReset();
});

describe("GET /api/invites/rule-stakeholder/verify", () => {
  it("redirects to the rule after a valid token", async () => {
    getSessionUserMock.mockResolvedValue(null);
    findUniqueMock.mockResolvedValue({
      id: "st1",
      email: "inv@example.com",
      ruleId: "rule-1",
      inviteExpiresAt: new Date(Date.now() + 60_000),
    });
    upsertMock.mockResolvedValue({ id: "u1", email: "inv@example.com" });
    updateMock.mockResolvedValue({});
    createSessionMock.mockResolvedValue({
      token: "sess",
      expiresAt: new Date(),
    });

    const res = await GET(
      new NextRequest(
        `https://x.test/api/invites/rule-stakeholder/verify?token=${"x".repeat(12)}`,
      ),
    );

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toContain("/rules/rule-1");
    expect(setCookieMock).toHaveBeenCalled();
  });

  it("redirects to login when another user is already signed in", async () => {
    getSessionUserMock.mockResolvedValue({
      id: "u-other",
      email: "other@example.com",
    });
    findUniqueMock.mockResolvedValue({
      id: "st1",
      email: "inv@example.com",
      ruleId: "rule-1",
      inviteExpiresAt: new Date(Date.now() + 60_000),
    });

    const res = await GET(
      new NextRequest(
        `https://x.test/api/invites/rule-stakeholder/verify?token=${"y".repeat(12)}`,
      ),
    );

    expect(res.headers.get("location")).toContain(
      "error=stakeholder_wrong_account",
    );
    expect(upsertMock).not.toHaveBeenCalled();
  });
});
