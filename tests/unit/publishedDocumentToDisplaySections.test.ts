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

  it("replaces stale document.sections method category with full methodSelections (custom rules)", () => {
    const customId = "b7c0a9f3-0000-4000-8000-000000000001";
    const doc = {
      sections: [
        {
          categoryName: "Communication",
          entries: [
            {
              title: "Slack",
              body: "Only template row; custom card missing from sections.",
            },
          ],
        },
      ],
      methodSelections: {
        communication: [
          {
            id: "slack",
            label: "Slack",
            sections: {
              corePrinciple: "Slack principle",
              logisticsAdmin: "Slack logistics",
              codeOfConduct: "Slack conduct",
            },
          },
          {
            id: customId,
            label: "My custom comms",
            sections: {
              corePrinciple: "Custom principle",
              logisticsAdmin: "",
              codeOfConduct: "",
            },
          },
        ],
      },
    };
    const out = parsePublishedDocumentForCommunityRuleDisplay(doc);
    const comm = out.find((s) => s.categoryName === "Communication");
    expect(comm).toBeDefined();
    expect(comm?.entries.map((e) => e.title)).toEqual([
      "Slack",
      "My custom comms",
    ]);
    expect(
      comm?.entries.some(
        (e) => e.title === "My custom comms" && e.blocks?.length,
      ),
    ).toBe(true);
  });

  it("includes wizard field blocks when methodSelections preset sections are empty (custom UUID)", () => {
    const customId = "b7c0a9f3-0000-4000-8000-000000000001";
    const doc = {
      sections: [
        {
          categoryName: "Communication",
          entries: [{ title: "Stale template row", body: "ignored after merge" }],
        },
      ],
      methodSelections: {
        communication: [
          {
            id: customId,
            label: "Custom method title",
            sections: {
              corePrinciple: "",
              logisticsAdmin: "",
              codeOfConduct: "",
            },
          },
        ],
      },
      customMethodCardFieldBlocksById: {
        [customId]: [
          {
            kind: "text" as const,
            id: "f1",
            blockTitle: "Expectations",
            placeholderText: "Answer stored only on field blocks.",
          },
        ],
      },
    };
    const out = parsePublishedDocumentForCommunityRuleDisplay(doc);
    const comm = out.find((s) => s.categoryName === "Communication");
    expect(comm?.entries.map((e) => e.title)).toEqual(["Custom method title"]);
    expect(comm?.entries[0]?.blocks).toEqual([
      { label: "Expectations", body: "Answer stored only on field blocks." },
    ]);
  });

  it("exposes custom upload image blocks with imageUrl for CommunityRule display", () => {
    const customId = "b7c0a9f3-0000-4000-8000-000000000002";
    const doc = {
      sections: [],
      methodSelections: {
        communication: [
          {
            id: customId,
            label: "Policy with photo",
            sections: {
              corePrinciple: "",
              logisticsAdmin: "",
              codeOfConduct: "",
            },
          },
        ],
      },
      customMethodCardFieldBlocksById: {
        [customId]: [
          {
            kind: "upload" as const,
            id: "u1",
            blockTitle: "Site photo",
            fileName: "garden.jpg",
            assetUrl: "/api/uploads/11111111-1111-4111-8111-111111111111",
          },
        ],
      },
    };
    const out = parsePublishedDocumentForCommunityRuleDisplay(doc);
    const comm = out.find((s) => s.categoryName === "Communication");
    expect(comm?.entries[0]?.blocks).toEqual([
      {
        label: "Site photo",
        body: "",
        imageUrl: "/api/uploads/11111111-1111-4111-8111-111111111111",
      },
    ]);
  });
});
