import { describe, expect, it } from "vitest";
import { parsePublishedDocumentForCommunityRuleDisplay } from "../../lib/create/publishedDocumentToDisplaySections";

describe("parsePublishedDocumentForCommunityRuleDisplay", () => {
  it("returns [] for non-object document", () => {
    expect(parsePublishedDocumentForCommunityRuleDisplay(null)).toEqual([]);
  });

  it("drops Overview and appends Values + methods with value body text", () => {
    const doc = {
      sections: [
        {
          categoryName: "Overview",
          entries: [{ title: "Community", body: "Our river cleanup org." }],
        },
      ],
      coreValues: [
        { chipId: "1", label: "Ecology", meaning: "We protect water.", signals: "Litter = violation." },
      ],
      methodSelections: {
        communication: [
          {
            id: "signal",
            label: "Signal",
            sections: {
              corePrinciple: "Privacy first.",
              logisticsAdmin: "Admins rotate.",
              codeOfConduct: "No doxxing.",
            },
          },
        ],
      },
    };
    const out = parsePublishedDocumentForCommunityRuleDisplay(doc);
    expect(out.map((s) => s.categoryName)).toEqual(["Values", "Communication"]);
    expect(out[0].entries[0].title).toBe("Ecology");
    expect(out[0].entries[0].body).toBe(
      "We protect water.\n\nLitter = violation.",
    );
    expect(out[0].entries[0].blocks).toBeUndefined();
    expect(out[1].entries[0].title).toBe("Signal");
    expect(out[1].entries[0].blocks?.length).toBeGreaterThanOrEqual(3);
  });

  it("strips Overview but keeps other categories when both exist", () => {
    const doc = {
      sections: [
        { categoryName: "Overview", entries: [{ title: "Community", body: "x" }] },
        { categoryName: "Membership", entries: [{ title: "Open", body: "y" }] },
      ],
    };
    const out = parsePublishedDocumentForCommunityRuleDisplay(doc);
    expect(out.map((s) => s.categoryName)).toEqual(["Membership"]);
  });

  it("prefers document.coreValues over a parallel Values section in document.sections", () => {
    const doc = {
      sections: [
        {
          categoryName: "Values",
          entries: [{ title: "From template", body: "Template body" }],
        },
      ],
      coreValues: [
        { label: "Should not duplicate", meaning: "x", signals: "y" },
      ],
    };
    const out = parsePublishedDocumentForCommunityRuleDisplay(doc);
    expect(out.length).toBe(1);
    expect(out[0].categoryName).toBe("Values");
    expect(out[0].entries[0].title).toBe("Should not duplicate");
    expect(out[0].entries[0].body).toBe("x\n\ny");
  });

  it("enriches empty core value copy from presets (label match)", () => {
    const doc = {
      sections: [],
      coreValues: [
        { chipId: "", label: "Interdependence", meaning: "", signals: "" },
      ],
    };
    const out = parsePublishedDocumentForCommunityRuleDisplay(doc);
    expect(out[0].entries[0].body).toMatch(/survival and success/);
  });

  it("replaces template placeholder bodies with preset copy, Values first", () => {
    const placeholder =
      "Suggested focus for this governance area. Replace with your own language in the create flow.";
    const doc = {
      sections: [
        {
          categoryName: "Communication",
          entries: [{ title: "Slack", body: placeholder }],
        },
        {
          categoryName: "Values",
          entries: [{ title: "Adaptability", body: placeholder }],
        },
      ],
    };
    const out = parsePublishedDocumentForCommunityRuleDisplay(doc);
    expect(out.map((s) => s.categoryName)).toEqual(["Values", "Communication"]);
    expect(out[0].entries[0].body).not.toContain("Suggested focus");
    expect(out[0].entries[0].body.length).toBeGreaterThan(20);
    expect(out[1].entries[0].blocks?.length).toBeGreaterThanOrEqual(1);
    expect(out[1].entries[0].blocks?.[0]?.body?.length).toBeGreaterThan(10);
  });

  it("matches parseDocumentSectionsForDisplay when no coreValues or methodSelections", () => {
    const doc = {
      sections: [
        { categoryName: "X", entries: [{ title: "t", body: "b" }] },
      ],
    };
    expect(parsePublishedDocumentForCommunityRuleDisplay(doc)).toEqual(
      doc.sections,
    );
  });
});
