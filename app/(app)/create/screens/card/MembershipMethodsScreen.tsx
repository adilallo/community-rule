"use client";

/**
 * `membership-methods` step — Figma compact card stack (node `20858-13947`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["membership-methods"]`.
 *
 * Card click opens the Figma create modal (node `20858-13948`) with three
 * editable sections rendered by {@link MembershipMethodEditFields}. The same
 * field set is reused on `/create/final-review` — see `FinalReviewChipEditModal`.
 * Confirm persists both the chip selection and any user edits as a
 * `membershipMethodDetailsById[id]` override; section defaults come from
 * `messages/en/create/customRule/membership.json` and will be replaced with
 * DB-driven content.
 */

import { useState, useCallback, useMemo, useRef } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { useMethodCardDeckOrdering } from "../../hooks/useMethodCardDeckOrdering";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import CardStack from "../../../../components/cards/CardStack";
import Create from "../../../../components/modals/Create";
import InlineTextButton from "../../../../components/buttons/InlineTextButton";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import {
  CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS,
  CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS,
} from "../../components/createFlowLayoutTokens";
import { MembershipMethodEditFields } from "../../components/methodEditFields";
import CustomMethodCardWizard from "../../components/CustomMethodCardWizard";
import { uploadCreateFlowFile } from "../../../../../lib/create/uploadToServer";
import { membershipPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import { mergePresetMethodsWithCustom } from "../../../../../lib/create/mergePresetMethodsWithCustom";
import { moveFacetSelectionIdToFront } from "../../../../../lib/create/methodCardSelectionOrder";
import { isCustomMethodCardId } from "../../../../../lib/create/isCustomMethodCardId";
import { membershipMethodFacetMatchesPreset } from "../../../../../lib/create/methodCardFacetMatchesPresetForId";
import { usesWizardFieldBlocksModalBody } from "../../../../../lib/create/usesWizardFieldBlocksModalBody";
import { removeMethodCardFromFacetSelection } from "../../../../../lib/create/removeMethodCardFromFacetSelection";
import {
  cloneMethodCardBlocksForDuplicate,
  cloneMethodCardDetailsForDuplicate,
  duplicateMethodCardTitle,
  forkMethodCardFacetMapsForDuplicate,
  omitIdFromStringRecord,
} from "../../../../../lib/create/duplicateMethodCardModalDraft";
import type { MembershipMethodDetailEntry } from "../../types";
import CustomMethodCardModalBody from "../../components/CustomMethodCardModalBody";
import { buildCustomRuleModalKebabMenu } from "../../components/customRuleModalKebabMenu";
import { methodCardMetaWithCustomizeHeader } from "../../../../../lib/create/methodCardCustomizeMetaPatch";
import {
  captureMethodCardCustomizeSnapshot,
  confirmDiscardMethodCardCustomizeSession,
  isMethodCardCustomizeSessionDirty,
  type MethodCardCustomizeSnapshot,
  type MethodCardHeaderDraft,
} from "../../../../../lib/create/methodCardCustomizeSession";
import MethodCardCustomizeModalHeader from "../../components/MethodCardCustomizeModalHeader";

export function MembershipMethodsScreen() {
  const m = useMessages();
  const mem = m.create.customRule.membership;
  const modalKebabMenu = m.create.customRule.modalKebabMenu;
  const mdUp = useCreateFlowMdUp();
  const { state, updateState, replaceState, markCreateFlowInteraction } =
    useCreateFlow();
  const pendingEphemeralDuplicateIdRef = useRef<string | null>(null);
  const customizeSnapshotRef = useRef<
    MethodCardCustomizeSnapshot<MembershipMethodDetailEntry> | null
  >(null);
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [pendingDraft, setPendingDraft] =
    useState<MembershipMethodDetailEntry | null>(null);
  const [addCustomWizardOpen, setAddCustomWizardOpen] = useState(false);
  const [modalEditUnlocked, setModalEditUnlocked] = useState(false);
  const [draftFieldBlocks, setDraftFieldBlocks] = useState<
    CustomMethodCardFieldBlock[] | null
  >(null);
  const [customizeHeaderDraft, setCustomizeHeaderDraft] =
    useState<MethodCardHeaderDraft | null>(null);

  const selectedIds = state.selectedMembershipMethodIds ?? [];

  const mergedMethods = useMemo(
    () =>
      mergePresetMethodsWithCustom(
        mem.methods,
        selectedIds,
        state.customMethodCardMetaById,
      ),
    [mem.methods, selectedIds, state.customMethodCardMetaById],
  );

  const { sampleCards, compactCardIds, methodById } = useMethodCardDeckOrdering(
    "membership",
    mergedMethods,
    selectedIds,
  );

  const handleOpenAddWizard = useCallback(() => {
    markCreateFlowInteraction();
    setAddCustomWizardOpen(true);
  }, [markCreateFlowInteraction]);

  const title = expanded ? mem.page.expandedTitle : mem.page.compactTitle;

  const description = expanded ? (
    <>
      {mem.page.expandedDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {mem.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {mem.page.expandedDescriptionAfter}
    </>
  ) : (
    <>
      {mem.page.compactDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {mem.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {mem.page.compactDescriptionAfter}
    </>
  );

  const seedDraft = useCallback(
    (id: string): MembershipMethodDetailEntry => {
      const saved = state.membershipMethodDetailsById?.[id];
      if (saved) {
        return { ...saved };
      }
      return membershipPresetFor(id);
    },
    [state.membershipMethodDetailsById],
  );

  const handleCardClick = useCallback(
    (id: string) => {
      markCreateFlowInteraction();
      customizeSnapshotRef.current = null;
      setModalEditUnlocked(false);
      setDraftFieldBlocks(null);
      setCustomizeHeaderDraft(null);
      setPendingCardId(id);
      setPendingDraft(seedDraft(id));
      setCreateModalOpen(true);
    },
    [markCreateFlowInteraction, seedDraft],
  );

  const handleDraftChange = useCallback(
    (next: MembershipMethodDetailEntry) => {
      markCreateFlowInteraction();
      setPendingDraft(next);
    },
    [markCreateFlowInteraction],
  );

  const isSelectedCardModal =
    pendingCardId !== null && selectedIds.includes(pendingCardId);
  const fieldsLocked = !modalEditUnlocked;

  const showMethodModalPrimary = !isSelectedCardModal || modalEditUnlocked;

  const customFacetDetailsMatchPreset = useMemo(() => {
    if (!pendingCardId || !pendingDraft) return false;
    if (!isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById)) {
      return false;
    }
    return membershipMethodFacetMatchesPreset(pendingDraft, pendingCardId);
  }, [
    pendingCardId,
    pendingDraft,
    state.customMethodCardMetaById,
  ]);

  const modalUsesWizardFieldBlocksBody = useMemo(
    () =>
      Boolean(
        pendingCardId &&
          usesWizardFieldBlocksModalBody({
            methodId: pendingCardId,
            meta: state.customMethodCardMetaById,
            fieldBlocksById: state.customMethodCardFieldBlocksById,
            modalEditUnlocked,
            draftFieldBlocks,
            customFacetDetailsMatchPreset,
          }),
      ),
    [
      customFacetDetailsMatchPreset,
      draftFieldBlocks,
      modalEditUnlocked,
      pendingCardId,
      state.customMethodCardFieldBlocksById,
      state.customMethodCardMetaById,
    ],
  );

  const handleCreateModalClose = useCallback(() => {
    if (
      !confirmDiscardMethodCardCustomizeSession(
        modalEditUnlocked,
        customizeSnapshotRef.current,
        pendingDraft,
        draftFieldBlocks,
        customizeHeaderDraft,
        modalKebabMenu.discardUnsavedCustomizeChanges,
      )
    ) {
      return;
    }
    customizeSnapshotRef.current = null;
    const ephemeralId = pendingEphemeralDuplicateIdRef.current;
    if (ephemeralId) {
      pendingEphemeralDuplicateIdRef.current = null;
      replaceState((prev) => ({
        ...prev,
        customMethodCardMetaById: omitIdFromStringRecord(
          prev.customMethodCardMetaById,
          ephemeralId,
        ),
        membershipMethodDetailsById: omitIdFromStringRecord(
          prev.membershipMethodDetailsById,
          ephemeralId,
        ),
        customMethodCardFieldBlocksById: omitIdFromStringRecord(
          prev.customMethodCardFieldBlocksById,
          ephemeralId,
        ),
      }));
    }
    setCreateModalOpen(false);
    setPendingCardId(null);
    setPendingDraft(null);
    setModalEditUnlocked(false);
    setDraftFieldBlocks(null);
    setCustomizeHeaderDraft(null);
  }, [
    customizeHeaderDraft,
    draftFieldBlocks,
    modalEditUnlocked,
    modalKebabMenu.discardUnsavedCustomizeChanges,
    pendingDraft,
    replaceState,
  ]);

  const handleCancelCustomize = useCallback(() => {
    if (!modalEditUnlocked) {
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
        pendingDraft,
        draftFieldBlocks,
        customizeHeaderDraft,
      ) &&
      !window.confirm(modalKebabMenu.discardUnsavedCustomizeChanges)
    ) {
      return;
    }
    setPendingDraft(structuredClone(snap.pendingDraft));
    setDraftFieldBlocks(null);
    setModalEditUnlocked(false);
    customizeSnapshotRef.current = null;
    setCustomizeHeaderDraft(null);
  }, [
    customizeHeaderDraft,
    draftFieldBlocks,
    modalEditUnlocked,
    modalKebabMenu.discardUnsavedCustomizeChanges,
    pendingDraft,
  ]);

  const handleRemoveSelectedFromModal = useCallback(() => {
    if (!pendingCardId || !selectedIds.includes(pendingCardId)) {
      return;
    }
    markCreateFlowInteraction();
    if (
      !confirmDiscardMethodCardCustomizeSession(
        modalEditUnlocked,
        customizeSnapshotRef.current,
        pendingDraft,
        draftFieldBlocks,
        customizeHeaderDraft,
        modalKebabMenu.discardUnsavedCustomizeChanges,
      )
    ) {
      return;
    }
    customizeSnapshotRef.current = null;
    updateState(
      removeMethodCardFromFacetSelection(state, "membership", pendingCardId),
    );
    handleCreateModalClose();
  }, [
    customizeHeaderDraft,
    draftFieldBlocks,
    handleCreateModalClose,
    markCreateFlowInteraction,
    modalEditUnlocked,
    modalKebabMenu.discardUnsavedCustomizeChanges,
    pendingDraft,
    pendingCardId,
    selectedIds,
    state,
    updateState,
  ]);

  const handleCustomize = useCallback(() => {
    markCreateFlowInteraction();
    if (!pendingDraft || !pendingCardId) {
      return;
    }
    const initialFieldBlocks =
      isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById)
        ? structuredClone(
            state.customMethodCardFieldBlocksById?.[pendingCardId] ?? [],
          )
        : null;
    const method = methodById.get(pendingCardId);
    const meta = state.customMethodCardMetaById?.[pendingCardId];
    const headerDraft: MethodCardHeaderDraft = {
      title: meta?.label ?? method?.label ?? mem.confirmModal.title,
      description:
        meta?.supportText ??
        method?.supportText ??
        mem.confirmModal.description,
    };
    setCustomizeHeaderDraft(headerDraft);
    customizeSnapshotRef.current = captureMethodCardCustomizeSnapshot(
      pendingDraft,
      initialFieldBlocks,
      headerDraft,
    );
    setDraftFieldBlocks(initialFieldBlocks);
    setModalEditUnlocked(true);
  }, [
    mem.confirmModal.description,
    mem.confirmModal.title,
    markCreateFlowInteraction,
    methodById,
    pendingCardId,
    pendingDraft,
    state.customMethodCardFieldBlocksById,
    state.customMethodCardMetaById,
  ]);

  const handleDuplicateCustomCard = useCallback(() => {
    if (
      !pendingCardId ||
      !isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById)
    ) {
      return;
    }
    markCreateFlowInteraction();
    const newId = crypto.randomUUID();
    const meta = state.customMethodCardMetaById![pendingCardId]!;
    const detailsClone = cloneMethodCardDetailsForDuplicate(
      pendingDraft,
      state.membershipMethodDetailsById?.[pendingCardId],
      () => membershipPresetFor(newId),
    );
    const blocksClone = structuredClone(
      modalEditUnlocked &&
        draftFieldBlocks !== null &&
        isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById)
        ? draftFieldBlocks
        : cloneMethodCardBlocksForDuplicate(
            state.customMethodCardFieldBlocksById,
            pendingCardId,
          ),
    );
    const suffix = modalKebabMenu.duplicateTitleSuffix;
    const priorEphemeral = pendingEphemeralDuplicateIdRef.current;
    const maps = forkMethodCardFacetMapsForDuplicate({
      customMethodCardMetaById: state.customMethodCardMetaById,
      facetDetailsById: state.membershipMethodDetailsById,
      customMethodCardFieldBlocksById: state.customMethodCardFieldBlocksById,
      omitId: priorEphemeral,
    });
    maps.customMethodCardMetaById[newId] = {
      label: duplicateMethodCardTitle(meta.label, suffix),
      supportText: meta.supportText,
    };
    maps.facetDetailsById[newId] = detailsClone;
    maps.customMethodCardFieldBlocksById[newId] = blocksClone;
    updateState({
      customMethodCardMetaById: maps.customMethodCardMetaById,
      membershipMethodDetailsById: maps.facetDetailsById,
      customMethodCardFieldBlocksById: maps.customMethodCardFieldBlocksById,
    });
    pendingEphemeralDuplicateIdRef.current = newId;
    customizeSnapshotRef.current = null;
    setPendingCardId(newId);
    setPendingDraft(structuredClone(detailsClone));
    setModalEditUnlocked(false);
    setDraftFieldBlocks(null);
    setCustomizeHeaderDraft(null);
  }, [
    draftFieldBlocks,
    markCreateFlowInteraction,
    modalEditUnlocked,
    modalKebabMenu.duplicateTitleSuffix,
    pendingCardId,
    pendingDraft,
    state.customMethodCardFieldBlocksById,
    state.customMethodCardMetaById,
    state.membershipMethodDetailsById,
    updateState,
  ]);

  const handleDuplicatePrefabCard = useCallback(() => {
    if (
      !pendingCardId ||
      isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById)
    ) {
      return;
    }
    const method = methodById.get(pendingCardId);
    if (!method || !pendingDraft) {
      return;
    }
    markCreateFlowInteraction();
    const newId = crypto.randomUUID();
    const detailsClone = cloneMethodCardDetailsForDuplicate(
      pendingDraft,
      state.membershipMethodDetailsById?.[pendingCardId],
      () => membershipPresetFor(newId),
    );
    const blocksClone = structuredClone(
      modalEditUnlocked &&
        draftFieldBlocks !== null &&
        isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById)
        ? draftFieldBlocks
        : cloneMethodCardBlocksForDuplicate(
            state.customMethodCardFieldBlocksById,
            pendingCardId,
          ),
    );
    const suffix = modalKebabMenu.duplicateTitleSuffix;
    const priorEphemeral = pendingEphemeralDuplicateIdRef.current;
    const maps = forkMethodCardFacetMapsForDuplicate({
      customMethodCardMetaById: state.customMethodCardMetaById,
      facetDetailsById: state.membershipMethodDetailsById,
      customMethodCardFieldBlocksById: state.customMethodCardFieldBlocksById,
      omitId: priorEphemeral,
    });
    maps.customMethodCardMetaById[newId] = {
      label: duplicateMethodCardTitle(method.label, suffix),
      supportText: method.supportText,
    };
    maps.facetDetailsById[newId] = detailsClone;
    maps.customMethodCardFieldBlocksById[newId] = blocksClone;
    updateState({
      customMethodCardMetaById: maps.customMethodCardMetaById,
      membershipMethodDetailsById: maps.facetDetailsById,
      customMethodCardFieldBlocksById: maps.customMethodCardFieldBlocksById,
    });
    pendingEphemeralDuplicateIdRef.current = newId;
    customizeSnapshotRef.current = null;
    setPendingCardId(newId);
    setPendingDraft(structuredClone(detailsClone));
    setModalEditUnlocked(false);
    setDraftFieldBlocks(null);
    setCustomizeHeaderDraft(null);
  }, [
    draftFieldBlocks,
    markCreateFlowInteraction,
    methodById,
    modalEditUnlocked,
    modalKebabMenu.duplicateTitleSuffix,
    pendingCardId,
    pendingDraft,
    state.customMethodCardFieldBlocksById,
    state.customMethodCardMetaById,
    state.membershipMethodDetailsById,
    updateState,
  ]);

  const kebabMenuItems = useMemo(
    () =>
      buildCustomRuleModalKebabMenu(modalKebabMenu, {
        showCustomize: !modalEditUnlocked,
        onCustomize: handleCustomize,
        onDuplicate:
          (state.editingPublishedRuleId?.trim() ?? "") !== "" || !pendingCardId
            ? undefined
            : isCustomMethodCardId(
                  pendingCardId,
                  state.customMethodCardMetaById,
                )
              ? handleDuplicateCustomCard
              : handleDuplicatePrefabCard,
        showRemove: isSelectedCardModal,
        onRemove: handleRemoveSelectedFromModal,
      }),
    [
      handleCustomize,
      handleDuplicateCustomCard,
      handleDuplicatePrefabCard,
      handleRemoveSelectedFromModal,
      isSelectedCardModal,
      modalEditUnlocked,
      modalKebabMenu,
      pendingCardId,
      state.customMethodCardMetaById,
      state.editingPublishedRuleId,
    ],
  );

  const modalConfig = pendingCardId
      ? (() => {
        const method = methodById.get(pendingCardId);
        const meta = state.customMethodCardMetaById?.[pendingCardId];
        const saveLabel = modalKebabMenu.saveEdits;
        return {
          title: meta?.label ?? method?.label ?? mem.confirmModal.title,
          description:
            meta?.supportText ??
            method?.supportText ??
            mem.confirmModal.description,
          nextButtonText: modalEditUnlocked
            ? saveLabel
            : mem.addPlatform.nextButtonText,
        };
      })()
    : {
        title: mem.confirmModal.title,
        description: mem.confirmModal.description,
        nextButtonText: mem.confirmModal.nextButtonText,
      };

  const handleCloseAddWizard = useCallback(() => {
    setAddCustomWizardOpen(false);
  }, []);

  const handleFinalizeCustomCard = useCallback(
    ({
      title,
      description,
      fieldBlocks,
    }: {
      title: string;
      description: string;
      fieldBlocks: CustomMethodCardFieldBlock[];
    }) => {
      markCreateFlowInteraction();
      const id = crypto.randomUUID();
      updateState({
        selectedMembershipMethodIds: moveFacetSelectionIdToFront(
          selectedIds,
          id,
        ),
        customMethodCardMetaById: {
          ...(state.customMethodCardMetaById ?? {}),
          [id]: { label: title, supportText: description },
        },
        membershipMethodDetailsById: {
          ...(state.membershipMethodDetailsById ?? {}),
          [id]: membershipPresetFor(id),
        },
        customMethodCardFieldBlocksById: {
          ...(state.customMethodCardFieldBlocksById ?? {}),
          [id]: fieldBlocks,
        },
      });
    },
    [
      markCreateFlowInteraction,
      selectedIds,
      state.customMethodCardFieldBlocksById,
      state.customMethodCardMetaById,
      state.membershipMethodDetailsById,
      updateState,
    ],
  );

  const handleCreateModalPrimary = useCallback(() => {
    if (!pendingCardId) {
      handleCreateModalClose();
      return;
    }
    markCreateFlowInteraction();

    if (selectedIds.includes(pendingCardId)) {
      if (modalEditUnlocked) {
        if (!customizeHeaderDraft) {
          return;
        }
        const nextMeta = methodCardMetaWithCustomizeHeader(
          state.customMethodCardMetaById,
          pendingCardId,
          customizeHeaderDraft,
        );
        if (
          pendingCardId &&
          isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById) &&
          usesWizardFieldBlocksModalBody({
            methodId: pendingCardId,
            meta: state.customMethodCardMetaById,
            fieldBlocksById: state.customMethodCardFieldBlocksById,
            modalEditUnlocked,
            draftFieldBlocks,
            customFacetDetailsMatchPreset,
          })
        ) {
          updateState({
            customMethodCardMetaById: nextMeta,
            customMethodCardFieldBlocksById: {
              ...(state.customMethodCardFieldBlocksById ?? {}),
              [pendingCardId]: structuredClone(draftFieldBlocks ?? []),
            },
          });
        } else if (pendingDraft) {
          updateState({
            customMethodCardMetaById: nextMeta,
            membershipMethodDetailsById: {
              ...(state.membershipMethodDetailsById ?? {}),
              [pendingCardId]: pendingDraft,
            },
          });
        }
        customizeSnapshotRef.current = null;
        setModalEditUnlocked(false);
        setDraftFieldBlocks(null);
        setCustomizeHeaderDraft(null);
        return;
      }
      return;
    }

    if (modalEditUnlocked) {
      if (!customizeHeaderDraft) {
        return;
      }
      const nextMeta = methodCardMetaWithCustomizeHeader(
        state.customMethodCardMetaById,
        pendingCardId,
        customizeHeaderDraft,
      );
      if (
        pendingCardId &&
        isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById) &&
        usesWizardFieldBlocksModalBody({
          methodId: pendingCardId,
          meta: state.customMethodCardMetaById,
          fieldBlocksById: state.customMethodCardFieldBlocksById,
          modalEditUnlocked,
          draftFieldBlocks,
          customFacetDetailsMatchPreset,
        })
      ) {
        updateState({
          customMethodCardMetaById: nextMeta,
          customMethodCardFieldBlocksById: {
            ...(state.customMethodCardFieldBlocksById ?? {}),
            [pendingCardId]: structuredClone(draftFieldBlocks ?? []),
          },
        });
      } else if (pendingDraft) {
        updateState({
          customMethodCardMetaById: nextMeta,
          membershipMethodDetailsById: {
            ...(state.membershipMethodDetailsById ?? {}),
            [pendingCardId]: pendingDraft,
          },
        });
      }
      customizeSnapshotRef.current = null;
      setModalEditUnlocked(false);
      setDraftFieldBlocks(null);
      setCustomizeHeaderDraft(null);
      return;
    }

    if (!pendingDraft) {
      handleCreateModalClose();
      return;
    }
    updateState({
      selectedMembershipMethodIds: moveFacetSelectionIdToFront(
        selectedIds,
        pendingCardId,
      ),
      membershipMethodDetailsById: {
        ...(state.membershipMethodDetailsById ?? {}),
        [pendingCardId]: pendingDraft,
      },
    });
    pendingEphemeralDuplicateIdRef.current = null;
    handleCreateModalClose();
  }, [
    customizeHeaderDraft,
    draftFieldBlocks,
    handleCreateModalClose,
    markCreateFlowInteraction,
    modalEditUnlocked,
    pendingCardId,
    pendingDraft,
    selectedIds,
    state,
    updateState,
  ]);

  return (
    <>
    <CreateFlowStepShell
      variant="wideGridLoosePadding"
      contentTopBelowMd="space-800"
    >
      <div className="flex w-full min-w-0 flex-col items-center gap-6">
        <div className={CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}>
          <CreateFlowHeaderLockup
            title={title}
            description={description}
            justification="center"
          />
        </div>
        <div className={CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS}>
          <CardStack
            cards={sampleCards}
            selectedIds={selectedIds}
            onCardSelect={handleCardClick}
            expanded={expanded}
            onToggleExpand={() => {
              markCreateFlowInteraction();
              setExpanded((prev) => !prev);
            }}
            hasMore={true}
            toggleLabel={mem.page.seeAllLink}
            compactRecommendedLimit={5}
            compactCardIds={compactCardIds}
            compactDesktopLayout="pyramidFive"
            headerLockupSize={mdUp ? "L" : "M"}
          />
        </div>
      </div>

      <Create
        isOpen={createModalOpen}
        onClose={handleCreateModalClose}
        headerContent={
          modalEditUnlocked && customizeHeaderDraft ? (
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
          ) : undefined
        }
        onNext={handleCreateModalPrimary}
        title={modalConfig.title}
        description={modalConfig.description}
        nextButtonText={modalConfig.nextButtonText}
        showBackButton={modalEditUnlocked}
        onBack={handleCancelCustomize}
        backButtonText={modalKebabMenu.cancelCustomize}
        showNextButton={showMethodModalPrimary}
        backdropVariant="blurredYellow"
        kebabTriggerAriaLabel={modalKebabMenu.triggerAriaLabel}
        kebabMenuAriaLabel={modalKebabMenu.menuAriaLabel}
        kebabMenuItems={kebabMenuItems}
      >
        {pendingCardId && pendingDraft ? (
          modalUsesWizardFieldBlocksBody ? (
            <CustomMethodCardModalBody
              cardId={pendingCardId}
              blocksById={state.customMethodCardFieldBlocksById}
              blocksOverride={
                modalEditUnlocked && draftFieldBlocks !== null
                  ? draftFieldBlocks
                  : undefined
              }
              policyMeta={state.customMethodCardMetaById?.[pendingCardId]}
              showPolicyContentLockupWhenNoBlocks={!modalEditUnlocked}
              onFieldBlocksChange={
                fieldsLocked
                  ? undefined
                  : (next) => setDraftFieldBlocks(next)
              }
            />
          ) : (
            <MembershipMethodEditFields
              value={pendingDraft}
              onChange={handleDraftChange}
              readOnly={fieldsLocked}
            />
          )
        ) : null}
      </Create>
    </CreateFlowStepShell>
      <CustomMethodCardWizard
        isOpen={addCustomWizardOpen}
        onClose={handleCloseAddWizard}
        onFinalize={handleFinalizeCustomCard}
        onPersistCustomUploadFile={(file) =>
          uploadCreateFlowFile(file, "customMethodAttachment")
        }
      />
    </>
  );
}
