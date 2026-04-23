import { describe, expect, it } from "vitest";
import {
  dbUnavailable,
  errorJson,
  internalError,
  notFound,
  rateLimited,
  serverMisconfigured,
  unauthorized,
} from "../../lib/server/responses";

async function readBody(res: Response): Promise<{
  error: { code: string; message: string };
  details?: unknown;
}> {
  return (await res.json()) as {
    error: { code: string; message: string };
    details?: unknown;
  };
}

describe("lib/server/responses", () => {
  it("errorJson returns the canonical shape, status, and details", async () => {
    const res = errorJson("validation_error", "Bad input", 400, {
      details: { field: "email" },
      headers: { "x-custom": "1" },
    });
    expect(res.status).toBe(400);
    expect(res.headers.get("x-custom")).toBe("1");
    const body = await readBody(res);
    expect(body).toEqual({
      error: { code: "validation_error", message: "Bad input" },
      details: { field: "email" },
    });
  });

  it("errorJson omits details when not provided", async () => {
    const res = errorJson("internal_error", "Boom", 500);
    const body = await readBody(res);
    expect(body.details).toBeUndefined();
    expect(body.error).toEqual({ code: "internal_error", message: "Boom" });
  });

  it("dbUnavailable → 503 db_unavailable", async () => {
    const res = dbUnavailable();
    expect(res.status).toBe(503);
    const body = await readBody(res);
    expect(body.error.code).toBe("db_unavailable");
  });

  it("unauthorized → 401 unauthorized", async () => {
    const res = unauthorized();
    expect(res.status).toBe(401);
    const body = await readBody(res);
    expect(body.error).toEqual({
      code: "unauthorized",
      message: "Unauthorized",
    });
  });

  it("notFound → 404 not_found with optional message", async () => {
    const res = notFound("Rule not found");
    expect(res.status).toBe(404);
    const body = await readBody(res);
    expect(body.error).toEqual({
      code: "not_found",
      message: "Rule not found",
    });
  });

  it("rateLimited → 429 with Retry-After header (seconds, ceil) and details", async () => {
    const res = rateLimited(2500);
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBe("3");
    const body = await readBody(res);
    expect(body.error.code).toBe("rate_limited");
    expect(body.details).toEqual({ retryAfterMs: 2500 });
  });

  it("rateLimited clamps Retry-After to at least 1 second", () => {
    const res = rateLimited(0);
    expect(res.headers.get("retry-after")).toBe("1");
  });

  it("serverMisconfigured → 500 server_misconfigured", async () => {
    const res = serverMisconfigured();
    expect(res.status).toBe(500);
    const body = await readBody(res);
    expect(body.error.code).toBe("server_misconfigured");
  });

  it("internalError → 500 internal_error", async () => {
    const res = internalError();
    expect(res.status).toBe(500);
    const body = await readBody(res);
    expect(body.error.code).toBe("internal_error");
  });
});
