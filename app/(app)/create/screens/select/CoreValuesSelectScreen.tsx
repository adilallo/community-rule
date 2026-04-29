"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import MultiSelect from "../../../../components/controls/MultiSelect";
import type { ChipOption } from "../../../../components/controls/MultiSelect/MultiSelect.types";
import Create from "../../../../components/modals/Create";
import ContentLockup from "../../../../components/type/ContentLockup";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import type {
  CommunityStructureChipSnapshotRow,
  CoreValueDetailEntry,
} from "../../types";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";
import { CoreValueEditFields } from "../../components/methodEditFields";

const MAX_CORE_VALUES = 5;

/**
 * Why three sessions, not two:
 *
 * - `pending` — preset chip just selected; modal opened to capture
 *   meaning/signals. Dismiss = unselect the chip (keep it in the
 *   preset row, just not selected).
 * - `customPending` — brand-new custom chip just created via the Add
 *   value flow; modal opened with empty fields. Dismiss = drop the
 *   chip entirely (it was never confirmed via the Add Value button).
 * - `editing` — chip already exists & is selected; modal reopened to
 *   tweak meaning/signals. Dismiss = no-op (chip stays as-is).
 */
type ModalSession = "pending" | "customPending" | "editing";

/** Row in `coreValues.json` `values` — string (legacy) or `{ label, meaning, signals }`. */
type CoreValuePresetJson =
  | string
  | { label: string; meaning?: string; signals?: string };

type CoreValuePreset = {
  label: string;
  meaning: string;
  signals: string;
};

function normalizeCoreValuePresets(
  values: readonly CoreValuePresetJson[],
): CoreValuePreset[] {
  return values.map((v) => {
    if (typeof v === "string") {
      return { label: v, meaning: "", signals: "" };
    }
    return {
      label: v.label,
      meaning: typeof v.meaning === "string" ? v.meaning : "",
      signals: typeof v.signals === "string" ? v.signals : "",
    };
  });
}

function chipRowsFromPresets(presets: readonly CoreValuePreset[]): ChipOption[] {
  return presets.map((row, i) => ({
    id: String(i + 1),
    label: row.label,
    state: "unselected" as const,
  }));
}

function applySavedSelection(
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

function selectedIdsFromOptions(options: ChipOption[]): string[] {
  return options
    .filter((o) => o.state === "selected")
    .map((o) => o.id);
}

function chipOptionsToSnapshotRows(
  options: ChipOption[],
): CommunityStructureChipSnapshotRow[] {
  return options.map((o) => ({
    id: o.id,
    label: o.label,
    ...(o.state !== undefined ? { state: o.state } : {}),
  }));
}

function snapshotRowsToChipOptions(
  rows: CommunityStructureChipSnapshotRow[] | undefined,
): ChipOption[] | null {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    ...(r.state !== undefined
      ? { state: r.state as ChipOption["state"] }
      : {}),
  }));
}

const EMPTY_DETAIL: CoreValueDetailEntry = { meaning: "", signals: "" };

