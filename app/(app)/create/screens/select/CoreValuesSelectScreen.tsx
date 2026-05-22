"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import MultiSelect from "../../../../components/controls/MultiSelect";
import type { ChipOption } from "../../../../components/controls/MultiSelect/MultiSelect.types";
import Create from "../../../../components/modals/Create";
import ContentLockup from "../../../../components/type/ContentLockup";
import { useMessages } from "../../../../contexts/MessagesContext";
import { buildCoreValueChipOptionsFromDraft } from "../../../../../lib/create/coreValueChipOptionsFromDraft";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useDiscardCustomizeConfirm } from "../../hooks/useDiscardCustomizeConfirm";
import type {
  CommunityStructureChipSnapshotRow,
  CoreValueDetailEntry,
} from "../../types";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";
import { CoreValueEditFields } from "../../components/methodEditFields";
import MethodCardCustomizeModalHeader from "../../components/MethodCardCustomizeModalHeader";
import { buildCustomRuleModalKebabMenu } from "../../components/customRuleModalKebabMenu";
import {
  captureMethodCardCustomizeSnapshot,
  isMethodCardCustomizeSessionDirty,
  type MethodCardCustomizeSnapshot,
  type MethodCardHeaderDraft,
} from "../../../../../lib/create/methodCardCustomizeSession";
import {
  duplicateCoreValueChipInDraft,
  MAX_SELECTED_CORE_VALUES,
  removeCoreValueChipFromDraft,
} from "../../../../../lib/create/coreValueChipFacet";
import { omitIdFromStringRecord } from "../../../../../lib/create/duplicateMethodCardModalDraft";

const MAX_CORE_VALUES = MAX_SELECTED_CORE_VALUES;

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

const EMPTY_DETAIL: CoreValueDetailEntry = { meaning: "", signals: "" };

