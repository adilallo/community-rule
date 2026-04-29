import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const findUniqueMock = vi.fn();
const deleteMock = vi.fn();
const getSessionUserMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    publishedRule: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      delete: (...args: unknown[]) => deleteMock(...args),
    },
  },
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

import { DELETE } from "../../app/api/rules/[id]/route";

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  findUniqueMock.mockReset();
  deleteMock.mockReset();
  getSessionUserMock.mockReset();
});

describe("DELETE /api/rules/[id]", () => {
  it("returns 401 when not signed in", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue(null);
    const res = await DELETE(
      new NextRequest("https://x.test/api/rules/r1"),
      makeContext("r1"),
    );
    expect(res.status).toBe(401);
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the rule does not exist", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "u1", email: "a@b.c" });
    findUniqueMock.mockResolvedValueOnce(null);
    const res = await DELETE(
      new NextRequest("https://x.test/api/rules/missing"),
      makeContext("missing"),
    );
    expect(res.status).toBe(404);
  });

  it("returns 403 when the rule is owned by another user", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "u1", email: "a@b.c" });
    findUniqueMock.mockResolvedValueOnce({
      id: "r1",
      userId: "other",
    });
    const res = await DELETE(
      new NextRequest("https://x.test/api/rules/r1"),
      makeContext("r1"),
    );
    expect(res.status).toBe(403);
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it("deletes and returns 200 when the user owns the rule", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "u1", email: "a@b.c" });
    findUniqueMock.mockResolvedValueOnce({
      id: "r1",
      userId: "u1",
    });
    deleteMock.mockResolvedValueOnce(undefined);
    const res = await DELETE(
      new NextRequest("https://x.test/api/rules/r1"),
      makeContext("r1"),
    );
    expect(res.status).toBe(200);
    expect(deleteMock).toHaveBeenCalledWith({ where: { id: "r1" } });
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
  });
});
