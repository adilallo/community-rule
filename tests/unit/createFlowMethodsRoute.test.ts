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
  return { nextUrl: new URL(url) } as unknown as Parameters<typeof GET>[0];
}

beforeEach(() => {
  findManyMock.mockReset();
});

describe("GET /api/create-flow/methods", () => {
  it("400s on missing or unknown section", async () => {
    const r1 = await GET(makeReq("https://x.test/api/create-flow/methods"));
    expect(r1.status).toBe(400);
    const r2 = await GET(
      makeReq("https://x.test/api/create-flow/methods?section=foo"),
    );
    expect(r2.status).toBe(400);
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
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { methods: unknown[] };
    expect(json.methods).toEqual([]);
  });
});
