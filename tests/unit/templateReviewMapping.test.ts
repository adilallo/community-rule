import { describe, expect, it } from "vitest";
import {
  templateBodyToCategories,
  templateBodyToReviewData,
  templateCategoryToGroupKey,
  templateSummaryFromBody,
} from "../../lib/create/templateReviewMapping";

describe("templateReviewMapping", () => {
  it("maps body sections to RuleCard categories", () => {
    const body = {
      sections: [
        {
          categoryName: "Values",
          entries: [
            { title: "Solidarity", body: "Long body" },
            { title: "Ecology", body: "More" },
          ],
        },
      ],
    };
    const cats = templateBodyToCategories(body);
    expect(cats).toHaveLength(1);
    expect(cats[0].name).toBe("Values");
    expect(cats[0].chipOptions.map((c) => c.label)).toEqual([
      "Solidarity",
      "Ecology",
    ]);
    expect(cats[0].chipOptions.every((c) => c.state === "unselected")).toBe(
      true,
    );
  });

  it("uses description for summary when present", () => {
    expect(
      templateSummaryFromBody("Short API description", { sections: [] }),
    ).toBe("Short API description");
  });

  it("falls back to first entry body when description empty", () => {
    const body = {
      sections: [
        {
          categoryName: "X",
          entries: [{ title: "T", body: "  First paragraph.  " }],
        },
      ],
    };
    expect(templateSummaryFromBody("", body)).toBe("First paragraph.");
  });

  describe("templateCategoryToGroupKey", () => {
    it.each([
      ["Values", "coreValues"],
      ["Core values", "coreValues"],
      ["Communication", "communication"],
      ["Membership", "membership"],
      ["Decision-making", "decisionApproaches"],
      ["Decision making", "decisionApproaches"],
      ["Conflict management", "conflictManagement"],
      ["Conflict Resolution", "conflictManagement"],
    ] as const)("maps %s -> %s", (input, expected) => {
      expect(templateCategoryToGroupKey(input)).toBe(expected);
    });

    it("returns null for unknown categories", () => {
      expect(templateCategoryToGroupKey("Mystery")).toBeNull();
    });
  });

  describe("templateBodyToReviewData", () => {
    it("returns group-keyed chip detail lookup aligned with categories", () => {
      const body = {
        sections: [
          {
            categoryName: "Decision-making",
            entries: [
              { title: "Consensus Decision-Making", body: "body-1" },
              { title: "Modified Consensus", body: "body-2" },
            ],
          },
          {
            categoryName: "Values",
            entries: [{ title: "Solidarity", body: "body-3" }],
          },
          {
            categoryName: "Mystery",
            entries: [{ title: "Unknown", body: "body-4" }],
          },
        ],
      };
      const { categories, chipDetailsByChipId } = templateBodyToReviewData(body);
      expect(categories).toHaveLength(3);

      const firstChipId = categories[0].chipOptions[0].id;
      expect(chipDetailsByChipId[firstChipId]).toEqual({
        chipId: firstChipId,
        chipLabel: "Consensus Decision-Making",
        categoryName: "Decision-making",
        groupKey: "decisionApproaches",
        body: "body-1",
      });
      expect(
        chipDetailsByChipId[categories[1].chipOptions[0].id].groupKey,
      ).toBe("coreValues");
      expect(
        chipDetailsByChipId[categories[2].chipOptions[0].id].groupKey,
      ).toBeNull();
    });

    it("is resilient to bad body input", () => {
      expect(templateBodyToReviewData(null).categories).toEqual([]);
      expect(templateBodyToReviewData({}).chipDetailsByChipId).toEqual({});
      expect(templateBodyToReviewData({ sections: "nope" }).categories).toEqual(
        [],
      );
    });
  });
});
