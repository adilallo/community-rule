import type { ChipOption } from "../../app/components/controls/MultiSelect/MultiSelect.types";
import type {
  CreateFlowState,
} from "../../app/(app)/create/types";

type CoreValuePreset = { label: string; meaning: string; signals: string };

function chipRowsFromPresets(presets: readonly CoreValuePreset[]): ChipOption[] {
  return presets.map((row, i) => ({
    id: String(i + 1),
    label: row.label,
    state: "unselected" as const,
  }));
}

function applySavedSelectionToPresetsOnly(
  options: ChipOption[],
  saved: string[] | undefined,
): ChipOption[] {
  const selected = new Set(saved ?? []);
  return options.map((opt) =>
    opt.state === "custom"
      ? opt
      : {
          ...opt,
          state: selected.has(opt.id)
            ? ("selected" as const)
            : ("unselected" as const),
        },
  );
}

/** Valid MultiSelect chip state from snapshot JSON. */
function normalizeChipState(s: unknown): ChipOption["state"] | undefined {
  return s === "selected" ||
    s === "unselected" ||
    s === "custom" ||
    s === "error"
    ? (s as ChipOption["state"])
    : undefined;
}

/**
 * Build the core-values MultiSelect chip list shown in-create.
 *
 * The published-rule hydration path writes only **selected** rows into
 * `coreValuesChipsSnapshot`. Editing must still show every preset ("1"..N) plus
 * custom ids from the snapshot. Card-deck pin / ordering features do not apply
 * here.
 */
export function buildCoreValueChipOptionsFromDraft(
  presets: readonly CoreValuePreset[],
  snapshot: CreateFlowState["coreValuesChipsSnapshot"],
  selectedCoreValueIds: CreateFlowState["selectedCoreValueIds"],
): ChipOption[] {
  const presetBase = chipRowsFromPresets(presets);
  const presetIdSet = new Set(presetBase.map((p) => p.id));
  const selected = new Set(selectedCoreValueIds ?? []);

  if (!snapshot?.length) {
    return applySavedSelectionToPresetsOnly(presetBase, selectedCoreValueIds);
  }

  const snapById = new Map(snapshot.map((r) => [r.id, r] as const));

  const presetRows: ChipOption[] = presetBase.map((opt) => {
    const row = snapById.get(opt.id);
    if (!row) {
      return {
        ...opt,
        state: selected.has(opt.id) ? ("selected" as const) : ("unselected" as const),
      };
    }
    const normalized = normalizeChipState(row.state);
    const effectiveState =
      normalized ??
      (selected.has(opt.id) ? ("selected" as const) : ("unselected" as const));
    const label =
      typeof row.label === "string" && row.label.trim().length > 0
        ? row.label
        : opt.label;
    return { ...opt, label, state: effectiveState };
  });

  const customRows: ChipOption[] = snapshot
    .filter((r) => !presetIdSet.has(r.id))
    .map((r) => ({
      id: r.id,
      label: r.label,
      state:
        normalizeChipState(r.state) ??
        (selected.has(r.id) ? ("selected" as const) : ("unselected" as const)),
    }));

  return [...presetRows, ...customRows];
}
