import { describe, it, expect } from "vitest";
import {
  buildPublishPayload,
  parseDocumentSectionsForDisplay,
  parseSectionsFromCreateFlowState,
} from "../../lib/create/buildPublishPayload";
import type { CreateFlowState } from "../../app/(app)/create/types";

describe("buildPublishPayload", () => {
  it("returns error when title missing", () => {
    expect(buildPublishPayload({})).toEqual({
      ok: false,
      error: "missingCommunityName",
    });
  });

  it("returns error when title is whitespace only", () => {
    expect(buildPublishPayload({ title: "  \n\t  " })).toEqual({
      ok: false,
      error: "missingCommunityName",
    });
  });

  it("returns title and fallback Overview section when no sections", () => {
    const r = buildPublishPayload({ title: "Oak Park Commons" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.title).toBe("Oak Park Commons");
    expect(r.summary).toBeUndefined();
    expect(r.document).toEqual({
      sections: [
        {
          categoryName: "Overview",
          entries: [
            {
              title: "Community",
              body: "This CommunityRule was created in the create flow. Add more detail in a future edit.",
            },
          ],
        },
      ],
      coreValues: [],
    });
  });

  it("includes trimmed summary in payload and uses it as fallback section body", () => {
    const r = buildPublishPayload({
      title: "  My Group  ",
      summary: "  We organize locally.  ",
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.title).toBe("My Group");
    expect(r.summary).toBe("We organize locally.");
    expect(r.document).toEqual({
      sections: [
        {
          categoryName: "Overview",
          entries: [{ title: "Community", body: "We organize locally." }],
        },
      ],
      coreValues: [],
    });
  });

  it("uses valid state.sections when present", () => {
    const sections: CreateFlowState["sections"] = [
      {
        categoryName: "Values",
        entries: [{ title: "A", body: "B" }],
      },
    ];
    const r = buildPublishPayload({ title: "T", sections });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.document).toEqual({ sections, coreValues: [] });
  });

  it("filters invalid section entries from state.sections", () => {
    const r = buildPublishPayload({
      title: "T",
      sections: [
        { categoryName: "Values", entries: [{ title: "A", body: "B" }] },
        { bad: true } as unknown as Record<string, unknown>,
      ],
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.document).toEqual({
      sections: [{ categoryName: "Values", entries: [{ title: "A", body: "B" }] }],
      coreValues: [],
    });
  });

  it("includes coreValues from selected chips and detail text", () => {
    const r = buildPublishPayload({
      title: "T",
      selectedCoreValueIds: ["1", "2"],
      coreValuesChipsSnapshot: [
        { id: "1", label: "Alpha", state: "selected" },
        { id: "2", label: "Beta", state: "selected" },
      ],
      coreValueDetailsByChipId: {
        "1": { meaning: "m1", signals: "s1" },
      },
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.document.coreValues).toEqual([
      { chipId: "1", label: "Alpha", meaning: "m1", signals: "s1" },
      { chipId: "2", label: "Beta", meaning: "", signals: "" },
    ]);
  });
});

describe("parseDocumentSectionsForDisplay", () => {
  it("returns empty for non-object", () => {
    expect(parseDocumentSectionsForDisplay(null)).toEqual([]);
  });

  it("parses valid sections array", () => {
    const doc = {
      sections: [
        { categoryName: "X", entries: [{ title: "t", body: "b" }] },
      ],
    };
    expect(parseDocumentSectionsForDisplay(doc)).toEqual(doc.sections);
  });
});

describe("parseSectionsFromCreateFlowState", () => {
  it("returns empty when sections missing", () => {
    expect(parseSectionsFromCreateFlowState({})).toEqual([]);
  });
});
