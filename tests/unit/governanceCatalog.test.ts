import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalogMethodSlugsForSection,
  getCatalogCoreValue,
  getCatalogMethod,
  listCatalogCoreValues,
  listCatalogMethods,
} from "../../lib/server/governanceCatalog";
import { SECTION_IDS, type SectionId } from "../../lib/server/validation/methodFacetsSchemas";

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

describe("governanceCatalog (CR-115)", () => {
  for (const section of SECTION_IDS) {
    it(`${section}: catalog slugs match messages methods one-to-one`, () => {
      const messages = readJson<{ methods: { id: string }[] }>(
        SECTION_TO_MESSAGES_FILE[section],
      );
      const messageSlugs = messages.methods.map((m) => m.id);
      const catalogSlugs = catalogMethodSlugsForSection(section);
      expect(catalogSlugs).toEqual(messageSlugs);
    });

    it(`${section}: each method has label, description, and sections`, () => {
      const methods = listCatalogMethods(section);
      expect(methods.length).toBeGreaterThan(0);
      const first = methods[0];
      expect(first.slug).toBeTruthy();
      expect(first.label).toBeTruthy();
      expect(typeof first.description).toBe("string");
      expect(first.sections).toBeDefined();
      expect(getCatalogMethod(section, first.slug)).toEqual(first);
    });
  }

  it("core values: ids are 1-based positions with copy fields", () => {
    const values = listCatalogCoreValues();
    const messages = readJson<{
      values: Array<string | { label: string }>;
    }>("messages/en/create/customRule/coreValues.json");
    expect(values.length).toBe(messages.values.length);
    expect(values[0].id).toBe("1");
    expect(values[0].label).toBeTruthy();
    expect(typeof values[0].meaning).toBe("string");
    expect(typeof values[0].signals).toBe("string");
    expect(getCatalogCoreValue("1")).toEqual(values[0]);
  });
});