/** Create Custom — Core Values (Figma `20264:68378`). Up to five selections; preset list + custom chips. */
export function CoreValuesSelectScreen() {
  const m = useMessages();
  const cv = m.create.customRule.coreValues;
  const modalKebabMenu = m.create.customRule.modalKebabMenu;
  const presets = useMemo(
    () => normalizeCoreValuePresets(cv.values as CoreValuePresetJson[]),
    [cv.values],
  );

  const { confirmDiscard, confirmDirtyCustomizeCancel, confirmDialog } =
    useDiscardCustomizeConfirm();
  const { markCreateFlowInteraction, updateState, replaceState, state } =
    useCreateFlow();

  const coreCustomizeSnapshotRef =
    useRef<MethodCardCustomizeSnapshot<CoreValueDetailEntry> | null>(null);
  const pendingEphemeralCoreDuplicateRef = useRef<string | null>(null);

  const [coreValueOptions, setCoreValueOptions] = useState<ChipOption[]>(() =>
    buildCoreValueChipOptionsFromDraft(
      presets,
      state.coreValuesChipsSnapshot,
      state.selectedCoreValueIds,
    ),
  );

  const [activeModalChipId, setActiveModalChipId] = useState<string | null>(
    null,
  );
  const [modalSession, setModalSession] = useState<ModalSession | null>(null);
  const [draft, setDraft] = useState<CoreValueDetailEntry>(EMPTY_DETAIL);
  const [modalEditUnlocked, setModalEditUnlocked] = useState(false);
  const [customizeHeaderDraft, setCustomizeHeaderDraft] =
    useState<MethodCardHeaderDraft | null>(null);

  useEffect(() => {
    setCoreValueOptions(
      buildCoreValueChipOptionsFromDraft(
        presets,
        state.coreValuesChipsSnapshot,
        state.selectedCoreValueIds,
      ),
    );
  }, [
    presets,
    state.coreValuesChipsSnapshot,
    state.selectedCoreValueIds,
  ]);

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
    (
      chipId: string,
      session: ModalSession,
      valueLabel: string,
      seedDetail?: CoreValueDetailEntry,
    ) => {
      setDraft(seedDetail ?? getInitialTexts(chipId, valueLabel));
      setActiveModalChipId(chipId);
      setModalSession(session);
      setModalEditUnlocked(false);
      setCustomizeHeaderDraft(null);
      coreCustomizeSnapshotRef.current = null;
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

  const resetCustomizeSession = useCallback(() => {
    coreCustomizeSnapshotRef.current = null;
    setModalEditUnlocked(false);
    setCustomizeHeaderDraft(null);
  }, []);

  const finalizeModalDismiss = useCallback(() => {
    pendingEphemeralCoreDuplicateRef.current = null;
    resetCustomizeSession();
    setActiveModalChipId(null);
    setModalSession(null);
  }, [resetCustomizeSession]);

  const handleCustomize = useCallback(() => {
    if (!activeModalChipId) return;
    const chipLabelNow =
      coreValueOptions.find((o) => o.id === activeModalChipId)?.label ?? "";
    if (!chipLabelNow) return;
    markCreateFlowInteraction();
    const headerDraft: MethodCardHeaderDraft = {
      title: chipLabelNow,
      description: "",
    };
    coreCustomizeSnapshotRef.current = captureMethodCardCustomizeSnapshot(
      draft,
      null,
      headerDraft,
    );
    setCustomizeHeaderDraft(headerDraft);
    setModalEditUnlocked(true);
  }, [activeModalChipId, coreValueOptions, draft, markCreateFlowInteraction]);

  const handleCancelCustomize = useCallback(async () => {
    if (!modalEditUnlocked) return;
    const snap = coreCustomizeSnapshotRef.current;
    if (!snap) {
      resetCustomizeSession();
      return;
    }
    if (
      !(await confirmDirtyCustomizeCancel(
        snap,
        draft,
        null,
        customizeHeaderDraft,
      ))
    ) {
      return;
    }
    setDraft(structuredClone(snap.pendingDraft));
    resetCustomizeSession();
  }, [
    confirmDirtyCustomizeCancel,
    customizeHeaderDraft,
    draft,
    modalEditUnlocked,
    resetCustomizeSession,
  ]);

  const syncLabelFromCustomizeHeaderToOptions = useCallback(() => {
    if (!activeModalChipId || !customizeHeaderDraft) return coreValueOptions;
    const trimmed = customizeHeaderDraft.title.trim();
    if (!trimmed) return coreValueOptions;
    return coreValueOptions.map((opt) =>
      opt.id === activeModalChipId ? { ...opt, label: trimmed } : opt,
    );
  }, [activeModalChipId, customizeHeaderDraft, coreValueOptions]);

  const handleDuplicateCoreChip = useCallback(async () => {
    if (!activeModalChipId || !modalSession) return;
    if (
      !(await confirmDiscard(
        modalEditUnlocked,
        coreCustomizeSnapshotRef.current,
        draft,
        null,
        customizeHeaderDraft,
      ))
    ) {
      return;
    }
    markCreateFlowInteraction();
    const priorEphemeral = pendingEphemeralCoreDuplicateRef.current;
    let outcome: ReturnType<typeof duplicateCoreValueChipInDraft> | null = null;
    replaceState((prev) => {
      const base =
        priorEphemeral != null
          ? { ...prev, ...removeCoreValueChipFromDraft(prev, priorEphemeral) }
          : prev;
      const res = duplicateCoreValueChipInDraft(
        base,
        activeModalChipId,
        modalKebabMenu.duplicateTitleSuffix,
      );
      if (!res) {
        return base;
      }
      outcome = res;
      return { ...base, ...res.patch };
    });
    if (!outcome) {
      return;
    }
    resetCustomizeSession();
    pendingEphemeralCoreDuplicateRef.current = outcome.newId;
    openModal(
      outcome.newId,
      "editing",
      outcome.newLabel,
      structuredClone(draft),
    );
  }, [
    activeModalChipId,
    confirmDiscard,
    customizeHeaderDraft,
    draft,
    markCreateFlowInteraction,
    modalEditUnlocked,
    modalKebabMenu.duplicateTitleSuffix,
    modalSession,
    openModal,
    replaceState,
    resetCustomizeSession,
  ]);

  const handleRemoveFromKebab = useCallback(async () => {
    if (
      !(await confirmDiscard(
        modalEditUnlocked,
        coreCustomizeSnapshotRef.current,
        draft,
        null,
        customizeHeaderDraft,
      ))
    ) {
      return;
    }
    markCreateFlowInteraction();

    const ep = pendingEphemeralCoreDuplicateRef.current;
    if (ep && activeModalChipId === ep) {
      replaceState((prev) => ({
        ...prev,
        ...removeCoreValueChipFromDraft(prev, ep),
      }));
      finalizeModalDismiss();
      return;
    }

    if (modalSession === "pending") {
      const next = coreValueOptions.map((opt) =>
        opt.id === activeModalChipId
          ? { ...opt, state: "unselected" as const }
          : opt,
      );
      persistCoreValues(next);
    } else if (modalSession === "customPending") {
      const next = coreValueOptions.filter((opt) => opt.id !== activeModalChipId);
      persistCoreValues(next);
    } else if (modalSession === "editing" && activeModalChipId) {
      const nextFiltered = coreValueOptions.filter(
        (opt) => opt.id !== activeModalChipId,
      );
      markCreateFlowInteraction();
      replaceState((prev) => ({
        ...prev,
        selectedCoreValueIds: selectedIdsFromOptions(nextFiltered),
        coreValuesChipsSnapshot:
          chipOptionsToSnapshotRows(nextFiltered),
        coreValueDetailsByChipId:
          omitIdFromStringRecord(prev.coreValueDetailsByChipId, activeModalChipId),
      }));
      setCoreValueOptions(nextFiltered);
    }
    finalizeModalDismiss();
  }, [
    activeModalChipId,
    confirmDiscard,
    coreValueOptions,
    customizeHeaderDraft,
    draft,
    finalizeModalDismiss,
    markCreateFlowInteraction,
    modalEditUnlocked,
    modalSession,
    persistCoreValues,
    replaceState,
  ]);

  const handleModalDismiss = useCallback(async () => {
    if (
      !(await confirmDiscard(
        modalEditUnlocked,
        coreCustomizeSnapshotRef.current,
        draft,
        null,
        customizeHeaderDraft,
      ))
    ) {
      return;
    }

    const ep = pendingEphemeralCoreDuplicateRef.current;
    if (ep) {
      replaceState((prev) => ({
        ...prev,
        ...removeCoreValueChipFromDraft(prev, ep),
      }));
    }

    if (modalSession === "pending" && activeModalChipId) {
      const next = coreValueOptions.map((opt) =>
        opt.id === activeModalChipId
          ? { ...opt, state: "unselected" as const }
          : opt,
      );
      persistCoreValues(next);
    } else if (modalSession === "customPending" && activeModalChipId) {
      const next = coreValueOptions.filter(
        (opt) => opt.id !== activeModalChipId,
      );
      persistCoreValues(next);
    }

    finalizeModalDismiss();
  }, [
    activeModalChipId,
    confirmDiscard,
    coreValueOptions,
    customizeHeaderDraft,
    draft,
    finalizeModalDismiss,
    modalEditUnlocked,
    modalSession,
    persistCoreValues,
    replaceState,
  ]);

  const coreCustomizeSaveDisabled = useMemo(() => {
    if (!modalEditUnlocked) return false;
    const snap = coreCustomizeSnapshotRef.current;
    if (!snap) return true;
    return !isMethodCardCustomizeSessionDirty(
      snap,
      draft,
      null,
      customizeHeaderDraft,
    );
  }, [customizeHeaderDraft, draft, modalEditUnlocked]);

  const handleModalConfirm = useCallback(() => {
    if (!activeModalChipId || !modalSession) return;

    if (modalEditUnlocked && customizeHeaderDraft) {
      if (coreCustomizeSaveDisabled) {
        return;
      }
      markCreateFlowInteraction();
      pendingEphemeralCoreDuplicateRef.current = null;
      const nextOpts = syncLabelFromCustomizeHeaderToOptions();
      persistCoreValues(nextOpts);
      updateState({
        coreValueDetailsByChipId: {
          ...(state.coreValueDetailsByChipId ?? {}),
          [activeModalChipId]: draft,
        },
      });
      resetCustomizeSession();
      return;
    }

    if (modalSession === "pending" || modalSession === "customPending") {
      markCreateFlowInteraction();
      pendingEphemeralCoreDuplicateRef.current = null;
      updateState({
        coreValueDetailsByChipId: {
          ...(state.coreValueDetailsByChipId ?? {}),
          [activeModalChipId]: draft,
        },
      });
      resetCustomizeSession();
      setActiveModalChipId(null);
      setModalSession(null);
    }
  }, [
    activeModalChipId,
    coreCustomizeSaveDisabled,
    customizeHeaderDraft,
    draft,
    markCreateFlowInteraction,
    modalEditUnlocked,
    modalSession,
    persistCoreValues,
    resetCustomizeSession,
    state.coreValueDetailsByChipId,
    syncLabelFromCustomizeHeaderToOptions,
    updateState,
  ]);

  const modalChipLabel =
    coreValueOptions.find((o) => o.id === activeModalChipId)?.label ?? "";

  const modalFieldsLocked =
    !modalEditUnlocked &&
    Boolean(
      modalSession === "pending" ||
        modalSession === "customPending" ||
        modalSession === "editing",
    );

  const showFooterPrimary =
    modalEditUnlocked ||
    modalSession === "pending" ||
    modalSession === "customPending";

  const kebabMenuItems = useMemo(() => {
    if (!modalSession || !activeModalChipId) return [];
    const selectedCount = coreValueOptions.filter(
      (o) => o.state === "selected",
    ).length;
    return buildCustomRuleModalKebabMenu(modalKebabMenu, {
      showCustomize: !modalEditUnlocked,
      onCustomize: handleCustomize,
      onDuplicate:
        modalSession !== "editing" || selectedCount >= MAX_CORE_VALUES
          ? undefined
          : handleDuplicateCoreChip,
      showRemove: true,
      onRemove: handleRemoveFromKebab,
    });
  }, [
    activeModalChipId,
    coreValueOptions,
    handleCustomize,
    handleDuplicateCoreChip,
    handleRemoveFromKebab,
    modalEditUnlocked,
    modalKebabMenu,
    modalSession,
  ]);
  const handleChipClick = (chipId: string) => {
    const target = coreValueOptions.find((o) => o.id === chipId);
    if (!target || target.state === "custom") return;

    const selectedCount = coreValueOptions.filter(
      (o) => o.state === "selected",
    ).length;

    if (target.state === "selected") {
      openModal(chipId, "editing", target.label);
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
    <>
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
            modalEditUnlocked && customizeHeaderDraft ? (
              <MethodCardCustomizeModalHeader
                titleLabel={detailModal.customizeValueNameLabel}
                descriptionLabel=""
                titleValue={customizeHeaderDraft.title}
                descriptionValue=""
                onTitleChange={(title) =>
                  setCustomizeHeaderDraft((prev) =>
                    prev ? { ...prev, title } : null,
                  )
                }
                onDescriptionChange={() => {}}
                showDescription={false}
              />
            ) : (
              <div className="bg-[var(--color-surface-default-primary)] px-[24px] py-[12px] shrink-0">
                <ContentLockup
                  title={modalChipLabel}
                  description={detailModal.subtitle}
                  variant="modal"
                  alignment="left"
                />
              </div>
            )
          }
          showBackButton={modalEditUnlocked}
          onBack={handleCancelCustomize}
          backButtonText={modalKebabMenu.cancelCustomize}
          showNextButton={showFooterPrimary}
          nextButtonDisabled={
            modalEditUnlocked && coreCustomizeSaveDisabled
          }
          onNext={handleModalConfirm}
          nextButtonText={
            modalEditUnlocked ? modalKebabMenu.saveEdits : detailModal.addValueButton
          }
          kebabTriggerAriaLabel={modalKebabMenu.triggerAriaLabel}
          kebabMenuAriaLabel={modalKebabMenu.menuAriaLabel}
          kebabMenuItems={
            kebabMenuItems.length > 0 ? kebabMenuItems : undefined
          }
          ariaLabel={modalChipLabel || "Core value details"}
        >
          <CoreValueEditFields
            readOnly={modalFieldsLocked}
            value={draft}
            onChange={handleDraftChange}
          />
        </Create>
      )}
    </CreateFlowTwoColumnSelectShell>
    {confirmDialog}
    </>
  );
}
