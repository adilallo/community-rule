import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const deleteManyMock = vi.fn();
const createMock = vi.fn();
const getSessionPepperMock = vi.fn();
const sendMagicLinkEmailMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
  getSessionPepper: () => getSessionPepperMock(),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    magicLinkToken: {
      deleteMany: (...args: unknown[]) => deleteManyMock(...args),
      create: (...args: unknown[]) => createMock(...args),
    },
  },
}));

vi.mock("../../lib/server/hash", () => ({
  hashSessionToken: (token: string) => `hash-${token}`,
  newSessionToken: () => "plain-token",
}));

vi.mock("../../lib/server/mail", () => ({
  sendMagicLinkEmail: (...args: unknown[]) => sendMagicLinkEmailMock(...args),
}));

vi.mock("../../lib/server/rateLimit", () => ({
  rateLimitKey: () => ({ ok: true }),
}));

import { POST } from "../../app/api/auth/magic-link/request/route";

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  deleteManyMock.mockReset();
  createMock.mockReset();
  getSessionPepperMock.mockReset();
  sendMagicLinkEmailMock.mockReset();
  isDatabaseConfiguredMock.mockReturnValue(true);
  getSessionPepperMock.mockReturnValue("pepper");
  deleteManyMock.mockResolvedValue(undefined);
  createMock.mockResolvedValue(undefined);
  sendMagicLinkEmailMock.mockResolvedValue(undefined);
});

describe("POST /api/auth/magic-link/request", () => {
  it("returns 503 when the database is not configured", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await POST(
      new NextRequest("https://x.test/api/auth/magic-link/request", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.c" }),
        headers: { "content-type": "application/json" },
      }),
      undefined,
    );
    expect(res.status).toBe(503);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(
      new NextRequest("https://x.test/api/auth/magic-link/request", {
        method: "POST",
        body: "not-json",
        headers: { "content-type": "application/json" },
      }),
      undefined,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("invalid_json");
  });

  it("returns 400 for an invalid email", async () => {
    const res = await POST(
      new NextRequest("https://x.test/api/auth/magic-link/request", {
        method: "POST",
        body: JSON.stringify({ email: "not-an-email" }),
        headers: { "content-type": "application/json" },
      }),
      undefined,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("validation_error");
  });

  it("creates a token and sends mail for a valid email", async () => {
    const res = await POST(
      new NextRequest("https://x.test/api/auth/magic-link/request", {
        method: "POST",
        body: JSON.stringify({ email: "Member@Example.com" }),
        headers: { "content-type": "application/json" },
      }),
      undefined,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(deleteManyMock).toHaveBeenCalledWith({
      where: { email: "member@example.com" },
    });
    expect(createMock).toHaveBeenCalled();
    expect(sendMagicLinkEmailMock).toHaveBeenCalledWith(
      "member@example.com",
      expect.stringContaining("/api/auth/magic-link/verify?token="),
    );
  });

  it("returns 502 and rolls back the token when mail fails", async () => {
    sendMagicLinkEmailMock.mockRejectedValueOnce(new Error("smtp down"));
    const res = await POST(
      new NextRequest("https://x.test/api/auth/magic-link/request", {
        method: "POST",
        body: JSON.stringify({ email: "a@b.c" }),
        headers: { "content-type": "application/json" },
      }),
      undefined,
    );
    expect(res.status).toBe(502);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("mail_failed");
    expect(deleteManyMock).toHaveBeenCalledTimes(2);
  });
});
