"use client";

/**
 * Editable mirror of {@link TemplateChipDetailModal} for the final-review
 * screen. Each chip on `/create/final-review` opens this modal — same field
 * set as the matching custom-rule add-method modals, but with a **Save**
 * button instead of **Add**:
 *
 * - Initial field values come from the matching `{group}DetailsById` state
 *   override when present; otherwise from the preset defaults shipped in
 *   `messages/en/create/customRule/*.json` (see {@link finalReviewChipPresets}).
 * - Save is disabled until the user edits any field (cheap structural
 *   compare against the seeded snapshot). Saving writes the draft into
 *   `CreateFlowState` via the caller's `onSave` handler and closes; the
 *   state then rides along through the existing localStorage mirror,
 *   signed-in server draft PUT (Save & Exit), and `buildPublishPayload`
 *   (Finalize).
 * - Closing the modal without saving discards any edits — the parent never
 *   hears about them.
 *
 * The actual field rendering lives in `components/methodEditFields/*` and
 * is shared with the custom-rule add-method modals so the two surfaces stay
 * in lockstep automatically.
 */

import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  communicationPresetFor,
  conflictManagementPresetFor,
  coreValuePresetFor,
  decisionApproachPresetFor,
  membershipPresetFor,
} from "../../../../lib/create/finalReviewChipPresets";
import { isCustomMethodCardId } from "../../../../lib/create/isCustomMethodCardId";
import type { CustomMethodCardFieldBlock } from "../../../../lib/create/customMethodCardFieldBlocks";
import type {
  CommunicationMethodDetailEntry,
  ConflictManagementDetailEntry,
  CoreValueDetailEntry,
  CreateFlowState,
  DecisionApproachDetailEntry,
  MembershipMethodDetailEntry,
} from "../types";
import type { TemplateFacetGroupKey } from "../../../../lib/create/templateReviewMapping";

export type FinalReviewChipEditTarget = {
  /** Stable key for override lookup: preset id (methods) or chip id (core values). */
  overrideKey: string;
  /** Category group that decides which field set to render. */
  groupKey: TemplateFacetGroupKey;
  /** Display label shown at the top of the modal (localized chip label). */
  chipLabel: string;
};

export type FinalReviewChipEditPatch =
  | { groupKey: "coreValues"; overrideKey: string; value: CoreValueDetailEntry }
  | {
      groupKey: "communication";
      overrideKey: string;
      value: CommunicationMethodDetailEntry;
      customMethodCardFieldBlocks?: CustomMethodCardFieldBlock[];
    }
  | {
      groupKey: "membership";
      overrideKey: string;
      value: MembershipMethodDetailEntry;
      customMethodCardFieldBlocks?: CustomMethodCardFieldBlock[];
    }
  | {
      groupKey: "decisionApproaches";
      overrideKey: string;
      value: DecisionApproachDetailEntry;
      customMethodCardFieldBlocks?: CustomMethodCardFieldBlock[];
    }
  | {
      groupKey: "conflictManagement";
      overrideKey: string;
      value: ConflictManagementDetailEntry;
      customMethodCardFieldBlocks?: CustomMethodCardFieldBlock[];
    };

export interface FinalReviewChipEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Chip being edited. Passed `null` while the modal is closing so the
   * component can cleanly reset its internal draft state.
   */
  target: FinalReviewChipEditTarget | null;
  /** Current flow state — used to seed the modal from saved overrides. */
  state: CreateFlowState;
  /** Called with the typed patch when the user clicks Save. */
  onSave: (_patch: FinalReviewChipEditPatch) => void;
}

/**
 * Discriminated union of every group's draft + value. Storing both the
 * `groupKey` and the `value` together keeps render-time switches exhaustive
 * and prevents the four method group states from drifting apart (which is
 * the bug that motivated extracting `methodEditFields/*` in the first place).
 */
type Draft =
  | { groupKey: "coreValues"; value: CoreValueDetailEntry }
  | { groupKey: "communication"; value: CommunicationMethodDetailEntry }
  | { groupKey: "membership"; value: MembershipMethodDetailEntry }
  | { groupKey: "decisionApproaches"; value: DecisionApproachDetailEntry }
  | { groupKey: "conflictManagement"; value: ConflictManagementDetailEntry };

