import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findManyMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => true,
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    methodFacet: {
      findMany: (...args: unknown[]) => findManyMock(...args),
    },
  },
}));

import { GET } from "../../app/api/create-flow/methods/route";

function makeReq(url: string) {
  return new NextRequest(url);
}

beforeEach(() => {
  findManyMock.mockReset();
});

describe("GET /api/create-flow/methods", () => {
  it("400s on missing or unknown section with the canonical error shape", async () => {
    const r1 = await GET(
      makeReq("https://x.test/api/create-flow/methods"),
      undefined,
    );
    expect(r1.status).toBe(400);
    const body1 = (await r1.json()) as {
      error: { code: string; message: string };
    };
    expect(body1.error.code).toBe("validation_error");
    expect(body1.error.message).toMatch(/Unknown section/);
    expect(r1.headers.get("x-request-id")).toBeTruthy();

    const r2 = await GET(
      makeReq("https://x.test/api/create-flow/methods?section=foo"),
      undefined,
    );
    expect(r2.status).toBe(400);
    const body2 = (await r2.json()) as {
      error: { code: string; message: string };
    };
    expect(body2.error.code).toBe("validation_error");
  });

  it("returns ranked methods from the facet query", async () => {
    findManyMock.mockResolvedValueOnce([
      { slug: "loomio", group: "size", value: "twoToFive" },
      { slug: "loomio", group: "orgType", value: "workersCoop" },
      { slug: "in-person", group: "size", value: "twoToFive" },
    ]);
    const res = await GET(
      makeReq(
        "https://x.test/api/create-flow/methods?section=communication&facet.size=twoToFive&facet.orgType=workersCoop",
      ),
      undefined,
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      section: string;
      methods: { slug: string; matches: { score: number } }[];
    };
    expect(json.section).toBe("communication");
    expect(json.methods.map((m) => m.slug)).toEqual(["loomio", "in-person"]);
    expect(json.methods[0].matches.score).toBe(2);
  });

  it("returns empty methods when the DB query throws (caller falls back)", async () => {
    findManyMock.mockRejectedValueOnce(new Error("db down"));
    const res = await GET(
      makeReq(
        "https://x.test/api/create-flow/methods?section=communication&facet.size=oneMember",
      ),
      undefined,
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { methods: unknown[] };
    expect(json.methods).toEqual([]);
  });
});
