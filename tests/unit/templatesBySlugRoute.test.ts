import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findUniqueMock = vi.fn();

vi.mock("../../lib/server/env", () => ({
  isDatabaseConfigured: () => true,
}));

vi.mock("../../lib/server/db", () => ({
  prisma: {
    ruleTemplate: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
    },
  },
}));

import { GET } from "../../app/api/templates/[slug]/route";

function makeReq(url: string) {
  return new NextRequest(url);
}

const consensusTemplate = {
  id: "tpl-1",
  slug: "consensus",
  title: "Consensus",
  category: null,
  description: "Desc",
  body: {
    sections: [
      {
        categoryName: "Communication",
        entries: [{ title: "Loomio", body: "" }],
      },
    ],
  },
  sortOrder: 0,
  featured: true,
};

beforeEach(() => {
  findUniqueMock.mockReset();
});

describe("GET /api/templates/[slug]", () => {
  it("404s when slug is unknown", async () => {
    findUniqueMock.mockResolvedValueOnce(null);
    const res = await GET(
      makeReq("https://x.test/api/templates/unknown"),
      { params: Promise.resolve({ slug: "unknown" }) },
    );
    expect(res.status).toBe(404);
  });

  it("returns template and composed methods for a known slug", async () => {
    findUniqueMock.mockResolvedValueOnce(consensusTemplate);
    const res = await GET(
      makeReq("https://x.test/api/templates/consensus"),
      { params: Promise.resolve({ slug: "consensus" }) },
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("max-age=3600");
    const json = (await res.json()) as {
      template: { slug: string };
      methods: Array<{ section: string; slug: string }>;
    };
    expect(json.template.slug).toBe("consensus");
    expect(json.methods.length).toBeGreaterThan(0);
    expect(json.methods[0]).toMatchObject({
      section: "communication",
      slug: "loomio",
    });
  });
});
