"use client";

/**
 * Final-review chip modal: **Core values** and **method** facets share the
 * kebab → **Customize** / **Duplicate** (values only when under the cap) /
 * **Remove** pattern from the create-card facet modals (`Create` +
 * {@link buildCustomRuleModalKebabMenu}). Core values use a single Customize
 * header field for the value name; method chips use the full policy title +
 * description pair.
 *
 * Template-only chips without an `overrideKey` never mount this component; they
 * use {@link TemplateChipDetailModal} from the parent.
 *
 * @see CommunicationMethodsScreen — mental model for method modals.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Create from "../../../components/modals/Create";
import ContentLockup from "../../../components/type/ContentLockup";
import { useMessages, useTranslation } from "../../../contexts/MessagesContext";
import {
  CommunicationMethodEditFields,
  ConflictManagementEditFields,
  CoreValueEditFields,
  DecisionApproachEditFields,
  MembershipMethodEditFields,
} from "./methodEditFields";
import CustomMethodCardModalBody from "./CustomMethodCardModalBody";
import MethodCardCustomizeModalHeader from "./MethodCardCustomizeModalHeader";
import { buildCustomRuleModalKebabMenu } from "./customRuleModalKebabMenu";
import {
  communicationPresetFor,
  conflictManagementPresetFor,
  coreValuePresetFor,
  decisionApproachPresetFor,
  membershipPresetFor,
} from "../../../../lib/create/finalReviewChipPresets";
import { isCustomMethodCardId } from "../../../../lib/create/isCustomMethodCardId";
import type { CustomMethodCardFieldBlock } from "../../../../lib/create/customMethodCardFieldBlocks";
import {
  CUSTOM_RULE_FACET_BY_GROUP,
  type TemplateFacetGroupKey,
} from "../../../../lib/create/customRuleFacets";
import type { MethodFacetGroupKey } from "../../../../lib/create/removeMethodCardFromFacetSelection";
import { removeMethodCardFromFacetSelection } from "../../../../lib/create/removeMethodCardFromFacetSelection";
import { mergePresetMethodsWithCustom } from "../../../../lib/create/mergePresetMethodsWithCustom";
import { moveFacetSelectionIdToFront } from "../../../../lib/create/methodCardSelectionOrder";
import { usesWizardFieldBlocksModalBody } from "../../../../lib/create/usesWizardFieldBlocksModalBody";
import {
  duplicateCoreValueChipInDraft,
  removeCoreValueChipFromDraft,
} from "../../../../lib/create/coreValueChipFacet";
import {
  captureMethodCardCustomizeSnapshot,
  confirmDiscardMethodCardCustomizeSession,
  isMethodCardCustomizeSessionDirty,
  type MethodCardCustomizeSnapshot,
  type MethodCardHeaderDraft,
} from "../../../../lib/create/methodCardCustomizeSession";
import type {
  CommunicationMethodDetailEntry,
  ConflictManagementDetailEntry,
  CoreValueDetailEntry,
  CreateFlowState,
  DecisionApproachDetailEntry,
  MembershipMethodDetailEntry,
} from "../types";

export type FinalReviewChipEditTarget = {
  /** Stable key for override lookup: preset id (methods) or chip id (core values). */
  overrideKey: string;
  /** Category group that decides which field set to render. */
  groupKey: TemplateFacetGroupKey;
  /** Display label shown at the top of the modal (localized chip label). */
  chipLabel: string;
};

export type FinalReviewChipEditPatch =
  | {
      groupKey: "coreValues";
      overrideKey: string;
      value: CoreValueDetailEntry;
      /** When set, updates the display label for this chip id in `coreValuesChipsSnapshot`. */
      chipLabel?: string;
    }
  | {
      groupKey: "communication";
      overrideKey: string;
      value: CommunicationMethodDetailEntry;
      customMethodCardFieldBlocks?: CustomMethodCardFieldBlock[];
      methodCardMeta?: { label: string; supportText: string };
    }
  | {
      groupKey: "membership";
      overrideKey: string;
      value: MembershipMethodDetailEntry;
      customMethodCardFieldBlocks?: CustomMethodCardFieldBlock[];
      methodCardMeta?: { label: string; supportText: string };
    }
  | {
      groupKey: "decisionApproaches";
      overrideKey: string;
      value: DecisionApproachDetailEntry;
      customMethodCardFieldBlocks?: CustomMethodCardFieldBlock[];
      methodCardMeta?: { label: string; supportText: string };
    }
  | {
      groupKey: "conflictManagement";
      overrideKey: string;
      value: ConflictManagementDetailEntry;
      customMethodCardFieldBlocks?: CustomMethodCardFieldBlock[];
      methodCardMeta?: { label: string; supportText: string };
    };

export interface FinalReviewChipEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: FinalReviewChipEditTarget | null;
  state: CreateFlowState;
  onSave: (_patch: FinalReviewChipEditPatch) => void;
  replaceState: (_updater: (prev: CreateFlowState) => CreateFlowState) => void;
  onInteract?: () => void;
  /** After core-value **Duplicate**, re-point the open modal at the new chip id. */
  onEditTargetChange?: (_next: FinalReviewChipEditTarget) => void;
}

type Draft =
  | { groupKey: "coreValues"; value: CoreValueDetailEntry }
  | { groupKey: "communication"; value: CommunicationMethodDetailEntry }
  | { groupKey: "membership"; value: MembershipMethodDetailEntry }
  | { groupKey: "decisionApproaches"; value: DecisionApproachDetailEntry }
  | { groupKey: "conflictManagement"; value: ConflictManagementDetailEntry };