export function FinalReviewChipEditModal({
  isOpen,
  onClose,
  target,
  state,
  onSave,
}: FinalReviewChipEditModalProps) {
  const m = useMessages();
  const tCv = m.create.customRule.coreValues;
  const tComm = m.create.customRule.communication;
  const tMem = m.create.customRule.membership;
  const tDa = m.create.customRule.decisionApproaches;
  const tCm = m.create.customRule.conflictManagement;
  const tModal = useTranslation(
    "create.reviewAndComplete.finalReview.chipEditModal",
  );

  const [draft, setDraft] = useState<Draft | null>(null);
  const [fieldBlocksDraft, setFieldBlocksDraft] = useState<
    CustomMethodCardFieldBlock[] | null
  >(null);
  /**
   * JSON-stringified seed used for the cheap dirty check. Re-captured on
   * every (re)open so reopening a chip after a save shows Save-disabled
   * again until the user makes a fresh edit.
   */
  const initialSnapshotRef = useRef<string>("");
  const initialFieldBlocksSnapshotRef = useRef<string>("");
  const seededTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isOpen || !target) return;
    const targetKey = `${target.groupKey}:${target.overrideKey}`;
    if (seededTargetRef.current === targetKey) return;

    const seed = seedDraftForTarget(target, state);
    setDraft(seed);
    initialSnapshotRef.current = JSON.stringify(seed.value);
    if (
      target.groupKey !== "coreValues" &&
      isCustomMethodCardId(target.overrideKey, state.customMethodCardMetaById)
    ) {
      const blocks =
        state.customMethodCardFieldBlocksById?.[target.overrideKey] ?? [];
      setFieldBlocksDraft(blocks);
      initialFieldBlocksSnapshotRef.current = JSON.stringify(blocks);
    } else {
      setFieldBlocksDraft(null);
      initialFieldBlocksSnapshotRef.current = "";
    }
    seededTargetRef.current = targetKey;
  }, [isOpen, target, state]);

  useEffect(() => {
    if (!isOpen) seededTargetRef.current = null;
  }, [isOpen]);

  const isDirty = useMemo(() => {
    if (!draft || !target) return false;
    const valueDirty =
      JSON.stringify(draft.value) !== initialSnapshotRef.current;
    const customMethod =
      target.groupKey !== "coreValues" &&
      isCustomMethodCardId(target.overrideKey, state.customMethodCardMetaById);
    const blocksDirty =
      customMethod &&
      fieldBlocksDraft !== null &&
      JSON.stringify(fieldBlocksDraft) !==
        initialFieldBlocksSnapshotRef.current;
    return valueDirty || Boolean(blocksDirty);
  }, [draft, target, state.customMethodCardMetaById, fieldBlocksDraft]);

  const handleSave = () => {
    if (!target || !draft || !isDirty) return;
    const { overrideKey } = target;
    const customBlocks =
      draft.groupKey !== "coreValues" &&
      isCustomMethodCardId(overrideKey, state.customMethodCardMetaById) &&
      fieldBlocksDraft !== null
        ? fieldBlocksDraft
        : undefined;

    switch (draft.groupKey) {
      case "coreValues":
        onSave({
          groupKey: "coreValues",
          overrideKey,
          value: draft.value,
        });
        break;
      case "communication":
        onSave({
          groupKey: "communication",
          overrideKey,
          value: draft.value,
          ...(customBlocks !== undefined
            ? { customMethodCardFieldBlocks: customBlocks }
            : {}),
        });
        break;
      case "membership":
        onSave({
          groupKey: "membership",
          overrideKey,
          value: draft.value,
          ...(customBlocks !== undefined
            ? { customMethodCardFieldBlocks: customBlocks }
            : {}),
        });
        break;
      case "decisionApproaches":
        onSave({
          groupKey: "decisionApproaches",
          overrideKey,
          value: draft.value,
          ...(customBlocks !== undefined
            ? { customMethodCardFieldBlocks: customBlocks }
            : {}),
        });
        break;
      case "conflictManagement":
        onSave({
          groupKey: "conflictManagement",
          overrideKey,
          value: draft.value,
          ...(customBlocks !== undefined
            ? { customMethodCardFieldBlocks: customBlocks }
            : {}),
        });
        break;
    }
    onClose();
  };

  const subtitle = useMemo(() => {
    if (!target) return "";
    return subtitleForTarget(target, { tCv, tComm, tMem, tDa, tCm }, state.customMethodCardMetaById);
  }, [target, tCv, tComm, tMem, tDa, tCm, state.customMethodCardMetaById]);

  return (
    <Create
      isOpen={isOpen}
      onClose={onClose}
      backdropVariant="blurredYellow"
      headerContent={
        <div className="bg-[var(--color-surface-default-primary)] px-[24px] py-[12px] shrink-0">
          <ContentLockup
            title={target?.chipLabel ?? ""}
            description={subtitle}
            variant="modal"
            alignment="left"
          />
        </div>
      }
      showBackButton={false}
      showNextButton
      nextButtonText={tModal("saveButton")}
      nextButtonDisabled={!isDirty}
      onNext={handleSave}
      ariaLabel={target?.chipLabel || "Edit chip details"}
    >
      <div className="flex flex-col gap-[var(--measures-spacing-600,24px)] pb-2">
        {draft?.groupKey === "coreValues" && (
          <CoreValueEditFields
            value={draft.value}
            onChange={(value) => setDraft({ groupKey: "coreValues", value })}
          />
        )}
        {draft?.groupKey === "communication" &&
          (target &&
          isCustomMethodCardId(
            target.overrideKey,
            state.customMethodCardMetaById,
          ) ? (
            <CustomMethodCardModalBody
              cardId={target.overrideKey}
              blocksById={state.customMethodCardFieldBlocksById}
              blocksOverride={fieldBlocksDraft}
              onFieldBlocksChange={setFieldBlocksDraft}
            />
          ) : (
            <CommunicationMethodEditFields
              value={draft.value}
              onChange={(value) =>
                setDraft({ groupKey: "communication", value })
              }
            />
          ))}
        {draft?.groupKey === "membership" &&
          (target &&
          isCustomMethodCardId(
            target.overrideKey,
            state.customMethodCardMetaById,
          ) ? (
            <CustomMethodCardModalBody
              cardId={target.overrideKey}
              blocksById={state.customMethodCardFieldBlocksById}
              blocksOverride={fieldBlocksDraft}
              onFieldBlocksChange={setFieldBlocksDraft}
            />
          ) : (
            <MembershipMethodEditFields
              value={draft.value}
              onChange={(value) => setDraft({ groupKey: "membership", value })}
            />
          ))}
        {draft?.groupKey === "decisionApproaches" &&
          (target &&
          isCustomMethodCardId(
            target.overrideKey,
            state.customMethodCardMetaById,
          ) ? (
            <CustomMethodCardModalBody
              cardId={target.overrideKey}
              blocksById={state.customMethodCardFieldBlocksById}
              blocksOverride={fieldBlocksDraft}
              onFieldBlocksChange={setFieldBlocksDraft}
            />
          ) : (
            <DecisionApproachEditFields
              value={draft.value}
              onChange={(value) =>
                setDraft({ groupKey: "decisionApproaches", value })
              }
            />
          ))}
        {draft?.groupKey === "conflictManagement" &&
          (target &&
          isCustomMethodCardId(
            target.overrideKey,
            state.customMethodCardMetaById,
          ) ? (
            <CustomMethodCardModalBody
              cardId={target.overrideKey}
              blocksById={state.customMethodCardFieldBlocksById}
              blocksOverride={fieldBlocksDraft}
              onFieldBlocksChange={setFieldBlocksDraft}
            />
          ) : (
            <ConflictManagementEditFields
              value={draft.value}
              onChange={(value) =>
                setDraft({ groupKey: "conflictManagement", value })
              }
            />
          ))}
      </div>
    </Create>
  );
}

// ---------- helpers ------------------------------------------------------

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
