import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const findUniqueMock = vi.fn();
const updateMock = vi.fn();
const getSessionUserMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    publishedRule: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
    },
  },
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

import { PATCH } from "../../app/api/rules/[id]/route";

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  findUniqueMock.mockReset();
  updateMock.mockReset();
  getSessionUserMock.mockReset();
  getSessionUserMock.mockResolvedValue({ id: "user-1", email: "a@b.c" });
});

describe("PATCH /api/rules/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValueOnce(null);
    const res = await PATCH(
      new NextRequest("https://x.test/api/rules/r1", {
        method: "PATCH",
        body: JSON.stringify({
          title: "T",
          summary: null,
          document: { sections: [] },
        }),
      }),
      makeContext("r1"),
    );
    expect(res.status).toBe(401);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("returns 403 when the rule belongs to another user", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    findUniqueMock.mockResolvedValueOnce({
      id: "r1",
      userId: "other",
    });
    const res = await PATCH(
      new NextRequest("https://x.test/api/rules/r1", {
        method: "PATCH",
        body: JSON.stringify({
          title: "T",
          summary: null,
          document: { sections: [] },
        }),
      }),
      makeContext("r1"),
    );
    expect(res.status).toBe(403);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("updates the rule when owner matches", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    findUniqueMock.mockResolvedValueOnce({
      id: "r1",
      userId: "user-1",
    });
    updateMock.mockResolvedValueOnce({});
    const res = await PATCH(
      new NextRequest("https://x.test/api/rules/r1", {
        method: "PATCH",
        body: JSON.stringify({
          title: "Updated",
          summary: "Context",
          document: { sections: [], coreValues: [] },
        }),
      }),
      makeContext("r1"),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { ok: boolean };
    expect(body.ok).toBe(true);
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "r1" },
        data: expect.objectContaining({
          title: "Updated",
          summary: "Context",
        }),
      }),
    );
  });
});
