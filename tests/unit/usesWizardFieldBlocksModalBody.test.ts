import { describe, expect, it } from "vitest";
import { usesWizardFieldBlocksModalBody } from "../../lib/create/usesWizardFieldBlocksModalBody";
import type { CustomMethodCardFieldBlock } from "../../lib/create/customMethodCardFieldBlocks";

const id = "550e8400-e29b-41d4-a716-446655440000";
const meta = { [id]: { label: "L", supportText: "S" } };
const blocks: CustomMethodCardFieldBlock[] = [
  { kind: "text", id: "b1", blockTitle: "T", placeholderText: "p" },
];

describe("usesWizardFieldBlocksModalBody", () => {
  it("is false without meta row", () => {
    expect(
      usesWizardFieldBlocksModalBody({
        methodId: "signal",
        meta: {},
        fieldBlocksById: {},
        modalEditUnlocked: false,
        draftFieldBlocks: null,
      }),
    ).toBe(false);
  });

  it("is true when persisted field blocks exist (wizard card)", () => {
    expect(
      usesWizardFieldBlocksModalBody({
        methodId: id,
        meta,
        fieldBlocksById: { [id]: blocks },
        modalEditUnlocked: false,
        draftFieldBlocks: null,
      }),
    ).toBe(true);
  });

  it("is true for proportion-only persisted blocks (read-only modal)", () => {
    const proportionBlocks: CustomMethodCardFieldBlock[] = [
      {
        kind: "proportion",
        id: "p1",
        blockTitle: "Share of async",
        defaultPercent: 40,
      },
    ];
    expect(
      usesWizardFieldBlocksModalBody({
        methodId: id,
        meta,
        fieldBlocksById: { [id]: proportionBlocks },
        modalEditUnlocked: false,
        draftFieldBlocks: null,
      }),
    ).toBe(true);
  });

  it("is true when persisted blocks exist even if customMethodCardMetaById row is missing", () => {
    expect(
      usesWizardFieldBlocksModalBody({
        methodId: id,
        meta: {},
        fieldBlocksById: { [id]: blocks },
        modalEditUnlocked: false,
        draftFieldBlocks: null,
      }),
    ).toBe(true);
  });

  it("is false when meta exists but persisted blocks empty and not editing blocks (preset duplicate stub)", () => {
    expect(
      usesWizardFieldBlocksModalBody({
        methodId: id,
        meta,
        fieldBlocksById: { [id]: [] },
        modalEditUnlocked: false,
        draftFieldBlocks: null,
      }),
    ).toBe(false);
  });

  it("is true in read-only modal when custom, blocks empty, and facet matches preset stubs", () => {
    expect(
      usesWizardFieldBlocksModalBody({
        methodId: id,
        meta,
        fieldBlocksById: { [id]: [] },
        modalEditUnlocked: false,
        draftFieldBlocks: null,
        customFacetDetailsMatchPreset: true,
      }),
    ).toBe(true);
  });

  it("is false when customizing with empty wizard draft — structured fields stay active", () => {
    expect(
      usesWizardFieldBlocksModalBody({
        methodId: id,
        meta,
        fieldBlocksById: {},
        modalEditUnlocked: true,
        draftFieldBlocks: [],
      }),
    ).toBe(false);
  });

  it("is true when customizing with non-empty block draft", () => {
    expect(
      usesWizardFieldBlocksModalBody({
        methodId: id,
        meta,
        fieldBlocksById: {},
        modalEditUnlocked: true,
        draftFieldBlocks: blocks,
      }),
    ).toBe(true);
  });
});
