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

describe("buildPublishPayload — methodSelections", () => {
  it("omits document.methodSelections when no method group is selected", () => {
    const r = buildPublishPayload({ title: "T" });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.document.methodSelections).toBeUndefined();
  });

  it("emits preset-only sections when a method is selected without an override", () => {
    const r = buildPublishPayload({
      title: "T",
      selectedCommunicationMethodIds: ["signal"],
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const ms = r.document.methodSelections as
      | Record<string, Array<Record<string, unknown>>>
      | undefined;
    expect(ms).toBeDefined();
    expect(ms?.communication?.length).toBe(1);
    const entry = ms?.communication?.[0] as {
      id: string;
      label: string;
      sections: { corePrinciple: string };
    };
    expect(entry.id).toBe("signal");
    expect(entry.label).toBe("Signal");
    // Preset corePrinciple is non-empty for `signal` in the shipped messages
    // file — proves we read presets when no override is present.
    expect(entry.sections.corePrinciple.length).toBeGreaterThan(0);
  });

  it("merges override on top of preset for the selected method", () => {
    const r = buildPublishPayload({
      title: "T",
      selectedCommunicationMethodIds: ["signal"],
      communicationMethodDetailsById: {
        signal: {
          corePrinciple: "OVERRIDE PRINCIPLE",
          logisticsAdmin: "OVERRIDE LOGISTICS",
          codeOfConduct: "OVERRIDE COC",
        },
      },
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const ms = r.document.methodSelections as
      | Record<string, Array<Record<string, unknown>>>
      | undefined;
    const entry = ms?.communication?.[0] as {
      sections: {
        corePrinciple: string;
        logisticsAdmin: string;
        codeOfConduct: string;
      };
    };
    expect(entry.sections.corePrinciple).toBe("OVERRIDE PRINCIPLE");
    expect(entry.sections.logisticsAdmin).toBe("OVERRIDE LOGISTICS");
    expect(entry.sections.codeOfConduct).toBe("OVERRIDE COC");
  });

  it("emits a methodSelections entry per selected group", () => {
    const r = buildPublishPayload({
      title: "T",
      selectedCommunicationMethodIds: ["signal"],
      selectedMembershipMethodIds: ["open-access"],
      selectedDecisionApproachIds: ["lazy-consensus"],
      selectedConflictManagementIds: ["peer-mediation"],
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const ms = r.document.methodSelections as
      | Record<string, Array<unknown>>
      | undefined;
    expect(Object.keys(ms ?? {}).sort()).toEqual([
      "communication",
      "conflictManagement",
      "decisionApproaches",
      "membership",
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

  it("accepts entries with labeled blocks and empty body", () => {
    const doc = {
      sections: [
        {
          categoryName: "Membership",
          entries: [
            {
              title: "Open membership",
              body: "",
              blocks: [
                { label: "Eligibility", body: "Anyone may join." },
                { label: "Process", body: "Sign the sheet." },
              ],
            },
          ],
        },
      ],
    };
    expect(parseDocumentSectionsForDisplay(doc)).toEqual(doc.sections);
  });

  it("still parses entries with empty body and no blocks", () => {
    const doc = {
      sections: [
        {
          categoryName: "Values",
          entries: [{ title: "Consensus", body: "" }],
        },
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
