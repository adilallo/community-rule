import { describe, expect, it } from "vitest";
import { mergePresetMethodsWithCustom } from "../../lib/create/mergePresetMethodsWithCustom";

describe("mergePresetMethodsWithCustom", () => {
  it("appends selected custom ids that have meta after presets", () => {
    const presets = [
      { id: "a", label: "A", supportText: "sa" },
      { id: "b", label: "B", supportText: "sb" },
    ];
    const customId = "00000000-0000-4000-8000-000000000099";
    const merged = mergePresetMethodsWithCustom(
      presets,
      ["b", customId, "a"],
      {
        [customId]: { label: "Custom", supportText: "cx" },
      },
    );
    expect(merged.map((m) => m.id)).toEqual(["a", "b", customId]);
    expect(merged[2]).toEqual({
      id: customId,
      label: "Custom",
      supportText: "cx",
    });
  });

  it("overlays meta label/supportText onto preset ids for card display", () => {
    const presets = [
      { id: "signal", label: "Signal", supportText: "preset sub" },
    ];
    const merged = mergePresetMethodsWithCustom(
      presets,
      ["signal"],
      {
        signal: { label: "Renamed", supportText: "user sub" },
      },
    );
    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual({
      id: "signal",
      label: "Renamed",
      supportText: "user sub",
    });
  });
});
