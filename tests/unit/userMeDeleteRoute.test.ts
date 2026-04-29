import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const userDeleteMock = vi.fn();
const getSessionUserMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    user: {
      delete: (...args: unknown[]) => userDeleteMock(...args),
    },
  },
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
  clearSessionCookie: vi.fn(),
}));

import { DELETE } from "../../app/api/user/me/route";

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  userDeleteMock.mockReset();
  getSessionUserMock.mockReset();
});

describe("DELETE /api/user/me", () => {
  it("returns 503 when the database is not configured", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await DELETE(
      new NextRequest("https://x.test/api/user/me"),
      undefined,
    );
    expect(res.status).toBe(503);
  });

  it("returns 401 when not signed in", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue(null);
    const res = await DELETE(
      new NextRequest("https://x.test/api/user/me"),
      undefined,
    );
    expect(res.status).toBe(401);
    expect(userDeleteMock).not.toHaveBeenCalled();
  });

  it("deletes the user and returns 200 when signed in", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "u1", email: "a@b.c" });
    userDeleteMock.mockResolvedValueOnce(undefined);
    const res = await DELETE(
      new NextRequest("https://x.test/api/user/me"),
      undefined,
    );
    expect(res.status).toBe(200);
    expect(userDeleteMock).toHaveBeenCalledWith({ where: { id: "u1" } });
  });
});
