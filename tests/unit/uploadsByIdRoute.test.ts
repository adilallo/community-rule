import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getUploadRootFromEnvMock = vi.fn();
let uploadRoot: string | null = null;

vi.mock("../../lib/server/uploads/uploadRoot", () => ({
  getUploadRootFromEnv: () => getUploadRootFromEnvMock(),
}));

import { GET } from "../../app/api/uploads/[id]/route";

beforeEach(async () => {
  uploadRoot = await mkdtemp(path.join(tmpdir(), "cr-upload-test-"));
  getUploadRootFromEnvMock.mockReset();
  getUploadRootFromEnvMock.mockImplementation(() => uploadRoot);
});

afterEach(() => {
  uploadRoot = null;
});

describe("GET /api/uploads/[id]", () => {
  it("returns 500 when UPLOAD_ROOT is unset", async () => {
    getUploadRootFromEnvMock.mockReturnValueOnce(null);
    const res = await GET(
      new NextRequest("https://x.test/api/uploads/upload-1"),
      { params: Promise.resolve({ id: "upload-1" }) },
    );
    expect(res.status).toBe(500);
  });

  it("returns 404 when the upload is not found", async () => {
    const res = await GET(
      new NextRequest(
        "https://x.test/api/uploads/550e8400-e29b-41d4-a716-446655440000",
      ),
      {
        params: Promise.resolve({
          id: "550e8400-e29b-41d4-a716-446655440000",
        }),
      },
    );
    expect(res.status).toBe(404);
  });

  it("returns the file bytes with content type", async () => {
    const id = "550e8400-e29b-41d4-a716-446655440000";
    await writeFile(path.join(uploadRoot!, `${id}.png`), "png-bytes");
    const res = await GET(
      new NextRequest(`https://x.test/api/uploads/${id}`),
      { params: Promise.resolve({ id }) },
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(res.headers.get("Cache-Control")).toContain("immutable");
    expect(await res.text()).toBe("png-bytes");
  });
});