type MethodDetailDraft =
  | CommunicationMethodDetailEntry
  | MembershipMethodDetailEntry
  | DecisionApproachDetailEntry
  | ConflictManagementDetailEntry;

function methodDetailDraftForCustomizeSession(
  draft: Draft | null,
): MethodDetailDraft | null {
  if (!draft || draft.groupKey === "coreValues") return null;
  return draft.value;
}

function isMethodFacetGroup(
  k: TemplateFacetGroupKey,
): k is MethodFacetGroupKey {
  return k !== "coreValues";
}

export function FinalReviewChipEditModal({
  isOpen,
  onClose,
  target,
  state,
  onSave,
  replaceState,
  onInteract,
  onEditTargetChange,
}: FinalReviewChipEditModalProps) {
  const m = useMessages();
  const cr = m.create.customRule;
  const tCv = cr.coreValues;
  const tComm = cr.communication;
  const tMem = cr.membership;
  const tDa = cr.decisionApproaches;
  const tCm = cr.conflictManagement;
  const modalKebabMenu = cr.modalKebabMenu;
  const tModal = useTranslation(
    "create.reviewAndComplete.finalReview.chipEditModal",
  );

  const [draft, setDraft] = useState<Draft | null>(null);
  const [modalEditUnlocked, setModalEditUnlocked] = useState(false);
  const [draftFieldBlocks, setDraftFieldBlocks] = useState<
    CustomMethodCardFieldBlock[] | null
  >(null);
  const [customizeHeaderDraft, setCustomizeHeaderDraft] =
    useState<MethodCardHeaderDraft | null>(null);

  const initialSnapshotRef = useRef("");
  const seededTargetRef = useRef<string | null>(null);
  const customizeSnapshotRef = useRef<
    | MethodCardCustomizeSnapshot<
        | CommunicationMethodDetailEntry
        | MembershipMethodDetailEntry
        | DecisionApproachDetailEntry
        | ConflictManagementDetailEntry
      >
    | null
  >(null);
  const coreCustomizeSnapshotRef =
    useRef<MethodCardCustomizeSnapshot<CoreValueDetailEntry> | null>(null);
  const pendingEphemeralCoreDuplicateRef = useRef<string | null>(null);
  const methodById = useMemo(() => {
    if (!target || !isMethodFacetGroup(target.groupKey)) {
      return new Map<string, { id: string; label: string; supportText: string }>();
    }
    const facet = CUSTOM_RULE_FACET_BY_GROUP.get(target.groupKey)!;
    const selectedIds = facet.selectionIds(state);
    switch (target.groupKey) {
      case "communication":
        return new Map(
          mergePresetMethodsWithCustom(
            tComm.methods,
            selectedIds,
            state.customMethodCardMetaById,
          ).map((row) => [row.id, row]),
        );
      case "membership":
        return new Map(
          mergePresetMethodsWithCustom(
            tMem.methods,
            selectedIds,
            state.customMethodCardMetaById,
          ).map((row) => [row.id, row]),
        );
      case "decisionApproaches":
        return new Map(
          mergePresetMethodsWithCustom(
            tDa.methods,
            selectedIds,
            state.customMethodCardMetaById,
          ).map((row) => [row.id, row]),
        );
      case "conflictManagement":
        return new Map(
          mergePresetMethodsWithCustom(
            tCm.methods,
            selectedIds,
            state.customMethodCardMetaById,
          ).map((row) => [row.id, row]),
        );
    }
  }, [
    target,
    state.customMethodCardMetaById,
    state.selectedCommunicationMethodIds,
    state.selectedMembershipMethodIds,
    state.selectedDecisionApproachIds,
    state.selectedConflictManagementIds,
    tComm.methods,
    tMem.methods,
    tDa.methods,
    tCm.methods,
  ]);

  const selectionIdsForTarget = useMemo(() => {
    if (!target || !isMethodFacetGroup(target.groupKey)) return [];
    return [...CUSTOM_RULE_FACET_BY_GROUP.get(target.groupKey)!.selectionIds(state)];
  }, [
    target,
    state.selectedCommunicationMethodIds,
    state.selectedMembershipMethodIds,
    state.selectedDecisionApproachIds,
    state.selectedConflictManagementIds,
  ]);

  const isChipInSelection =
    target && isMethodFacetGroup(target.groupKey)
      ? selectionIdsForTarget.includes(target.overrideKey)
      : false;

  const fieldsLocked =
    target !== null &&
    (target.groupKey === "coreValues" || isMethodFacetGroup(target.groupKey)) &&
    !modalEditUnlocked;

  const showMethodModalPrimary = !isChipInSelection || modalEditUnlocked;
  const showCoreModalPrimary = modalEditUnlocked;

  useEffect(() => {
    if (!isOpen || !target) return;
    if (modalEditUnlocked) {
      return;
    }
    const sig = facetSeedSignature(target, state);
    const targetKey = `${target.groupKey}:${target.overrideKey}:${sig}`;
    if (seededTargetRef.current === targetKey) {
      return;
    }

    const seed = seedDraftForTarget(target, state);
    setDraft(seed);
    initialSnapshotRef.current = JSON.stringify(seed.value);
    if (target.groupKey === "coreValues") {
      setModalEditUnlocked(false);
      setCustomizeHeaderDraft(null);
      coreCustomizeSnapshotRef.current = null;
    }
    if (isMethodFacetGroup(target.groupKey)) {
      setModalEditUnlocked(false);
      setDraftFieldBlocks(null);
      setCustomizeHeaderDraft(null);
      customizeSnapshotRef.current = null;
    }
    seededTargetRef.current = targetKey;
  }, [isOpen, target, state, modalEditUnlocked]);

  useEffect(() => {
    if (!isOpen) seededTargetRef.current = null;
  }, [isOpen]);

  const coreCustomizeSaveDisabled = useMemo(() => {
    if (!modalEditUnlocked) return false;
    const snap = coreCustomizeSnapshotRef.current;
    if (!snap || !draft || draft.groupKey !== "coreValues") return true;
    return !isMethodCardCustomizeSessionDirty(
      snap,
      draft.value,
      null,
      customizeHeaderDraft,
    );
  }, [customizeHeaderDraft, draft, modalEditUnlocked]);

  const methodCustomizeSaveDisabled = useMemo(() => {
    if (!modalEditUnlocked) return false;
    const snap = customizeSnapshotRef.current;
    if (!snap) return true;
    return !isMethodCardCustomizeSessionDirty(
      snap,
      methodDetailDraftForCustomizeSession(draft),
      draftFieldBlocks,
      customizeHeaderDraft,
    );
  }, [
    customizeHeaderDraft,
    draft,
    draftFieldBlocks,
    modalEditUnlocked,
  ]);

  const finalizeModalClose = useCallback(() => {
    customizeSnapshotRef.current = null;
    coreCustomizeSnapshotRef.current = null;
    pendingEphemeralCoreDuplicateRef.current = null;
    setModalEditUnlocked(false);
    setDraftFieldBlocks(null);
    setCustomizeHeaderDraft(null);
    onClose();
  }, [onClose]);

  const handleModalClose = useCallback(() => {
    if (
      target &&
      target.groupKey === "coreValues" &&
      !confirmDiscardMethodCardCustomizeSession(
        modalEditUnlocked,
        coreCustomizeSnapshotRef.current,
        draft?.groupKey === "coreValues" ? draft.value : null,
        null,
        customizeHeaderDraft,
        modalKebabMenu.discardUnsavedCustomizeChanges,
      )
    ) {
      return;
    }
    if (
      target &&
      isMethodFacetGroup(target.groupKey) &&
      !confirmDiscardMethodCardCustomizeSession(
        modalEditUnlocked,
        customizeSnapshotRef.current,
        methodDetailDraftForCustomizeSession(draft),
        draftFieldBlocks,
        customizeHeaderDraft,
        modalKebabMenu.discardUnsavedCustomizeChanges,
      )
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
    finalizeModalClose();
  }, [
    customizeHeaderDraft,
    draft,
    draftFieldBlocks,
    finalizeModalClose,
    modalEditUnlocked,
    modalKebabMenu.discardUnsavedCustomizeChanges,
    replaceState,
    target,
  ]);

  const handleCancelCustomize = useCallback(() => {
    if (!modalEditUnlocked || !target) {
      return;
    }
    if (target.groupKey === "coreValues") {
      const snap = coreCustomizeSnapshotRef.current;
      if (!snap) {
        coreCustomizeSnapshotRef.current = null;
        setModalEditUnlocked(false);
        setCustomizeHeaderDraft(null);
        return;
      }
      if (
        draft?.groupKey === "coreValues" &&
        isMethodCardCustomizeSessionDirty(
          snap,
          draft.value,
          null,
          customizeHeaderDraft,
        ) &&
        !window.confirm(modalKebabMenu.discardUnsavedCustomizeChanges)
      ) {
        return;
      }
      setDraft({
        groupKey: "coreValues",
        value: structuredClone(snap.pendingDraft),
      });
      coreCustomizeSnapshotRef.current = null;
      setModalEditUnlocked(false);
      setCustomizeHeaderDraft(null);
      return;
    }
    if (!isMethodFacetGroup(target.groupKey)) {
      return;
    }
    const snap = customizeSnapshotRef.current;
    if (!snap) {
      customizeSnapshotRef.current = null;
      setModalEditUnlocked(false);
      setDraftFieldBlocks(null);
      setCustomizeHeaderDraft(null);
      return;
    }
    if (
      isMethodCardCustomizeSessionDirty(
        snap,
        methodDetailDraftForCustomizeSession(draft),
        draftFieldBlocks,
        customizeHeaderDraft,
      ) &&
      !window.confirm(modalKebabMenu.discardUnsavedCustomizeChanges)
    ) {
      return;
    }
    setPendingDraftFromSnapshot(snap);
    setDraftFieldBlocks(null);
    setModalEditUnlocked(false);
    customizeSnapshotRef.current = null;
    setCustomizeHeaderDraft(null);
  }, [
    customizeHeaderDraft,
    draft,
    draftFieldBlocks,
    modalEditUnlocked,
    modalKebabMenu.discardUnsavedCustomizeChanges,
    target,
  ]);

  function setPendingDraftFromSnapshot(
    snap: MethodCardCustomizeSnapshot<
      | CommunicationMethodDetailEntry
      | MembershipMethodDetailEntry
      | DecisionApproachDetailEntry
      | ConflictManagementDetailEntry
    >,
  ) {
    const v = structuredClone(snap.pendingDraft);
    if (!target || !isMethodFacetGroup(target.groupKey)) return;
    switch (target.groupKey) {
      case "communication":
        setDraft({ groupKey: "communication", value: v as CommunicationMethodDetailEntry });
        break;
      case "membership":
        setDraft({ groupKey: "membership", value: v as MembershipMethodDetailEntry });
        break;
      case "decisionApproaches":
        setDraft({
          groupKey: "decisionApproaches",
          value: v as DecisionApproachDetailEntry,
        });
        break;
      case "conflictManagement":
        setDraft({
          groupKey: "conflictManagement",
          value: v as ConflictManagementDetailEntry,
        });
        break;
      default: {
        const _e: never = target.groupKey;
        void _e;
      }
    }
  }

  const handleCustomize = useCallback(() => {
    onInteract?.();
    if (target?.groupKey === "coreValues") {
      if (!draft || draft.groupKey !== "coreValues") return;
      const headerDraft: MethodCardHeaderDraft = {
        title: target.chipLabel,
        description: "",
      };
      coreCustomizeSnapshotRef.current = captureMethodCardCustomizeSnapshot(
        draft.value,
        null,
        headerDraft,
      );
      setCustomizeHeaderDraft(headerDraft);
      setModalEditUnlocked(true);
      return;
    }
    const pending = pendingDraftForCustomize(draft, target);
    if (!pending) return;
    const { groupKey, pendingValue } = pending;
    const pendingCardId = target!.overrideKey;
    const initialFieldBlocks = isCustomMethodCardId(
      pendingCardId,
      state.customMethodCardMetaById,
    )
      ? structuredClone(
          state.customMethodCardFieldBlocksById?.[pendingCardId] ?? [],
        )
      : null;
    const method = methodById.get(pendingCardId);
    const meta = state.customMethodCardMetaById?.[pendingCardId];
    const confirm = confirmCopyForMethodGroup(groupKey, {
      tComm,
      tMem,
      tDa,
      tCm,
    });

    const headerDraft: MethodCardHeaderDraft = {
      title:
        meta?.label ??
        method?.label ??
        target!.chipLabel ??
        confirm.title,
      description:
        meta?.supportText ??
        method?.supportText ??
        confirm.description,
    };
    setCustomizeHeaderDraft(headerDraft);
    customizeSnapshotRef.current = captureMethodCardCustomizeSnapshot(
      pendingValue,
      initialFieldBlocks,
      headerDraft,
    );
    setDraftFieldBlocks(initialFieldBlocks);
    setModalEditUnlocked(true);
  }, [
    draft,
    methodById,
    onInteract,
    state.customMethodCardFieldBlocksById,
    state.customMethodCardMetaById,
    target,
    tComm,
    tMem,
    tDa,
    tCm,
  ]);

  const handleRemoveSelectedFromModal = useCallback(() => {
    if (!target || !isMethodFacetGroup(target.groupKey)) {
      return;
    }
    const methodGroupKey = target.groupKey;
    if (!selectionIdsForTarget.includes(target.overrideKey)) {
      return;
    }
    onInteract?.();
    if (
      !confirmDiscardMethodCardCustomizeSession(
        modalEditUnlocked,
        customizeSnapshotRef.current,
        methodDetailDraftForCustomizeSession(draft),
        draftFieldBlocks,
        customizeHeaderDraft,
        modalKebabMenu.discardUnsavedCustomizeChanges,
      )
    ) {
      return;
    }
    customizeSnapshotRef.current = null;
    replaceState((prev) => ({
      ...prev,
      ...removeMethodCardFromFacetSelection(
        prev,
        methodGroupKey,
        target.overrideKey,
      ),
    }));
    finalizeModalClose();
  }, [
    customizeHeaderDraft,
    draft,
    draftFieldBlocks,
    finalizeModalClose,
    modalEditUnlocked,
    modalKebabMenu.discardUnsavedCustomizeChanges,
    onInteract,
    replaceState,
    selectionIdsForTarget,
    target,
  ]);

  const handleRemoveCoreValueFromModal = useCallback(() => {
    if (!target || target.groupKey !== "coreValues") {
      return;
    }
    onInteract?.();
    if (
      !confirmDiscardMethodCardCustomizeSession(
        modalEditUnlocked,
        coreCustomizeSnapshotRef.current,
        draft?.groupKey === "coreValues" ? draft.value : null,
        null,
        customizeHeaderDraft,
        modalKebabMenu.discardUnsavedCustomizeChanges,
      )
    ) {
      return;
    }
    coreCustomizeSnapshotRef.current = null;
    customizeSnapshotRef.current = null;
    replaceState((prev) => ({
      ...prev,
      ...removeCoreValueChipFromDraft(prev, target.overrideKey),
    }));
    finalizeModalClose();
  }, [
    customizeHeaderDraft,
    draft,
    finalizeModalClose,
    modalEditUnlocked,
    modalKebabMenu.discardUnsavedCustomizeChanges,
    onInteract,
    replaceState,
    target,
  ]);

  const handleDuplicateCoreValue = useCallback(() => {
    if (
      !target ||
      target.groupKey !== "coreValues" ||
      draft?.groupKey !== "coreValues"
    ) {
      return;
    }
    if ((state.editingPublishedRuleId?.trim() ?? "") !== "") {
      return;
    }
    if ((state.selectedCoreValueIds ?? []).length >= 5) {
      return;
    }
    if (
      !confirmDiscardMethodCardCustomizeSession(
        modalEditUnlocked,
        coreCustomizeSnapshotRef.current,
        draft.value,
        null,
        customizeHeaderDraft,
        modalKebabMenu.discardUnsavedCustomizeChanges,
      )
    ) {
      return;
    }
    onInteract?.();
    const priorEphemeral = pendingEphemeralCoreDuplicateRef.current;
    let outcome: ReturnType<
      typeof duplicateCoreValueChipInDraft
    > | null = null;
    replaceState((prev) => {
      const base =
        priorEphemeral != null
          ? { ...prev, ...removeCoreValueChipFromDraft(prev, priorEphemeral) }
          : prev;
      const res = duplicateCoreValueChipInDraft(
        base,
        target.overrideKey,
        modalKebabMenu.duplicateTitleSuffix,
      );
      if (!res) {
        return prev;
      }
      outcome = res;
      return { ...base, ...res.patch };
    });
    if (!outcome) {
      return;
    }
    customizeSnapshotRef.current = null;
    coreCustomizeSnapshotRef.current = null;
    setModalEditUnlocked(false);
    setDraftFieldBlocks(null);
    setCustomizeHeaderDraft(null);
    pendingEphemeralCoreDuplicateRef.current = outcome.newId;
    seededTargetRef.current = null;
    setDraft({
      groupKey: "coreValues",
      value: structuredClone(draft.value),
    });
    onEditTargetChange?.({
      overrideKey: outcome.newId,
      groupKey: "coreValues",
      chipLabel: outcome.newLabel,
    });
  }, [
    customizeHeaderDraft,
    draft,
    modalEditUnlocked,
    modalKebabMenu.discardUnsavedCustomizeChanges,
    modalKebabMenu.duplicateTitleSuffix,
    onEditTargetChange,
    onInteract,
    replaceState,
    state.editingPublishedRuleId,
    state.selectedCoreValueIds,
    target,
  ]);

  const kebabMenuItems = useMemo(() => {
    if (!target) return [];
    if (target.groupKey === "coreValues") {
      return buildCustomRuleModalKebabMenu(modalKebabMenu, {
        showCustomize: !modalEditUnlocked,
        onCustomize: handleCustomize,
        onDuplicate:
          (state.editingPublishedRuleId?.trim() ?? "") !== "" ||
          (state.selectedCoreValueIds ?? []).length >= 5
            ? undefined
            : handleDuplicateCoreValue,
        showRemove: true,
        onRemove: handleRemoveCoreValueFromModal,
      });
    }
    if (!isMethodFacetGroup(target.groupKey)) return [];
    return buildCustomRuleModalKebabMenu(modalKebabMenu, {
      showCustomize: !modalEditUnlocked,
      onCustomize: handleCustomize,
      showRemove: isChipInSelection,
      onRemove: handleRemoveSelectedFromModal,
    });
  }, [
    handleCustomize,
    handleDuplicateCoreValue,
    handleRemoveCoreValueFromModal,
    handleRemoveSelectedFromModal,
    isChipInSelection,
    modalEditUnlocked,
    modalKebabMenu,
    state.editingPublishedRuleId,
    state.selectedCoreValueIds,
    target,
  ]);

  const subtitle = useMemo(() => {
    if (!target) return "";
    return subtitleForTarget(
      target,
      { tCv, tComm, tMem, tDa, tCm },
      state.customMethodCardMetaById,
    );
  }, [target, tCv, tComm, tMem, tDa, tCm, state.customMethodCardMetaById]);

  const handleCoreSave = useCallback(() => {
    if (!target || !draft || draft.groupKey !== "coreValues") {
      return;
    }
    if (!modalEditUnlocked || !customizeHeaderDraft) {
      return;
    }
    if (coreCustomizeSaveDisabled) {
      return;
    }
    const labelTrim = customizeHeaderDraft.title.trim();
    onInteract?.();
    onSave({
      groupKey: "coreValues",
      overrideKey: target.overrideKey,
      value: structuredClone(draft.value),
      ...(labelTrim.length > 0 ? { chipLabel: labelTrim } : {}),
    });
    coreCustomizeSnapshotRef.current = null;
    setModalEditUnlocked(false);
    setCustomizeHeaderDraft(null);
    initialSnapshotRef.current = JSON.stringify(draft.value);
    pendingEphemeralCoreDuplicateRef.current = null;
    onEditTargetChange?.({
      overrideKey: target.overrideKey,
      groupKey: "coreValues",
      chipLabel: labelTrim.length > 0 ? labelTrim : target.chipLabel,
    });
  }, [
    coreCustomizeSaveDisabled,
    customizeHeaderDraft,
    draft,
    modalEditUnlocked,
    onEditTargetChange,
    onInteract,
    onSave,
    target,
  ]);

  const handleMethodPrimary = useCallback(() => {
    if (!target || !draft || !isMethodFacetGroup(target.groupKey)) return;
    const facet = CUSTOM_RULE_FACET_BY_GROUP.get(target.groupKey)!;
    const pendingId = target.overrideKey;
    const sel = [...facet.selectionIds(state)];

    if (!modalEditUnlocked) {
      if (!sel.includes(pendingId)) {
        onInteract?.();
        replaceState((prev) => ({
          ...prev,
          [facet.selectedIdsStateKey]: moveFacetSelectionIdToFront(
            [...facet.selectionIds(prev)],
            pendingId,
          ),
        }));
        onClose();
      }
      return;
    }

    if (!customizeHeaderDraft) return;
    if (!isMethodFacetGroup(draft.groupKey)) return;
    onInteract?.();
    const header = customizeHeaderDraft;
    const metaSave = {
      label: header.title,
      supportText: header.description,
    };
    const useWizard = usesWizardFieldBlocksModalBody({
      methodId: pendingId,
      meta: state.customMethodCardMetaById,
      fieldBlocksById: state.customMethodCardFieldBlocksById,
      modalEditUnlocked,
      draftFieldBlocks,
    });

    const blocksPayload = useWizard
      ? structuredClone(draftFieldBlocks ?? [])
      : undefined;

    switch (draft.groupKey) {
      case "communication":
        onSave({
          groupKey: "communication",
          overrideKey: pendingId,
          value: draft.value,
          methodCardMeta: metaSave,
          ...(blocksPayload !== undefined
            ? { customMethodCardFieldBlocks: blocksPayload }
            : {}),
        });
        break;
      case "membership":
        onSave({
          groupKey: "membership",
          overrideKey: pendingId,
          value: draft.value,
          methodCardMeta: metaSave,
          ...(blocksPayload !== undefined
            ? { customMethodCardFieldBlocks: blocksPayload }
            : {}),
        });
        break;
      case "decisionApproaches":
        onSave({
          groupKey: "decisionApproaches",
          overrideKey: pendingId,
          value: draft.value,
          methodCardMeta: metaSave,
          ...(blocksPayload !== undefined
            ? { customMethodCardFieldBlocks: blocksPayload }
            : {}),
        });
        break;
      case "conflictManagement":
        onSave({
          groupKey: "conflictManagement",
          overrideKey: pendingId,
          value: draft.value,
          methodCardMeta: metaSave,
          ...(blocksPayload !== undefined
            ? { customMethodCardFieldBlocks: blocksPayload }
            : {}),
        });
        break;
    }
    customizeSnapshotRef.current = null;
    setModalEditUnlocked(false);
    setDraftFieldBlocks(null);
    setCustomizeHeaderDraft(null);
  }, [
    customizeHeaderDraft,
    draft,
    draftFieldBlocks,
    modalEditUnlocked,
    onClose,
    onInteract,
    onSave,
    replaceState,
    state,
    target,
  ]);

  const handleNext = useCallback(() => {
    if (!target || !draft) return;
    if (target.groupKey === "coreValues") {
      handleCoreSave();
    } else {
      handleMethodPrimary();
    }
  }, [draft, handleCoreSave, handleMethodPrimary, target]);

  const nextButtonText = useMemo(() => {
    if (!target) return tModal("saveButton");
    if (target.groupKey === "coreValues" && modalEditUnlocked) {
      return modalKebabMenu.saveEdits;
    }
    if (target.groupKey === "coreValues") {
      return tModal("saveButton");
    }
    if (modalEditUnlocked) return modalKebabMenu.saveEdits;
    if (!isChipInSelection) return addPrimaryLabelForMethodFacet(target.groupKey, cr);
    return tModal("saveButton");
  }, [
    cr,
    isChipInSelection,
    modalEditUnlocked,
    modalKebabMenu.saveEdits,
    target,
    tModal,
  ]);

  const headerContent = useMemo(() => {
    if (
      target &&
      target.groupKey === "coreValues" &&
      modalEditUnlocked &&
      customizeHeaderDraft
    ) {
      return (
        <MethodCardCustomizeModalHeader
          titleLabel={tCv.detailModal.customizeValueNameLabel}
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
      );
    }
    if (
      target &&
      isMethodFacetGroup(target.groupKey) &&
      modalEditUnlocked &&
      customizeHeaderDraft
    ) {
      return (
        <MethodCardCustomizeModalHeader
          titleLabel={modalKebabMenu.customizePolicyTitleLabel}
          descriptionLabel={modalKebabMenu.customizePolicyDescriptionLabel}
          titleValue={customizeHeaderDraft.title}
          descriptionValue={customizeHeaderDraft.description}
          onTitleChange={(title) =>
            setCustomizeHeaderDraft((prev) =>
              prev ? { ...prev, title } : null,
            )
          }
          onDescriptionChange={(description) =>
            setCustomizeHeaderDraft((prev) =>
              prev ? { ...prev, description } : null,
            )
          }
        />
      );
    }
    if (!target) return undefined;
    return (
      <div className="bg-[var(--color-surface-default-primary)] px-[24px] py-[12px] shrink-0">
        <ContentLockup
          title={target.chipLabel}
          description={subtitle}
          variant="modal"
          alignment="left"
        />
      </div>
    );
  }, [
    customizeHeaderDraft,
    modalEditUnlocked,
    modalKebabMenu.customizePolicyDescriptionLabel,
    modalKebabMenu.customizePolicyTitleLabel,
    subtitle,
    target,
    tCv.detailModal.customizeValueNameLabel,
  ]);

  const showNext =
    target?.groupKey === "coreValues"
      ? showCoreModalPrimary
      : showMethodModalPrimary;

  return (
      <Create
      isOpen={isOpen}
      onClose={handleModalClose}
      backdropVariant="blurredYellow"
      headerContent={headerContent}
      showBackButton={
        target != null &&
        modalEditUnlocked &&
        (target.groupKey === "coreValues" || isMethodFacetGroup(target.groupKey))
      }
      showNextButton={showNext}
      onBack={handleCancelCustomize}
      onNext={handleNext}
      backButtonText={modalKebabMenu.cancelCustomize}
      nextButtonText={nextButtonText}
      nextButtonDisabled={
        target?.groupKey === "coreValues"
          ? modalEditUnlocked && coreCustomizeSaveDisabled
          : modalEditUnlocked && methodCustomizeSaveDisabled
      }
      kebabTriggerAriaLabel={modalKebabMenu.triggerAriaLabel}
      kebabMenuAriaLabel={modalKebabMenu.menuAriaLabel}
      kebabMenuItems={
        target && kebabMenuItems.length > 0 ? kebabMenuItems : undefined
      }
      ariaLabel={target?.chipLabel || "Edit chip details"}
    >
      <div className="flex flex-col gap-[var(--measures-spacing-600,24px)] pb-2">
        {draft?.groupKey === "coreValues" && (
          <CoreValueEditFields
            readOnly={fieldsLocked}
            value={draft.value}
            onChange={(value) => setDraft({ groupKey: "coreValues", value })}
          />
        )}
        {draft?.groupKey === "communication" &&
          target &&
          (isCustomMethodCardId(
            target.overrideKey,
            state.customMethodCardMetaById,
          ) ? (
            <CustomMethodCardModalBody
              cardId={target.overrideKey}
              blocksById={state.customMethodCardFieldBlocksById}
              blocksOverride={
                modalEditUnlocked && draftFieldBlocks !== null
                  ? draftFieldBlocks
                  : undefined
              }
              policyMeta={
                state.customMethodCardMetaById?.[target.overrideKey]
              }
              showPolicyContentLockupWhenNoBlocks={fieldsLocked}
              onFieldBlocksChange={
                fieldsLocked
                  ? undefined
                  : (next) => setDraftFieldBlocks(next)
              }
            />
          ) : (
            <CommunicationMethodEditFields
              value={draft.value}
              onChange={(value) =>
                setDraft({ groupKey: "communication", value })
              }
              readOnly={fieldsLocked}
            />
          ))}
        {draft?.groupKey === "membership" &&
          target &&
          (isCustomMethodCardId(
            target.overrideKey,
            state.customMethodCardMetaById,
          ) ? (
            <CustomMethodCardModalBody
              cardId={target.overrideKey}
              blocksById={state.customMethodCardFieldBlocksById}
              blocksOverride={
                modalEditUnlocked && draftFieldBlocks !== null
                  ? draftFieldBlocks
                  : undefined
              }
              policyMeta={
                state.customMethodCardMetaById?.[target.overrideKey]
              }
              showPolicyContentLockupWhenNoBlocks={fieldsLocked}
              onFieldBlocksChange={
                fieldsLocked
                  ? undefined
                  : (next) => setDraftFieldBlocks(next)
              }
            />
          ) : (
            <MembershipMethodEditFields
              value={draft.value}
              onChange={(value) =>
                setDraft({ groupKey: "membership", value })
              }
              readOnly={fieldsLocked}
            />
          ))}
        {draft?.groupKey === "decisionApproaches" &&
          target &&
          (isCustomMethodCardId(
            target.overrideKey,
            state.customMethodCardMetaById,
          ) ? (
            <CustomMethodCardModalBody
              cardId={target.overrideKey}
              blocksById={state.customMethodCardFieldBlocksById}
              blocksOverride={
                modalEditUnlocked && draftFieldBlocks !== null
                  ? draftFieldBlocks
                  : undefined
              }
              policyMeta={
                state.customMethodCardMetaById?.[target.overrideKey]
              }
              showPolicyContentLockupWhenNoBlocks={fieldsLocked}
              onFieldBlocksChange={
                fieldsLocked
                  ? undefined
                  : (next) => setDraftFieldBlocks(next)
              }
            />
          ) : (
            <DecisionApproachEditFields
              value={draft.value}
              onChange={(value) =>
                setDraft({ groupKey: "decisionApproaches", value })
              }
              readOnly={fieldsLocked}
            />
          ))}
        {draft?.groupKey === "conflictManagement" &&
          target &&
          (isCustomMethodCardId(
            target.overrideKey,
            state.customMethodCardMetaById,
          ) ? (
            <CustomMethodCardModalBody
              cardId={target.overrideKey}
              blocksById={state.customMethodCardFieldBlocksById}
              blocksOverride={
                modalEditUnlocked && draftFieldBlocks !== null
                  ? draftFieldBlocks
                  : undefined
              }
              policyMeta={
                state.customMethodCardMetaById?.[target.overrideKey]
              }
              showPolicyContentLockupWhenNoBlocks={fieldsLocked}
              onFieldBlocksChange={
                fieldsLocked
                  ? undefined
                  : (next) => setDraftFieldBlocks(next)
              }
            />
          ) : (
            <ConflictManagementEditFields
              value={draft.value}
              onChange={(value) =>
                setDraft({ groupKey: "conflictManagement", value })
              }
              readOnly={fieldsLocked}
            />
          ))}
      </div>
    </Create>
  );
}

// ---------- helpers ------------------------------------------------------

function facetSeedSignature(
  target: FinalReviewChipEditTarget,
  state: CreateFlowState,
): string {
  const id = target.overrideKey;
  switch (target.groupKey) {
    case "coreValues":
      return JSON.stringify({
        details: state.coreValueDetailsByChipId?.[id],
        row:
          state.coreValuesChipsSnapshot?.find((r) => r.id === id) ?? null,
      });
    case "communication":
      return JSON.stringify({
        meta: state.customMethodCardMetaById?.[id] ?? null,
        details: state.communicationMethodDetailsById?.[id] ?? null,
        blocks: state.customMethodCardFieldBlocksById?.[id] ?? null,
      });
    case "membership":
      return JSON.stringify({
        meta: state.customMethodCardMetaById?.[id] ?? null,
        details: state.membershipMethodDetailsById?.[id] ?? null,
        blocks: state.customMethodCardFieldBlocksById?.[id] ?? null,
      });
    case "decisionApproaches":
      return JSON.stringify({
        meta: state.customMethodCardMetaById?.[id] ?? null,
        details: state.decisionApproachDetailsById?.[id] ?? null,
        blocks: state.customMethodCardFieldBlocksById?.[id] ?? null,
      });
    case "conflictManagement":
      return JSON.stringify({
        meta: state.customMethodCardMetaById?.[id] ?? null,
        details: state.conflictManagementDetailsById?.[id] ?? null,
        blocks: state.customMethodCardFieldBlocksById?.[id] ?? null,
      });
    default: {
      const _e: never = target.groupKey;
      return String(_e);
    }
  }
}

function pendingDraftForCustomize(
  draft: Draft | null,
  target: FinalReviewChipEditTarget | null,
): { groupKey: MethodFacetGroupKey; pendingValue: MethodDetailDraft } | null {
  if (!draft || !target || !isMethodFacetGroup(target.groupKey)) return null;
  switch (draft.groupKey) {
    case "coreValues":
      return null;
    case "communication":
      return { groupKey: "communication", pendingValue: draft.value };
    case "membership":
      return { groupKey: "membership", pendingValue: draft.value };
    case "decisionApproaches":
      return { groupKey: "decisionApproaches", pendingValue: draft.value };
    case "conflictManagement":
      return { groupKey: "conflictManagement", pendingValue: draft.value };
  }
}

function confirmCopyForMethodGroup(
  groupKey: MethodFacetGroupKey,
  t: {
    tComm: { confirmModal: { title: string; description: string } };
    tMem: { confirmModal: { title: string; description: string } };
    tDa: { confirmModal: { title: string; description: string } };
    tCm: { confirmModal: { title: string; description: string } };
  },
) {
  switch (groupKey) {
    case "communication":
      return t.tComm.confirmModal;
    case "membership":
      return t.tMem.confirmModal;
    case "decisionApproaches":
      return t.tDa.confirmModal;
    case "conflictManagement":
      return t.tCm.confirmModal;
  }
}

function addPrimaryLabelForMethodFacet(
  groupKey: MethodFacetGroupKey,
  cr: ReturnType<typeof useMessages>["create"]["customRule"],
): string {
  switch (groupKey) {
    case "communication":
      return cr.communication.addPlatform.nextButtonText;
    case "membership":
      return cr.membership.addPlatform.nextButtonText;
    case "decisionApproaches":
      return cr.decisionApproaches.addApproach.nextButtonText;
    case "conflictManagement":
      return cr.conflictManagement.addApproach.nextButtonText;
  }
}

function seedDraftForTarget(
  target: FinalReviewChipEditTarget,
  state: CreateFlowState,
): Draft {
  switch (target.groupKey) {
    case "coreValues": {
      const saved = state.coreValueDetailsByChipId?.[target.overrideKey];
      const preset = coreValuePresetFor(target.overrideKey);
      return {
        groupKey: "coreValues",
        value: {
          meaning: saved?.meaning ?? preset.meaning,
          signals: saved?.signals ?? preset.signals,
        },
      };
    }
    case "communication": {
      const saved =
        state.communicationMethodDetailsById?.[target.overrideKey] ??
        communicationPresetFor(target.overrideKey);
      return { groupKey: "communication", value: { ...saved } };
    }
    case "membership": {
      const saved =
        state.membershipMethodDetailsById?.[target.overrideKey] ??
        membershipPresetFor(target.overrideKey);
      return { groupKey: "membership", value: { ...saved } };
    }
    case "decisionApproaches": {
      const saved =
        state.decisionApproachDetailsById?.[target.overrideKey] ??
        decisionApproachPresetFor(target.overrideKey);
      return {
        groupKey: "decisionApproaches",
        value: {
          ...saved,
          applicableScope: [...saved.applicableScope],
          selectedApplicableScope: [...saved.selectedApplicableScope],
        },
      };
    }
    case "conflictManagement": {
      const saved =
        state.conflictManagementDetailsById?.[target.overrideKey] ??
        conflictManagementPresetFor(target.overrideKey);
      return {
        groupKey: "conflictManagement",
        value: {
          ...saved,
          applicableScope: [...saved.applicableScope],
          selectedApplicableScope: [...saved.selectedApplicableScope],
        },
      };
    }
  }
}

type SubtitleMessages = {
  tCv: ReturnType<typeof useMessages>["create"]["customRule"]["coreValues"];
  tComm: ReturnType<typeof useMessages>["create"]["customRule"]["communication"];
  tMem: ReturnType<typeof useMessages>["create"]["customRule"]["membership"];
  tDa: ReturnType<
    typeof useMessages
  >["create"]["customRule"]["decisionApproaches"];
  tCm: ReturnType<
    typeof useMessages
  >["create"]["customRule"]["conflictManagement"];
};

function subtitleForTarget(
  target: FinalReviewChipEditTarget,
  msgs: SubtitleMessages,
  customMeta?: CreateFlowState["customMethodCardMetaById"],
): string {
  switch (target.groupKey) {
    case "coreValues":
      return msgs.tCv.detailModal.subtitle;
    case "communication": {
      const fromCustom = customMeta?.[target.overrideKey]?.supportText?.trim();
      if (fromCustom) return fromCustom;
      return findMethodSupportText(msgs.tComm.methods, target.overrideKey);
    }
    case "membership": {
      const fromCustom = customMeta?.[target.overrideKey]?.supportText?.trim();
      if (fromCustom) return fromCustom;
      return findMethodSupportText(msgs.tMem.methods, target.overrideKey);
    }
    case "decisionApproaches": {
      const fromCustom = customMeta?.[target.overrideKey]?.supportText?.trim();
      if (fromCustom) return fromCustom;
      return findMethodSupportText(msgs.tDa.methods, target.overrideKey);
    }
    case "conflictManagement": {
      const fromCustom = customMeta?.[target.overrideKey]?.supportText?.trim();
      if (fromCustom) return fromCustom;
      return findMethodSupportText(msgs.tCm.methods, target.overrideKey);
    }
  }
}

function findMethodSupportText(
  methods: readonly { id: string; supportText: string }[],
  id: string,
): string {
  for (const method of methods) {
    if (method.id === id) return method.supportText;
  }
  return "";
}