/** Create Custom — Core Values (Figma `20264:68378`). Up to five selections; preset list + custom chips. */
export function CoreValuesSelectScreen() {
  const m = useMessages();
  const cv = m.create.customRule.coreValues;
  const presets = useMemo(
    () => normalizeCoreValuePresets(cv.values as CoreValuePresetJson[]),
    [cv.values],
  );

  const { markCreateFlowInteraction, updateState, state } = useCreateFlow();

  const [coreValueOptions, setCoreValueOptions] = useState<ChipOption[]>(
    () => {
      const fromSnap = snapshotRowsToChipOptions(state.coreValuesChipsSnapshot);
      if (fromSnap) return fromSnap;
      return applySavedSelection(
        chipRowsFromPresets(presets),
        state.selectedCoreValueIds,
      );
    },
  );

  const [activeModalChipId, setActiveModalChipId] = useState<string | null>(
    null,
  );
  const [modalSession, setModalSession] = useState<ModalSession | null>(null);
  const [draft, setDraft] = useState<CoreValueDetailEntry>(EMPTY_DETAIL);

  useEffect(() => {
    const fromSnap = snapshotRowsToChipOptions(state.coreValuesChipsSnapshot);
    if (fromSnap) {
      setCoreValueOptions(fromSnap);
      return;
    }
    setCoreValueOptions((prev) =>
      applySavedSelection(prev, state.selectedCoreValueIds),
    );
  }, [state.coreValuesChipsSnapshot, state.selectedCoreValueIds]);

  /** Sync chips to create-flow draft. Never call `updateState` from inside a `setCoreValueOptions` updater — defer with `queueMicrotask`. */
  const syncCoreValuesToDraft = useCallback(
    (next: ChipOption[]) => {
      updateState({
        selectedCoreValueIds: selectedIdsFromOptions(next),
        coreValuesChipsSnapshot: chipOptionsToSnapshotRows(next),
      });
    },
    [updateState],
  );

  const persistCoreValues = useCallback(
    (next: ChipOption[]) => {
      markCreateFlowInteraction();
      setCoreValueOptions(next);
      syncCoreValuesToDraft(next);
    },
    [markCreateFlowInteraction, syncCoreValuesToDraft],
  );

  /** Default meaning/signals from `coreValues.json` `values` for each preset label. */
  const getPresetTexts = useCallback(
    (valueLabel: string): CoreValueDetailEntry => {
      const row = presets.find((p) => p.label === valueLabel);
      if (!row) return EMPTY_DETAIL;
      return { meaning: row.meaning, signals: row.signals };
    },
    [presets],
  );

  const getInitialTexts = useCallback(
    (chipId: string, valueLabel: string): CoreValueDetailEntry => {
      const saved = state.coreValueDetailsByChipId?.[chipId];
      const preset = getPresetTexts(valueLabel);
      return {
        meaning: saved?.meaning ?? preset.meaning,
        signals: saved?.signals ?? preset.signals,
      };
    },
    [state.coreValueDetailsByChipId, getPresetTexts],
  );

  const openModal = useCallback(
    (chipId: string, session: ModalSession, valueLabel: string) => {
      setDraft(getInitialTexts(chipId, valueLabel));
      setActiveModalChipId(chipId);
      setModalSession(session);
      markCreateFlowInteraction();
    },
    [getInitialTexts, markCreateFlowInteraction],
  );

  const handleDraftChange = useCallback(
    (next: CoreValueDetailEntry) => {
      markCreateFlowInteraction();
      setDraft(next);
    },
    [markCreateFlowInteraction],
  );

  const handleModalDismiss = useCallback(() => {
    if (activeModalChipId && modalSession === "pending") {
      const next = coreValueOptions.map((opt) =>
        opt.id === activeModalChipId
          ? { ...opt, state: "unselected" as const }
          : opt,
      );
      persistCoreValues(next);
    } else if (activeModalChipId && modalSession === "customPending") {
      // Custom chip never confirmed via Add Value — drop it from both
      // the local options and the create-flow draft so refresh / back
      // navigation doesn't resurrect a phantom chip.
      const next = coreValueOptions.filter(
        (opt) => opt.id !== activeModalChipId,
      );
      persistCoreValues(next);
    }
    setActiveModalChipId(null);
    setModalSession(null);
  }, [activeModalChipId, modalSession, coreValueOptions, persistCoreValues]);

  const handleModalConfirm = useCallback(() => {
    if (!activeModalChipId) return;
    markCreateFlowInteraction();
    updateState({
      coreValueDetailsByChipId: {
        ...(state.coreValueDetailsByChipId ?? {}),
        [activeModalChipId]: draft,
      },
    });
    setActiveModalChipId(null);
    setModalSession(null);
  }, [
    activeModalChipId,
    draft,
    markCreateFlowInteraction,
    state.coreValueDetailsByChipId,
    updateState,
  ]);

  const handleChipClick = (chipId: string) => {
    const target = coreValueOptions.find((o) => o.id === chipId);
    if (!target || target.state === "custom") return;

    const selectedCount = coreValueOptions.filter(
      (o) => o.state === "selected",
    ).length;

    if (target.state === "selected") {
      const next: ChipOption[] = coreValueOptions.map((opt) =>
        opt.id === chipId
          ? { ...opt, state: "unselected" as const }
          : opt,
      );
      persistCoreValues(next);
      return;
    }

    if (selectedCount >= MAX_CORE_VALUES) return;

    const next: ChipOption[] = coreValueOptions.map((opt) =>
      opt.id === chipId
        ? { ...opt, state: "selected" as const }
        : opt,
    );
    persistCoreValues(next);
    openModal(chipId, "pending", target.label);
  };

  const addHandlers = {
    onAddClick: () => {
      markCreateFlowInteraction();
      setCoreValueOptions((prev) => {
        const next: ChipOption[] = [
          ...prev,
          { id: crypto.randomUUID(), label: "", state: "custom" },
        ];
        queueMicrotask(() => syncCoreValuesToDraft(next));
        return next;
      });
    },
    onCustomChipConfirm: (chipId: string, value: string) => {
      markCreateFlowInteraction();
      setCoreValueOptions((prev) => {
        const withLabel = prev.map((opt) =>
          opt.id === chipId
            ? { ...opt, label: value, state: "unselected" as const }
            : opt,
        );
        const selectedCount = withLabel.filter(
          (o) => o.state === "selected",
        ).length;
        const canSelect = selectedCount < MAX_CORE_VALUES;
        const next = canSelect
          ? withLabel.map((opt) =>
              opt.id === chipId
                ? { ...opt, state: "selected" as const }
                : opt,
            )
          : withLabel;

        queueMicrotask(() => {
          syncCoreValuesToDraft(next);
          // Both branches treat the chip as a brand-new draft until the
          // user confirms via Add Value — dismissal removes it.
          openModal(chipId, "customPending", value);
        });
        return next;
      });
    },
    onCustomChipClose: (chipId: string) => {
      markCreateFlowInteraction();
      setCoreValueOptions((prev) => {
        const next = prev.filter((o) => o.id !== chipId);
        queueMicrotask(() => syncCoreValuesToDraft(next));
        return next;
      });
    },
  };

  const modalChipLabel =
    coreValueOptions.find((o) => o.id === activeModalChipId)?.label ?? "";

  const description = (
    <>
      <span className="leading-[1.3] text-[color:var(--color-content-default-tertiary,#b4b4b4)]">
        {cv.header.descriptionLead}{" "}
      </span>
      <button
        type="button"
        onClick={addHandlers.onAddClick}
        className="cursor-pointer font-inter font-normal leading-[1.3] text-[color:var(--color-content-default-tertiary,#b4b4b4)] underline decoration-solid underline-offset-[3px] hover:opacity-90"
      >
        {cv.header.addLink}
      </button>
      <span className="leading-[1.3] text-[color:var(--color-content-default-tertiary,#b4b4b4)]">
        {" "}
        {cv.header.descriptionTrail}
      </span>
    </>
  );

  const detailModal = cv.detailModal;

  return (
    <CreateFlowTwoColumnSelectShell
      lgVerticalAlign="start"
      header={
        <CreateFlowHeaderLockup
          title={cv.header.title}
          description={description}
          justification="left"
        />
      }
    >
      <MultiSelect
        formHeader={false}
        size="m"
        options={coreValueOptions}
        onChipClick={handleChipClick}
        onAddClick={addHandlers.onAddClick}
        onCustomChipConfirm={addHandlers.onCustomChipConfirm}
        onCustomChipClose={addHandlers.onCustomChipClose}
        addButton
        addButtonText={cv.multiSelect.addButtonText}
      />

      {detailModal && (
        <Create
          isOpen={activeModalChipId !== null}
          onClose={handleModalDismiss}
          backdropVariant="blurredYellow"
          headerContent={
            <div className="bg-[var(--color-surface-default-primary)] px-[24px] py-[12px] shrink-0">
              <ContentLockup
                title={modalChipLabel}
                description={detailModal.subtitle}
                variant="modal"
                alignment="left"
              />
            </div>
          }
          showBackButton={false}
          showNextButton
          onNext={handleModalConfirm}
          nextButtonText={detailModal.addValueButton}
          ariaLabel={modalChipLabel || "Core value details"}
        >
          <CoreValueEditFields value={draft} onChange={handleDraftChange} />
        </Create>
      )}
    </CreateFlowTwoColumnSelectShell>
  );
}
