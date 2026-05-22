import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findFirstRuleMock = vi.fn();
const findFirstStakeholderMock = vi.fn();
const countMock = vi.fn();
const deleteMock = vi.fn();
const updateMock = vi.fn();
const createInviteMock = vi.fn();
const getSessionUserMock = vi.fn();
const getSessionPepperMock = vi.fn();
const sendInviteEmailMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => true,
  getSessionPepper: () => getSessionPepperMock(),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    publishedRule: {
      findFirst: (...args: unknown[]) => findFirstRuleMock(...args),
    },
    ruleStakeholder: {
      findFirst: (...args: unknown[]) => findFirstStakeholderMock(...args),
      count: (...args: unknown[]) => countMock(...args),
      delete: (...args: unknown[]) => deleteMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
    },
  },
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

vi.mock("../../lib/server/ruleStakeholderInviteOps", () => ({
  createRuleStakeholderInviteAndSendMail: (...args: unknown[]) =>
    createInviteMock(...args),
  stakeholderInviteVerifyUrl: (origin: string, token: string) =>
    `${origin}/api/invites/rule-stakeholder/verify?token=${encodeURIComponent(token)}`,
}));

vi.mock("../../lib/server/hash", () => ({
  hashSessionToken: (token: string) => `hash-${token}`,
  newSessionToken: () => "invite-token",
}));

vi.mock("../../lib/server/mail", () => ({
  sendRuleStakeholderInviteEmail: (...args: unknown[]) =>
    sendInviteEmailMock(...args),
}));

vi.mock("../../lib/server/rateLimit", () => ({
  rateLimitKey: () => ({ ok: true }),
}));

import { DELETE } from "../../app/api/rules/[id]/stakeholders/[stakeholderId]/route";
import { POST as POST_RESEND } from "../../app/api/rules/[id]/stakeholders/[stakeholderId]/resend/route";
import { POST } from "../../app/api/rules/[id]/stakeholders/route";

const owner = { id: "owner-1", email: "owner@example.com" };
const routeCtx = { params: Promise.resolve({ id: "rule-1" }) };
const memberCtx = {
  params: Promise.resolve({ id: "rule-1", stakeholderId: "st-1" }),
};

beforeEach(() => {
  findFirstRuleMock.mockReset();
  findFirstStakeholderMock.mockReset();
  countMock.mockReset();
  deleteMock.mockReset();
  updateMock.mockReset();
  createInviteMock.mockReset();
  getSessionUserMock.mockReset();
  getSessionPepperMock.mockReset();
  sendInviteEmailMock.mockReset();
  getSessionUserMock.mockResolvedValue(owner);
  getSessionPepperMock.mockReturnValue("pepper");
  findFirstRuleMock.mockResolvedValue({ id: "rule-1", title: "My rule" });
  createInviteMock.mockResolvedValue({ ok: true });
  sendInviteEmailMock.mockResolvedValue(undefined);
  updateMock.mockResolvedValue(undefined);
  deleteMock.mockResolvedValue(undefined);
  countMock.mockResolvedValue(0);
});

describe("POST /api/rules/[id]/stakeholders", () => {
  it("returns 401 when unauthenticated", async () => {
    getSessionUserMock.mockResolvedValueOnce(null);
    const res = await POST(
      new NextRequest("https://x.test/api/rules/rule-1/stakeholders", {
        method: "POST",
        body: JSON.stringify({ email: "inv@example.com" }),
        headers: { "content-type": "application/json" },
      }),
      routeCtx,
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 when inviting the owner email", async () => {
    const res = await POST(
      new NextRequest("https://x.test/api/rules/rule-1/stakeholders", {
        method: "POST",
        body: JSON.stringify({ email: "Owner@Example.com" }),
        headers: { "content-type": "application/json" },
      }),
      routeCtx,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("validation_error");
  });

  it("creates an invite and returns 201", async () => {
    findFirstStakeholderMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "st-new",
        email: "inv@example.com",
        invitedAt: new Date("2026-01-01T00:00:00Z"),
      });
    const res = await POST(
      new NextRequest("https://x.test/api/rules/rule-1/stakeholders", {
        method: "POST",
        body: JSON.stringify({ email: "inv@example.com" }),
        headers: { "content-type": "application/json" },
      }),
      routeCtx,
    );
    expect(res.status).toBe(201);
    expect(createInviteMock).toHaveBeenCalled();
    const body = (await res.json()) as {
      stakeholder: { email: string; status: string };
    };
    expect(body.stakeholder.email).toBe("inv@example.com");
    expect(body.stakeholder.status).toBe("pending");
  });
});

describe("DELETE /api/rules/[id]/stakeholders/[stakeholderId]", () => {
  it("returns 403 when the rule belongs to another user", async () => {
    findFirstStakeholderMock.mockResolvedValueOnce({
      id: "st-1",
      rule: { userId: "other-user" },
    });
    const res = await DELETE(
      new NextRequest(
        "https://x.test/api/rules/rule-1/stakeholders/st-1",
        { method: "DELETE" },
      ),
      memberCtx,
    );
    expect(res.status).toBe(403);
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it("deletes the stakeholder for the rule owner", async () => {
    findFirstStakeholderMock.mockResolvedValueOnce({
      id: "st-1",
      rule: { userId: owner.id },
    });
    const res = await DELETE(
      new NextRequest(
        "https://x.test/api/rules/rule-1/stakeholders/st-1",
        { method: "DELETE" },
      ),
      memberCtx,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(deleteMock).toHaveBeenCalledWith({ where: { id: "st-1" } });
  });
});

describe("POST /api/rules/[id]/stakeholders/[stakeholderId]/resend", () => {
  it("returns 400 when the invite was already accepted", async () => {
    findFirstStakeholderMock.mockResolvedValueOnce({
      id: "st-1",
      email: "inv@example.com",
      inviteTokenHash: null,
      inviteExpiresAt: null,
      rule: { userId: owner.id, title: "My rule" },
    });
    const res = await POST_RESEND(
      new NextRequest(
        "https://x.test/api/rules/rule-1/stakeholders/st-1/resend",
        { method: "POST" },
      ),
      memberCtx,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("validation_error");
  });

  it("rotates the token and sends a new invite email", async () => {
    findFirstStakeholderMock.mockResolvedValueOnce({
      id: "st-1",
      email: "inv@example.com",
      inviteTokenHash: "old-hash",
      inviteExpiresAt: new Date("2026-01-01T00:00:00Z"),
      rule: { userId: owner.id, title: "My rule" },
    });
    const res = await POST_RESEND(
      new NextRequest(
        "https://x.test/api/rules/rule-1/stakeholders/st-1/resend",
        { method: "POST" },
      ),
      memberCtx,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(updateMock).toHaveBeenCalled();
    expect(sendInviteEmailMock).toHaveBeenCalledWith(
      "inv@example.com",
      expect.stringContaining("/api/invites/rule-stakeholder/verify?token="),
      "My rule",
    );
  });
});
