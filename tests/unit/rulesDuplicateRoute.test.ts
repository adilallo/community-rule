import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const findUniqueMock = vi.fn();
const createMock = vi.fn();
const getSessionUserMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    publishedRule: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      create: (...args: unknown[]) => createMock(...args),
    },
  },
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

import { POST } from "../../app/api/rules/[id]/duplicate/route";

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  findUniqueMock.mockReset();
  createMock.mockReset();
  getSessionUserMock.mockReset();
});

describe("POST /api/rules/[id]/duplicate", () => {
  it("returns 401 when not signed in", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue(null);
    const res = await POST(
      new NextRequest("https://x.test/api/rules/r1/duplicate"),
      makeContext("r1"),
    );
    expect(res.status).toBe(401);
  });

  it("returns 404 when the source rule does not exist", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "u1", email: "a@b.c" });
    findUniqueMock.mockResolvedValueOnce(null);
    const res = await POST(
      new NextRequest("https://x.test/api/rules/missing/duplicate"),
      makeContext("missing"),
    );
    expect(res.status).toBe(404);
  });

  it("returns 403 when the user does not own the source rule", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "u1", email: "a@b.c" });
    findUniqueMock.mockResolvedValueOnce({
      id: "r1",
      userId: "other",
      title: "T",
      summary: null,
      document: {},
    });
    const res = await POST(
      new NextRequest("https://x.test/api/rules/r1/duplicate"),
      makeContext("r1"),
    );
    expect(res.status).toBe(403);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("returns 201-style 200 with the new rule when duplicate succeeds", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "u1", email: "a@b.c" });
    findUniqueMock.mockResolvedValueOnce({
      id: "r1",
      userId: "u1",
      title: "Original",
      summary: "S",
      document: { x: 1 },
    });
    createMock.mockResolvedValueOnce({
      id: "r2",
      title: "Original (Copy)",
      summary: "S",
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    });
    const res = await POST(
      new NextRequest("https://x.test/api/rules/r1/duplicate"),
      makeContext("r1"),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { rule: { id: string; title: string } };
    expect(body.rule.id).toBe("r2");
    expect(body.rule.title).toBe("Original (Copy)");
  });
});
