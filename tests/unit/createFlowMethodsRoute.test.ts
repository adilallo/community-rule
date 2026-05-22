import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { listCatalogMethods } from "../../lib/server/governanceCatalog";

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

const communicationCatalog = listCatalogMethods("communication");

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

  it("returns full catalog with copy when no facets are passed", async () => {
    const res = await GET(
      makeReq(
        "https://x.test/api/create-flow/methods?section=communication",
      ),
      undefined,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("max-age=3600");
    const json = (await res.json()) as {
      section: string;
      methods: Array<{
        slug: string;
        label: string;
        description: string;
        matches?: unknown;
      }>;
    };
    expect(json.section).toBe("communication");
    expect(json.methods.length).toBe(communicationCatalog.length);
    expect(json.methods[0].label).toBeTruthy();
    expect(json.methods[0].matches).toBeUndefined();
  });

  it("returns ranked full deck with matches from the facet query", async () => {
    findManyMock.mockResolvedValueOnce([
      { slug: "loomio", group: "size", value: "twoToFive" },
      { slug: "loomio", group: "orgType", value: "workersCoop" },
      { slug: "in-person-meetings", group: "size", value: "twoToFive" },
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
      methods: Array<{
        slug: string;
        label: string;
        matches: { score: number };
      }>;
    };
    expect(json.section).toBe("communication");
    expect(json.methods.length).toBe(communicationCatalog.length);
    expect(json.methods[0].slug).toBe("loomio");
    expect(json.methods[0].matches.score).toBe(2);
    expect(json.methods[1].slug).toBe("in-person-meetings");
    expect(json.methods[1].matches.score).toBe(1);
    expect(json.methods[0].label).toBeTruthy();
  });

  it("returns full catalog without matches when the DB query throws", async () => {
    findManyMock.mockRejectedValueOnce(new Error("db down"));
    const res = await GET(
      makeReq(
        "https://x.test/api/create-flow/methods?section=communication&facet.size=oneMember",
      ),
      undefined,
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      methods: Array<{ slug: string; matches?: unknown }>;
    };
    expect(json.methods.length).toBe(communicationCatalog.length);
    expect(json.methods[0].matches).toBeUndefined();
  });

  it("returns all core values for section=coreValues", async () => {
    const res = await GET(
      makeReq(
        "https://x.test/api/create-flow/methods?section=coreValues",
      ),
      undefined,
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as {
      section: string;
      methods: Array<{ id: string; label: string; meaning: string }>;
    };
    expect(json.section).toBe("coreValues");
    expect(json.methods.length).toBeGreaterThan(50);
    expect(json.methods[0].id).toBe("1");
    expect(json.methods[0].label).toBeTruthy();
    expect(findManyMock).not.toHaveBeenCalled();
  });

  it("accepts values as an alias for coreValues", async () => {
    const res = await GET(
      makeReq("https://x.test/api/create-flow/methods?section=values"),
      undefined,
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as { section: string };
    expect(json.section).toBe("coreValues");
  });
});
