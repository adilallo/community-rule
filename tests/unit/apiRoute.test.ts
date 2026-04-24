import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const errorMock = vi.fn();
vi.mock("../../lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: (...args: unknown[]) => errorMock(...args),
  },
}));

import { apiRoute } from "../../lib/server/apiRoute";
import { REQUEST_ID_HEADER } from "../../lib/server/requestId";

afterEach(() => {
  errorMock.mockReset();
});

function makeReq(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest("https://x.test/api/x", { headers });
}

describe("lib/server/apiRoute", () => {
  it("attaches a generated x-request-id to a successful response", async () => {
    const handler = apiRoute("test.scope", () =>
      NextResponse.json({ ok: true }),
    );
    const res = await handler(makeReq(), undefined);
    expect(res.status).toBe(200);
    const id = res.headers.get(REQUEST_ID_HEADER);
    expect(id).toBeTruthy();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("forwards an incoming x-request-id and exposes it to the handler", async () => {
    const incoming = "req_forwarded-1";
    let seen: string | undefined;
    const handler = apiRoute("test.scope", (_req, _ctx, { requestId }) => {
      seen = requestId;
      return NextResponse.json({ ok: true });
    });
    const res = await handler(
      makeReq({ [REQUEST_ID_HEADER]: incoming }),
      undefined,
    );
    expect(seen).toBe(incoming);
    expect(res.headers.get(REQUEST_ID_HEADER)).toBe(incoming);
  });

  it("returns canonical 500 + logs when the handler throws", async () => {
    const handler = apiRoute("test.scope", () => {
      throw new Error("boom");
    });
    const res = await handler(makeReq(), undefined);
    expect(res.status).toBe(500);
    const body = (await res.json()) as {
      error: { code: string; message: string };
    };
    expect(body.error.code).toBe("internal_error");
    expect(res.headers.get(REQUEST_ID_HEADER)).toBeTruthy();

    expect(errorMock).toHaveBeenCalledTimes(1);
    const payload = errorMock.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.scope).toBe("test.scope");
    expect(payload.requestId).toBe(res.headers.get(REQUEST_ID_HEADER));
    expect(payload.message).toBe("boom");
  });

  it("passes the route ctx through to the handler", async () => {
    type Ctx = { params: Promise<{ id: string }> };
    const handler = apiRoute<Ctx>("test.scope", async (_req, ctx) => {
      const { id } = await ctx.params;
      return NextResponse.json({ id });
    });
    const res = await handler(makeReq(), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: string };
    expect(body.id).toBe("abc");
  });
});
