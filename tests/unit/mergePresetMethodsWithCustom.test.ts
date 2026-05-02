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
});
