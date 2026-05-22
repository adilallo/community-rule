import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const queryRawMock = vi.fn();

vi.mock("../../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../../lib/server/db", () => ({
  prisma: {
    $queryRaw: (...args: unknown[]) => queryRawMock(...args),
  },
}));

import { GET } from "../../../app/api/health/route";

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  queryRawMock.mockReset();
});

describe("GET /api/health", () => {
  it("returns not_configured when DATABASE_URL is unset", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await GET(
      new NextRequest("https://x.test/api/health"),
      undefined,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      database: "not_configured",
    });
    expect(res.headers.get("x-request-id")).toBeTruthy();
    expect(queryRawMock).not.toHaveBeenCalled();
  });

  it("returns connected when the database probe succeeds", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    queryRawMock.mockResolvedValueOnce([{ "?column?": 1 }]);
    const res = await GET(
      new NextRequest("https://x.test/api/health"),
      undefined,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      ok: true,
      database: "connected",
    });
    expect(queryRawMock).toHaveBeenCalled();
    expect(res.headers.get("x-request-id")).toBeTruthy();
  });

  it("returns 503 with database error when the probe fails", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    queryRawMock.mockRejectedValueOnce(new Error("connection refused"));
    const res = await GET(
      new NextRequest("https://x.test/api/health"),
      undefined,
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({
      ok: false,
      database: "error",
    });
    expect(res.headers.get("x-request-id")).toBeTruthy();
  });

  it("forwards an incoming x-request-id on the response", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await GET(
      new NextRequest("https://x.test/api/health", {
        headers: { "x-request-id": "req_health-1" },
      }),
      undefined,
    );
    expect(res.headers.get("x-request-id")).toBe("req_health-1");
  });
});
