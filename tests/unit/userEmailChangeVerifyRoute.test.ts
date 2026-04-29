import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const getSessionPepperMock = vi.fn();
const hashSessionTokenMock = vi.fn();
const getValidatedSessionTokenHashForUserMock = vi.fn();
const createSessionForUserMock = vi.fn();
const setSessionCookieMock = vi.fn();
const emailChangeFindUniqueMock = vi.fn();
const transactionMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
  getSessionPepper: () => getSessionPepperMock(),
}));

vi.mock("../../lib/server/hash", () => ({
  hashSessionToken: (...args: unknown[]) => hashSessionTokenMock(...args),
}));

vi.mock("../../lib/server/session", () => ({
  getValidatedSessionTokenHashForUser: (...args: unknown[]) =>
    getValidatedSessionTokenHashForUserMock(...args),
  createSessionForUser: (...args: unknown[]) =>
    createSessionForUserMock(...args),
  setSessionCookie: (...args: unknown[]) => setSessionCookieMock(...args),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    emailChangeToken: {
      findUnique: (...args: unknown[]) => emailChangeFindUniqueMock(...args),
    },
    $transaction: (...args: unknown[]) => transactionMock(...args),
  },
}));

import { GET } from "../../app/api/user/email-change/verify/route";

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  getSessionPepperMock.mockReset();
  hashSessionTokenMock.mockReset();
  getValidatedSessionTokenHashForUserMock.mockReset();
  createSessionForUserMock.mockReset();
  setSessionCookieMock.mockReset();
  emailChangeFindUniqueMock.mockReset();
  transactionMock.mockReset();

  getSessionPepperMock.mockReturnValue("pepper");
  hashSessionTokenMock.mockReturnValue("token-hash");
});

function getWithToken(token: string) {
  return new NextRequest(
    `https://x.test/api/user/email-change/verify?token=${encodeURIComponent(token)}`,
  );
}

describe("GET /api/user/email-change/verify", () => {
  it("returns 503 when the database is not configured", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await GET(
      new NextRequest("https://x.test/api/user/email-change/verify?token=abc"),
    );
    expect(res.status).toBe(503);
  });

  it("redirects with email_change_invalid when token is missing", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    const res = await GET(
      new NextRequest("https://x.test/api/user/email-change/verify"),
    );
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("error=email_change_invalid");
  });

  it("redirects with email_change_invalid when token is too short", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    const res = await GET(getWithToken("short"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("error=email_change_invalid");
  });

  it("redirects with email_change_expired when row is missing", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    emailChangeFindUniqueMock.mockResolvedValueOnce(null);
    const res = await GET(getWithToken("long-enough-token"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("error=email_change_expired");
  });

  it("redirects with email_change_expired when token is past expiresAt", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    emailChangeFindUniqueMock.mockResolvedValueOnce({
      id: "tok1",
      userId: "u1",
      newEmail: "new@x.com",
      expiresAt: new Date("2020-01-01T00:00:00Z"),
      tokenHash: "token-hash",
    });
    const res = await GET(getWithToken("long-enough-token"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("error=email_change_expired");
  });

  it("redirects with email_change_taken when another user claims the email in the transaction", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    const future = new Date(Date.now() + 60_000);
    emailChangeFindUniqueMock.mockResolvedValueOnce({
      id: "tok1",
      userId: "u1",
      newEmail: "new@x.com",
      expiresAt: future,
      tokenHash: "token-hash",
    });
    getValidatedSessionTokenHashForUserMock.mockResolvedValueOnce("keep-hash");

    transactionMock.mockImplementationOnce(
      async (fn: (tx: Record<string, unknown>) => Promise<void>) => {
        const tx = {
          emailChangeToken: {
            findUnique: vi.fn().mockResolvedValue({
              id: "tok1",
              userId: "u1",
              newEmail: "new@x.com",
              expiresAt: future,
            }),
            delete: vi.fn().mockResolvedValue({}),
          },
          user: {
            findFirst: vi.fn().mockResolvedValue({ id: "u2" }),
          },
        };
        await fn(tx as Record<string, unknown>);
      },
    );

    const res = await GET(getWithToken("long-enough-token"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("error=email_change_taken");
  });

  it("redirects with email_change_ok and keeps session when validated session matches", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    const future = new Date(Date.now() + 60_000);
    emailChangeFindUniqueMock.mockResolvedValueOnce({
      id: "tok1",
      userId: "u1",
      newEmail: "new@x.com",
      expiresAt: future,
      tokenHash: "token-hash",
    });
    getValidatedSessionTokenHashForUserMock.mockResolvedValueOnce("keep-hash");

    const sessionDeleteMany = vi.fn().mockResolvedValue({ count: 1 });
    const userUpdate = vi.fn().mockResolvedValue({});
    const tokenDelete = vi.fn().mockResolvedValue({});

    transactionMock.mockImplementationOnce(
      async (fn: (tx: Record<string, unknown>) => Promise<void>) => {
        const tx = {
          emailChangeToken: {
            findUnique: vi.fn().mockResolvedValue({
              id: "tok1",
              userId: "u1",
              newEmail: "new@x.com",
              expiresAt: future,
            }),
            delete: tokenDelete,
          },
          user: {
            findFirst: vi.fn().mockResolvedValue(null),
            update: userUpdate,
          },
          session: { deleteMany: sessionDeleteMany },
        };
        await fn(tx as Record<string, unknown>);
      },
    );

    const res = await GET(getWithToken("long-enough-token"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("email_change=ok");
    expect(userUpdate).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { email: "new@x.com" },
    });
    expect(sessionDeleteMany).toHaveBeenCalledWith({
      where: { userId: "u1", tokenHash: { not: "keep-hash" } },
    });
    expect(createSessionForUserMock).not.toHaveBeenCalled();
  });

  it("issues a new session when no validated session is kept", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    const future = new Date(Date.now() + 60_000);
    emailChangeFindUniqueMock.mockResolvedValueOnce({
      id: "tok1",
      userId: "u1",
      newEmail: "new@x.com",
      expiresAt: future,
      tokenHash: "token-hash",
    });
    getValidatedSessionTokenHashForUserMock.mockResolvedValueOnce(null);

    const sessionDeleteMany = vi.fn().mockResolvedValue({ count: 2 });
    transactionMock.mockImplementationOnce(
      async (fn: (tx: Record<string, unknown>) => Promise<void>) => {
        const tx = {
          emailChangeToken: {
            findUnique: vi.fn().mockResolvedValue({
              id: "tok1",
              userId: "u1",
              newEmail: "new@x.com",
              expiresAt: future,
            }),
            delete: vi.fn().mockResolvedValue({}),
          },
          user: {
            findFirst: vi.fn().mockResolvedValue(null),
            update: vi.fn().mockResolvedValue({}),
          },
          session: { deleteMany: sessionDeleteMany },
        };
        await fn(tx as Record<string, unknown>);
      },
    );

    createSessionForUserMock.mockResolvedValueOnce({
      token: "sess",
      expiresAt: new Date("2026-06-01T00:00:00Z"),
    });

    const res = await GET(getWithToken("long-enough-token"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("email_change=ok");
    expect(sessionDeleteMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
    });
    expect(createSessionForUserMock).toHaveBeenCalledWith("u1");
    expect(setSessionCookieMock).toHaveBeenCalled();
  });
});
