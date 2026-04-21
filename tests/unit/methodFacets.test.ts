import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  FACET_GROUP_IDS,
  FACET_VALUE_IDS_BY_GROUP,
  SECTION_IDS,
  type SectionId,
  facetGroupsFileSchema,
  sectionFacetsSchema,
} from "../../lib/server/validation/methodFacetsSchemas";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

const SECTION_TO_MESSAGES_FILE: Record<SectionId, string> = {
  communication: "messages/en/create/customRule/communication.json",
  membership: "messages/en/create/customRule/membership.json",
  decisionApproaches: "messages/en/create/customRule/decisionApproaches.json",
  conflictManagement: "messages/en/create/customRule/conflictManagement.json",
};

function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(path.join(REPO_ROOT, rel), "utf8")) as T;
}

describe("data/create/customRule parity (CR-88)", () => {
  for (const section of SECTION_IDS) {
    const messagesPath = SECTION_TO_MESSAGES_FILE[section];
    const dataPath = `data/create/customRule/${section}.json`;

    it(`${section}: facet file matches messages methods one-to-one`, () => {
      const messages = readJson<{ methods: { id: string }[] }>(messagesPath);
      const dataParsed = sectionFacetsSchema.safeParse(readJson(dataPath));
      expect(dataParsed.success).toBe(true);
      if (!dataParsed.success) return;

      const messageSlugs = new Set(messages.methods.map((m) => m.id));
      const dataSlugs = new Set(Object.keys(dataParsed.data));

      const onlyInMessages = [...messageSlugs].filter((s) => !dataSlugs.has(s));
      const onlyInData = [...dataSlugs].filter((s) => !messageSlugs.has(s));

      expect(onlyInMessages, `${section} slugs missing from data/`).toEqual([]);
      expect(onlyInData, `${section} slugs missing from messages/`).toEqual([]);
    });
  }
});

describe("data/create/customRule/_facetGroups.json (CR-88)", () => {
  const groups = readJson<unknown>("data/create/customRule/_facetGroups.json");

  it("matches the facetGroupsFileSchema", () => {
    const parsed = facetGroupsFileSchema.safeParse(groups);
    expect(parsed.success).toBe(true);
  });

  it("every chipId resolves to a real position in the referenced messages file", () => {
    const parsed = facetGroupsFileSchema.parse(groups);
    for (const group of FACET_GROUP_IDS) {
      const block = parsed[group];
      // source is "messages/en/.../foo.json#/<arrayKey>"; resolve relative to repo root.
      const [filePath, jsonPointer] = block.source.split("#");
      const file = readJson<Record<string, { label: string }[]>>(filePath);
      const arrayKey = jsonPointer.replace(/^\//, "");
      const arr = file[arrayKey];
      expect(Array.isArray(arr), `${group}: ${block.source} → array`).toBe(true);
      const positions = new Set(arr.map((_, i) => String(i + 1)));
      for (const [valueId, { chipId }] of Object.entries(block.values)) {
        expect(
          positions.has(chipId),
          `${group}.${valueId} chipId ${chipId} should be a position in ${block.source} (have ${[...positions].join(",")})`,
        ).toBe(true);
      }
    }
  });

  it("uses the canonical 19 value ids across the four groups", () => {
    const parsed = facetGroupsFileSchema.parse(groups);
    let total = 0;
    for (const group of FACET_GROUP_IDS) {
      const expected = new Set(FACET_VALUE_IDS_BY_GROUP[group]);
      const actual = new Set(Object.keys(parsed[group].values));
      expect(actual).toEqual(expected);
      total += actual.size;
    }
    expect(total).toBe(19);
  });
});
