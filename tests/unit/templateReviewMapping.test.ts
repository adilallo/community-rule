import { describe, expect, it } from "vitest";
import {
  templateBodyToCategories,
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
});
