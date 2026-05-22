import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const getSessionUserMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

import { GET } from "../../app/api/auth/session/route";

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  getSessionUserMock.mockReset();
});

describe("GET /api/auth/session", () => {
  it("returns 503 when the database is not configured", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await GET(
      new NextRequest("https://x.test/api/auth/session"),
      undefined,
    );
    expect(res.status).toBe(503);
    expect(getSessionUserMock).not.toHaveBeenCalled();
  });

  it("returns user null when there is no session", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValueOnce(null);
    const res = await GET(
      new NextRequest("https://x.test/api/auth/session"),
      undefined,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ user: null });
  });

  it("returns the signed-in user id and email", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValueOnce({
      id: "u1",
      email: "member@example.com",
    });
    const res = await GET(
      new NextRequest("https://x.test/api/auth/session"),
      undefined,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      user: { id: "u1", email: "member@example.com" },
    });
  });

  it("forwards an incoming x-request-id on the response", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValueOnce(null);
    const res = await GET(
      new NextRequest("https://x.test/api/auth/session", {
        headers: { "x-request-id": "req_session-1" },
      }),
      undefined,
    );
    expect(res.headers.get("x-request-id")).toBe("req_session-1");
  });
});
