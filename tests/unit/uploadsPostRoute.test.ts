import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const getSessionUserMock = vi.fn();
const getUploadRootFromEnvMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

vi.mock("../../lib/server/uploads/uploadRoot", () => ({
  getUploadRootFromEnv: () => getUploadRootFromEnvMock(),
}));

vi.mock("../../lib/server/rateLimit", () => ({
  rateLimitKey: () => ({ ok: true }),
}));

import { POST } from "../../app/api/uploads/route";

function multipartRequest(opts: {
  purpose?: string;
  fileName?: string;
  fileContent?: string;
}): NextRequest {
  const boundary = "----VitestBoundary";
  const parts: string[] = [];
  if (opts.purpose) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="purpose"\r\n\r\n${opts.purpose}\r\n`,
    );
  }
  if (opts.fileName && opts.fileContent !== undefined) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${opts.fileName}"\r\nContent-Type: image/png\r\n\r\n${opts.fileContent}\r\n`,
    );
  }
  parts.push(`--${boundary}--\r\n`);
  return new NextRequest("https://x.test/api/uploads", {
    method: "POST",
    body: parts.join(""),
    headers: {
      "content-type": `multipart/form-data; boundary=${boundary}`,
    },
  });
}

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  getSessionUserMock.mockReset();
  getUploadRootFromEnvMock.mockReset();
  isDatabaseConfiguredMock.mockReturnValue(true);
  getUploadRootFromEnvMock.mockReturnValue("/tmp/uploads");
});

describe("POST /api/uploads", () => {
  it("returns 503 when the database is not configured", async () => {
    isDatabaseConfiguredMock.mockReturnValue(false);
    const res = await POST(
      new NextRequest("https://x.test/api/uploads", { method: "POST" }),
      undefined,
    );
    expect(res.status).toBe(503);
  });

  it("returns 401 when unauthenticated", async () => {
    getSessionUserMock.mockResolvedValueOnce(null);
    const res = await POST(
      new NextRequest("https://x.test/api/uploads", { method: "POST" }),
      undefined,
    );
    expect(res.status).toBe(401);
  });

  it("returns 500 when UPLOAD_ROOT is unset", async () => {
    getSessionUserMock.mockResolvedValueOnce({ id: "u1", email: "a@b.c" });
    getUploadRootFromEnvMock.mockReturnValueOnce(null);
    const res = await POST(
      new NextRequest("https://x.test/api/uploads", { method: "POST" }),
      undefined,
    );
    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("server_misconfigured");
  });

  it("returns 400 when purpose is missing", async () => {
    getSessionUserMock.mockResolvedValueOnce({ id: "u1", email: "a@b.c" });
    const res = await POST(
      multipartRequest({ fileName: "avatar.png", fileContent: "x" }),
      undefined,
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toBe("validation_error");
  });
});
