import { describe, it, expect } from "vitest";
import {
  assertPlainJsonValue,
  DEFAULT_PLAIN_JSON_LIMITS,
} from "../../lib/server/validation/plainJson";
import {
  createFlowStateSchema,
  publishRuleBodySchema,
  putDraftBodySchema,
} from "../../lib/server/validation/createFlowSchemas";

describe("assertPlainJsonValue", () => {
  it("accepts plain JSON structures", () => {
    expect(
      assertPlainJsonValue(
        { a: [1, "x", { b: null }], c: true },
        0,
        DEFAULT_PLAIN_JSON_LIMITS,
      ),
    ).toBeNull();
  });

  it("rejects __proto__ keys", () => {
    const obj = JSON.parse('{"__proto__": {"x": 1}}') as Record<
      string,
      unknown
    >;
    expect(assertPlainJsonValue(obj, 0, DEFAULT_PLAIN_JSON_LIMITS)).toBe(
      "Unsafe object key",
    );
  });

  it("rejects non-finite numbers", () => {
    expect(assertPlainJsonValue(Number.NaN, 0, DEFAULT_PLAIN_JSON_LIMITS)).toBe(
      "Invalid number value",
    );
  });

  it("rejects excessive depth", () => {
    let v: unknown = 1;
    for (let i = 0; i < 50; i++) {
      v = { x: v };
    }
    expect(assertPlainJsonValue(v, 0, DEFAULT_PLAIN_JSON_LIMITS)).toBe(
      "Maximum nesting depth exceeded",
    );
  });
});

describe("createFlowStateSchema", () => {
  it("accepts empty object", () => {
    const r = createFlowStateSchema.safeParse({});
    expect(r.success).toBe(true);
  });

  it("accepts known fields and passthrough keys", () => {
    const r = createFlowStateSchema.safeParse({
      title: "My rule",
      currentStep: "communication-methods",
      customField: { nested: [1, 2] },
    });
    expect(r.success).toBe(true);
  });

  it("rejects invalid currentStep", () => {
    const r = createFlowStateSchema.safeParse({ currentStep: "not-a-step" });
    expect(r.success).toBe(false);
  });

  it("rejects title that is too long", () => {
    const r = createFlowStateSchema.safeParse({ title: "x".repeat(600) });
    expect(r.success).toBe(false);
  });

  it("rejects communitySaveEmail longer than 320 chars", () => {
    const r = createFlowStateSchema.safeParse({
      communitySaveEmail: "x".repeat(321),
    });
    expect(r.success).toBe(false);
  });

  it("rejects communityContext longer than 200 chars", () => {
    const r = createFlowStateSchema.safeParse({
      communityContext: "x".repeat(201),
    });
    expect(r.success).toBe(false);
  });

  it("accepts communityStructureChipSnapshots with custom chip rows", () => {
    const r = createFlowStateSchema.safeParse({
      communityStructureChipSnapshots: {
        organizationTypes: [
          { id: "1", label: "Co-op", state: "selected" },
          { id: "custom-uuid", label: "My type", state: "selected" },
        ],
        scale: [{ id: "1", label: "Local" }],
        maturity: [],
      },
    });
    expect(r.success).toBe(true);
  });

  it("rejects invalid chip snapshot row types", () => {
    const r = createFlowStateSchema.safeParse({
      communityStructureChipSnapshots: {
        organizationTypes: [{ id: "1", label: 123 }],
      },
    });
    expect(r.success).toBe(false);
  });

  it("accepts coreValueDetailsByChipId", () => {
    const r = createFlowStateSchema.safeParse({
      coreValueDetailsByChipId: {
        "1": { meaning: "We care about access.", signals: "Blocking access." },
        "uuid-here": { meaning: "", signals: "" },
      },
    });
    expect(r.success).toBe(true);
  });

  it("accepts templateReviewBackSlug", () => {
    const r = createFlowStateSchema.safeParse({
      templateReviewBackSlug: "mutual-aid-mondays",
    });
    expect(r.success).toBe(true);
  });

  it("accepts templateReviewEntryFromCreateFlow", () => {
    const r = createFlowStateSchema.safeParse({
      templateReviewEntryFromCreateFlow: true,
    });
    expect(r.success).toBe(true);
  });

  it("rejects core value detail strings that are too long", () => {
    const r = createFlowStateSchema.safeParse({
      coreValueDetailsByChipId: {
        "1": { meaning: "x".repeat(8001), signals: "y" },
      },
    });
    expect(r.success).toBe(false);
  });
});

describe("putDraftBodySchema", () => {
  it("requires payload object", () => {
    expect(putDraftBodySchema.safeParse({}).success).toBe(false);
    expect(putDraftBodySchema.safeParse({ payload: {} }).success).toBe(true);
  });
});

describe("publishRuleBodySchema", () => {
  it("accepts minimal valid body", () => {
    const r = publishRuleBodySchema.safeParse({
      title: "  Hello  ",
      document: { body: "text" },
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.title).toBe("Hello");
      expect(r.data.summary).toBeNull();
    }
  });

  it("trims summary and maps empty to null", () => {
    const r = publishRuleBodySchema.safeParse({
      title: "T",
      summary: "   ",
      document: {},
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.summary).toBeNull();
    }
  });

  it("rejects empty title", () => {
    const r = publishRuleBodySchema.safeParse({
      title: "   ",
      document: {},
    });
    expect(r.success).toBe(false);
  });

  it("rejects non-object document", () => {
    const r = publishRuleBodySchema.safeParse({
      title: "Ok",
      document: "nope",
    });
    expect(r.success).toBe(false);
  });
});
