import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getSessionUserMock = vi.fn();
const transactionMock = vi.fn();
const publishedRuleCreateMock = vi.fn();
const publishedRuleDeleteMock = vi.fn();
const sendInviteMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => true,
  getSessionPepper: () => "test-pepper",
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

vi.mock("../../lib/server/rateLimit", () => ({
  rateLimitKey: () => ({ ok: true as const }),
}));

vi.mock("../../lib/server/mail", () => ({
  sendRuleStakeholderInviteEmail: (...args: unknown[]) =>
    sendInviteMock(...args),
}));

vi.mock("../../lib/server/hash", () => ({
  newSessionToken: () => "x".repeat(32),
  hashSessionToken: (t: string) => `hashed-${t}`,
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    $transaction: (fn: (tx: unknown) => Promise<unknown>) =>
      transactionMock(fn),
    publishedRule: {
      create: (...args: unknown[]) => publishedRuleCreateMock(...args),
      delete: (...args: unknown[]) => publishedRuleDeleteMock(...args),
    },
    ruleStakeholder: {
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

import { POST } from "../../app/api/rules/route";

beforeEach(() => {
  getSessionUserMock.mockReset();
  transactionMock.mockReset();
  publishedRuleCreateMock.mockReset();
  publishedRuleDeleteMock.mockReset();
  sendInviteMock.mockReset();
  getSessionUserMock.mockResolvedValue({
    id: "user-1",
    email: "owner@example.com",
  });
});

describe("POST /api/rules", () => {
  it("creates rule without transaction when there are no stakeholder emails", async () => {
    publishedRuleCreateMock.mockResolvedValueOnce({
      id: "rule-solo",
      title: "T",
      summary: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });

    const res = await POST(
      new NextRequest("https://x.test/api/rules", {
        method: "POST",
        body: JSON.stringify({
          title: "T",
          summary: null,
          document: {},
        }),
      }),
      undefined,
    );

    expect(res.status).toBe(200);
    expect(transactionMock).not.toHaveBeenCalled();
    expect(publishedRuleCreateMock).toHaveBeenCalledTimes(1);
    expect(sendInviteMock).not.toHaveBeenCalled();
  });

  it("uses a transaction and sends stakeholder invites", async () => {
    const created = {
      id: "rule-new",
      title: "Published title",
      summary: null,
      createdAt: new Date("2026-01-02T00:00:00.000Z"),
    };
    transactionMock.mockImplementation(
      async (fn: (tx: { publishedRule: { create: typeof vi.fn }; ruleStakeholder: { create: typeof vi.fn } }) => Promise<unknown>) => {
        const tx = {
          publishedRule: {
            create: vi.fn().mockResolvedValue(created),
          },
          ruleStakeholder: {
            create: vi.fn().mockResolvedValue({}),
          },
        };
        return fn(tx);
      },
    );
    sendInviteMock.mockResolvedValue(undefined);

    const res = await POST(
      new NextRequest("https://x.test/api/rules", {
        method: "POST",
        body: JSON.stringify({
          title: "Published title",
          summary: null,
          document: {},
          stakeholderEmails: ["stakeholder@example.com"],
        }),
      }),
      undefined,
    );

    expect(res.status).toBe(200);
    expect(transactionMock).toHaveBeenCalledTimes(1);
    expect(sendInviteMock).toHaveBeenCalledTimes(1);
    expect(sendInviteMock.mock.calls[0][0]).toBe("stakeholder@example.com");
    expect(String(sendInviteMock.mock.calls[0][1])).toContain(
      "/api/invites/rule-stakeholder/verify?token=",
    );
    expect(publishedRuleCreateMock).not.toHaveBeenCalled();
  });

  it("rolls back publish when mail fails", async () => {
    const created = {
      id: "rule-new",
      title: "Published title",
      summary: null,
      createdAt: new Date("2026-01-02T00:00:00.000Z"),
    };
    transactionMock.mockImplementation(
      async (fn: (tx: { publishedRule: { create: typeof vi.fn }; ruleStakeholder: { create: typeof vi.fn } }) => Promise<unknown>) => {
        const tx = {
          publishedRule: {
            create: vi.fn().mockResolvedValue(created),
          },
          ruleStakeholder: {
            create: vi.fn().mockResolvedValue({}),
          },
        };
        return fn(tx);
      },
    );
    sendInviteMock.mockRejectedValueOnce(new Error("smtp down"));
    publishedRuleDeleteMock.mockResolvedValueOnce({});

    const res = await POST(
      new NextRequest("https://x.test/api/rules", {
        method: "POST",
        body: JSON.stringify({
          title: "Published title",
          summary: null,
          document: {},
          stakeholderEmails: ["stakeholder@example.com"],
        }),
      }),
      undefined,
    );

    expect(res.status).toBe(502);
    expect(publishedRuleDeleteMock).toHaveBeenCalledWith({
      where: { id: "rule-new" },
    });
  });
});
