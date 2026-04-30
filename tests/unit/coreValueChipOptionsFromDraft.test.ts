import { describe, expect, it } from "vitest";

import type { CommunityStructureChipSnapshotRow } from "../../app/(app)/create/types";
import { buildCoreValueChipOptionsFromDraft } from "../../lib/create/coreValueChipOptionsFromDraft";

const PRESETS = [
  { label: "A", meaning: "am", signals: "as" },
  { label: "B", meaning: "bm", signals: "bs" },
  { label: "C", meaning: "cm", signals: "cs" },
] as const;

describe("buildCoreValueChipOptionsFromDraft", () => {
  it("shows every preset plus selection when snapshot only has selected rows (edit / hydrate)", () => {
    const snapshot: CommunityStructureChipSnapshotRow[] = [
      { id: "1", label: "A", state: "selected" },
      { id: "3", label: "C", state: "selected" },
    ];
    const out = buildCoreValueChipOptionsFromDraft(
      PRESETS,
      snapshot,
      ["1", "3"],
    );
    expect(out.map((r) => r.id)).toEqual(["1", "2", "3"]);
    expect(out.map((r) => r.label)).toEqual(["A", "B", "C"]);
    expect(out.map((r) => r.state)).toEqual(["selected", "unselected", "selected"]);
  });

  it("merges preset labels/state from snapshot and appends non-preset (custom) rows", () => {
    const snapshot: CommunityStructureChipSnapshotRow[] = [
      { id: "1", label: "Edited A", state: "unselected" },
      { id: "uuid-1", label: "Custom", state: "selected" },
    ];
    const out = buildCoreValueChipOptionsFromDraft(PRESETS, snapshot, []);
    expect(out).toHaveLength(4);
    expect(out.filter((r) => r.id === "1")[0]?.label).toBe("Edited A");
    expect(out.filter((r) => r.id === "uuid-1")[0]).toMatchObject({
      id: "uuid-1",
      label: "Custom",
      state: "selected",
    });
  });

  it("uses selectedCoreValueIds when snapshot row lacks a valid state string", () => {
    const snapshot: CommunityStructureChipSnapshotRow[] = [
      { id: "2", label: "B", state: "garbage" },
    ];
    const out = buildCoreValueChipOptionsFromDraft(
      PRESETS,
      snapshot,
      ["2"],
    );
    expect(out.map((r) => ({ id: r.id, state: r.state }))).toContainEqual({
      id: "2",
      state: "selected",
    });
  });

  it("with empty snapshot derives from presets and selected ids only", () => {
    const out = buildCoreValueChipOptionsFromDraft(
      PRESETS,
      undefined,
      ["2"],
    );
    expect(out.map((r) => r.id)).toEqual(["1", "2", "3"]);
    expect(out.filter((r) => r.state === "selected").map((r) => r.id)).toEqual(
      ["2"],
    );
  });
});
