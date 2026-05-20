import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const isDatabaseConfiguredMock = vi.fn();
const createMock = vi.fn();
const getSessionUserMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => isDatabaseConfiguredMock(),
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    publishedRule: {
      create: (...args: unknown[]) => createMock(...args),
    },
  },
}));

vi.mock("../../lib/server/session", () => ({
  getSessionUser: () => getSessionUserMock(),
}));

import { POST } from "../../app/api/use-cases/[slug]/duplicate/route";

function makeContext(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

beforeEach(() => {
  isDatabaseConfiguredMock.mockReset();
  createMock.mockReset();
  getSessionUserMock.mockReset();
});

describe("POST /api/use-cases/[slug]/duplicate", () => {
  it("returns 401 when not signed in", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue(null);
    const res = await POST(
      new NextRequest("https://x.test/api/use-cases/food-not-bombs/duplicate"),
      makeContext("food-not-bombs"),
    );
    expect(res.status).toBe(401);
  });

  it("returns 404 for an unknown slug", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "u1", email: "a@b.c" });
    const res = await POST(
      new NextRequest("https://x.test/api/use-cases/unknown/duplicate"),
      makeContext("unknown"),
    );
    expect(res.status).toBe(404);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("creates a published rule from the use-case fixture", async () => {
    isDatabaseConfiguredMock.mockReturnValue(true);
    getSessionUserMock.mockResolvedValue({ id: "u1", email: "a@b.c" });
    createMock.mockResolvedValueOnce({
      id: "r-new",
      title: "Food Not Bombs Boulder Template (Copy)",
      summary: "Summary",
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    });

    const res = await POST(
      new NextRequest(
        "https://x.test/api/use-cases/food-not-bombs/duplicate",
      ),
      makeContext("food-not-bombs"),
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as { rule: { id: string; title: string } };
    expect(body.rule.id).toBe("r-new");
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "u1",
          title: "Food Not Bombs Boulder Template (Copy)",
          document: expect.objectContaining({
            methodSelections: expect.objectContaining({
              membership: expect.arrayContaining([
                expect.objectContaining({ id: expect.any(String), label: expect.any(String) }),
              ]),
            }),
            coreValues: expect.arrayContaining([
              expect.objectContaining({ chipId: expect.any(String), label: expect.any(String) }),
            ]),
          }),
        }),
      }),
    );
  });
});
