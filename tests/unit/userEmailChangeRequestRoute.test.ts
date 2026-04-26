import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const getSessionUserMock = vi.fn();
const userFindUniqueMock = vi.fn();
const emailChangeDeleteManyMock = vi.fn();
const emailChangeCreateMock = vi.fn();
const rateLimitKeyMock = vi.fn();
const sendEmailChangeEmailMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
  getSessionPepper: () => "test-pepper",
}));

vi.mock("../../lib/server/rateLimit", () => ({
  rateLimitKey: (...args: unknown[]) => rateLimitKeyMock(...args),
}));

vi.mock("../../lib/server/mail", () => ({
  sendEmailChangeEmail: (...args: unknown[]) =>
    sendEmailChangeEmailMock(...args),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => userFindUniqueMock(...args),
    },
    emailChangeToken: {
      deleteMany: (...args: unknown[]) => emailChangeDeleteManyMock(...args),
      create: (...args: unknown[]) => emailChangeCreateMock(...args),
    },
  },
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

vi.mock("../../lib/server/hash", () => ({
  hashSessionToken: () => "hashed-token",
  newSessionToken: () => "raw-token-1234567890",
}));

import { POST } from "../../app/api/user/email-change/request/route";

function postJson(body: unknown) {
  return new NextRequest("https://x.test/api/user/email-change/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  getSessionUserMock.mockReset();
  userFindUniqueMock.mockReset();
  emailChangeDeleteManyMock.mockReset();
  emailChangeCreateMock.mockReset();
  rateLimitKeyMock.mockReset();
  sendEmailChangeEmailMock.mockReset();
  rateLimitKeyMock.mockReturnValue({ ok: true as const });
});

describe("POST /api/user/email-change/request", () => {
  it("returns 503 when the database is not configured", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await POST(postJson({ newEmail: "n@x.com" }), undefined);
    expect(res.status).toBe(503);
    expect(getSessionUserMock).not.toHaveBeenCalled();
  });

  it("returns 401 when not signed in", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue(null);
    const res = await POST(postJson({ newEmail: "n@x.com" }), undefined);
    expect(res.status).toBe(401);
    expect(userFindUniqueMock).not.toHaveBeenCalled();
  });

  it("returns 400 when new email equals current email", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({
      id: "u1",
      email: "same@x.com",
    });
    const res = await POST(postJson({ newEmail: "same@x.com" }), undefined);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: { code?: string } };
    expect(body.error?.code).toBe("validation_error");
    expect(emailChangeCreateMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the email is taken by another user", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({
      id: "u1",
      email: "old@x.com",
    });
    userFindUniqueMock.mockResolvedValueOnce({
      id: "u2",
      email: "taken@x.com",
    });
    const res = await POST(postJson({ newEmail: "taken@x.com" }), undefined);
    expect(res.status).toBe(400);
    expect(emailChangeCreateMock).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limited", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({
      id: "u1",
      email: "old@x.com",
    });
    userFindUniqueMock.mockResolvedValueOnce(null);
    rateLimitKeyMock.mockReturnValueOnce({
      ok: false as const,
      retryAfterMs: 5000,
    });
    const res = await POST(postJson({ newEmail: "new@x.com" }), undefined);
    expect(res.status).toBe(429);
    expect(emailChangeCreateMock).not.toHaveBeenCalled();
  });

  it("creates a token and sends mail on success", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({
      id: "u1",
      email: "old@x.com",
    });
    userFindUniqueMock.mockResolvedValueOnce(null);
    emailChangeDeleteManyMock.mockResolvedValueOnce({ count: 0 });
    emailChangeCreateMock.mockResolvedValueOnce({ id: "t1" });
    sendEmailChangeEmailMock.mockResolvedValueOnce(undefined);

    const res = await POST(postJson({ newEmail: "new@x.com" }), undefined);
    expect(res.status).toBe(200);
    expect(emailChangeDeleteManyMock).toHaveBeenCalledWith({
      where: { userId: "u1" },
    });
    expect(emailChangeCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "u1",
          newEmail: "new@x.com",
          tokenHash: "hashed-token",
        }),
      }),
    );
    expect(sendEmailChangeEmailMock).toHaveBeenCalledWith(
      "new@x.com",
      expect.stringContaining("/api/user/email-change/verify?token="),
    );
  });

  it("rolls back the token when mail send fails", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({
      id: "u1",
      email: "old@x.com",
    });
    userFindUniqueMock.mockResolvedValueOnce(null);
    emailChangeDeleteManyMock.mockResolvedValue({ count: 0 });
    emailChangeCreateMock.mockResolvedValue({ id: "t1" });
    sendEmailChangeEmailMock.mockRejectedValueOnce(new Error("smtp down"));

    const res = await POST(postJson({ newEmail: "new@x.com" }), undefined);
    expect(res.status).toBe(502);
    expect(emailChangeDeleteManyMock).toHaveBeenLastCalledWith({
      where: { userId: "u1" },
    });
  });
});
