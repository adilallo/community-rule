"use client";

/**
 * `communication-methods` step — Figma “Flow — Compact Card Stack” (node `20246-15828`).
 * Registry: `layoutKind: "card"` (`CREATE_FLOW_SCREEN_REGISTRY["communication-methods"]`).
 *
 * Lives under `screens/card/` (not `select/`): Figma **card stack** layout is a distinct shell from
 * two-column chip **select** frames. Future card-stack steps get their own `*Screen.tsx` here and
 * reuse `CardStack` / `CreateFlowStepShell` as needed.
 *
 * Card click opens the Figma create modal (node `20246-15829`) with three
 * editable sections rendered by {@link CommunicationMethodEditFields}. The primary
 * action is **Add Platform** for an unselected card; a selected card in view mode has
 * no footer primary — **Remove** is available from the kebab (same behavior as legacy
 * footer remove via {@link removeMethodCardFromFacetSelection}).
 */

import { useState, useCallback, useMemo, useRef } from "react";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { useDiscardCustomizeConfirm } from "../../hooks/useDiscardCustomizeConfirm";
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
import { CommunicationMethodEditFields } from "../../components/methodEditFields";
import CustomMethodCardWizard from "../../components/CustomMethodCardWizard";
import { uploadCreateFlowFile } from "../../../../../lib/create/uploadToServer";
import { communicationPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import { mergePresetMethodsWithCustom } from "../../../../../lib/create/mergePresetMethodsWithCustom";
import { moveFacetSelectionIdToFront } from "../../../../../lib/create/methodCardSelectionOrder";
import { isCustomMethodCardId } from "../../../../../lib/create/isCustomMethodCardId";
import { communicationMethodFacetMatchesPreset } from "../../../../../lib/create/methodCardFacetMatchesPresetForId";
import { usesWizardFieldBlocksModalBody } from "../../../../../lib/create/usesWizardFieldBlocksModalBody";
import { removeMethodCardFromFacetSelection } from "../../../../../lib/create/removeMethodCardFromFacetSelection";
import {
  cloneMethodCardBlocksForDuplicate,
  cloneMethodCardDetailsForDuplicate,
  duplicateMethodCardTitle,
  forkMethodCardFacetMapsForDuplicate,
  omitIdFromStringRecord,
} from "../../../../../lib/create/duplicateMethodCardModalDraft";
import type { CommunicationMethodDetailEntry } from "../../types";
import CustomMethodCardModalBody from "../../components/CustomMethodCardModalBody";
import { buildCustomRuleModalKebabMenu } from "../../components/customRuleModalKebabMenu";
import { methodCardMetaWithCustomizeHeader } from "../../../../../lib/create/methodCardCustomizeMetaPatch";
import {
  captureMethodCardCustomizeSnapshot,
  type MethodCardCustomizeSnapshot,
  type MethodCardHeaderDraft,
} from "../../../../../lib/create/methodCardCustomizeSession";
import MethodCardCustomizeModalHeader from "../../components/MethodCardCustomizeModalHeader";

export function CommunicationMethodsScreen() {
  const m = useMessages();
  const comm = m.create.customRule.communication;
  const modalKebabMenu = m.create.customRule.modalKebabMenu;
  const mdUp = useCreateFlowMdUp();
  const { confirmDiscard, confirmDirtyCustomizeCancel, confirmDialog } =
    useDiscardCustomizeConfirm();
  const { state, updateState, replaceState, markCreateFlowInteraction } =
    useCreateFlow();
  const pendingEphemeralDuplicateIdRef = useRef<string | null>(null);
  const customizeSnapshotRef = useRef<
    MethodCardCustomizeSnapshot<CommunicationMethodDetailEntry> | null
  >(null);
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [pendingDraft, setPendingDraft] =
    useState<CommunicationMethodDetailEntry | null>(null);
  const [addCustomWizardOpen, setAddCustomWizardOpen] = useState(false);
  const [modalEditUnlocked, setModalEditUnlocked] = useState(false);
  const [draftFieldBlocks, setDraftFieldBlocks] = useState<
    CustomMethodCardFieldBlock[] | null
  >(null);
  const [customizeHeaderDraft, setCustomizeHeaderDraft] =
    useState<MethodCardHeaderDraft | null>(null);

  const selectedIds = state.selectedCommunicationMethodIds ?? [];

  const mergedMethods = useMemo(
    () =>
      mergePresetMethodsWithCustom(
        comm.methods,
        selectedIds,
        state.customMethodCardMetaById,
      ),
    [comm.methods, selectedIds, state.customMethodCardMetaById],
  );

  const { sampleCards, compactCardIds, methodById, recommendationsReady } =
    useMethodCardDeckOrdering(
    "communication",
    mergedMethods,
    selectedIds,
  );

  const handleOpenAddWizard = useCallback(() => {
    markCreateFlowInteraction();
    setAddCustomWizardOpen(true);
  }, [markCreateFlowInteraction]);

  const title = expanded ? comm.page.expandedTitle : comm.page.compactTitle;

  const description = expanded ? (
    <>
      {comm.page.expandedDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {comm.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {comm.page.expandedDescriptionAfter}
    </>
  ) : (
    <>
      {comm.page.compactDescriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {comm.page.compactDescriptionLinkLabel}
      </InlineTextButton>
      {comm.page.compactDescriptionAfter}
    </>
  );

  const seedDraft = useCallback(
    (id: string): CommunicationMethodDetailEntry => {
      const saved = state.communicationMethodDetailsById?.[id];
      if (saved) {
        return { ...saved };
      }
      return communicationPresetFor(id);
    },
    [state.communicationMethodDetailsById],
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
    (next: CommunicationMethodDetailEntry) => {
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
    return communicationMethodFacetMatchesPreset(pendingDraft, pendingCardId);
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

  const handleCreateModalClose = useCallback(async () => {
    if (
      !(await confirmDiscard(
        modalEditUnlocked,
        customizeSnapshotRef.current,
        pendingDraft,
        draftFieldBlocks,
        customizeHeaderDraft,
      ))
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
        communicationMethodDetailsById: omitIdFromStringRecord(
          prev.communicationMethodDetailsById,
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
    confirmDiscard,
    customizeHeaderDraft,
    draftFieldBlocks,
    modalEditUnlocked,
    pendingDraft,
    replaceState,
  ]);

  const handleCancelCustomize = useCallback(async () => {
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
      !(await confirmDirtyCustomizeCancel(
        snap,
        pendingDraft,
        draftFieldBlocks,
        customizeHeaderDraft,
      ))
    ) {
      return;
    }
    setPendingDraft(structuredClone(snap.pendingDraft));
    setDraftFieldBlocks(null);
    setModalEditUnlocked(false);
    customizeSnapshotRef.current = null;
    setCustomizeHeaderDraft(null);
  }, [
    confirmDirtyCustomizeCancel,
    customizeHeaderDraft,
    draftFieldBlocks,
    modalEditUnlocked,
    pendingDraft,
  ]);

  const handleRemoveSelectedFromModal = useCallback(async () => {
    if (!pendingCardId || !selectedIds.includes(pendingCardId)) {
      return;
    }
    markCreateFlowInteraction();
    if (
      !(await confirmDiscard(
        modalEditUnlocked,
        customizeSnapshotRef.current,
        pendingDraft,
        draftFieldBlocks,
        customizeHeaderDraft,
      ))
    ) {
      return;
    }
    customizeSnapshotRef.current = null;
    updateState(
      removeMethodCardFromFacetSelection(
        state,
        "communication",
        pendingCardId,
      ),
    );
    await handleCreateModalClose();
  }, [
    confirmDiscard,
    customizeHeaderDraft,
    draftFieldBlocks,
    handleCreateModalClose,
    markCreateFlowInteraction,
    modalEditUnlocked,
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
    const persistedBlocks =
      state.customMethodCardFieldBlocksById?.[pendingCardId] ?? [];
    const initialFieldBlocks =
      persistedBlocks.length > 0
        ? structuredClone(persistedBlocks)
        : isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById)
          ? []
          : null;
    const method = methodById.get(pendingCardId);
    const meta = state.customMethodCardMetaById?.[pendingCardId];
    const headerDraft: MethodCardHeaderDraft = {
      title: meta?.label ?? method?.label ?? comm.confirmModal.title,
      description:
        meta?.supportText ??
        method?.supportText ??
        comm.confirmModal.description,
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
    comm.confirmModal.description,
    comm.confirmModal.title,
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
      state.communicationMethodDetailsById?.[pendingCardId],
      () => communicationPresetFor(newId),
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
      facetDetailsById: state.communicationMethodDetailsById,
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
      communicationMethodDetailsById: maps.facetDetailsById,
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
    markCreateFlowInteraction,
    modalKebabMenu.duplicateTitleSuffix,
    pendingCardId,
    pendingDraft,
    draftFieldBlocks,
    modalEditUnlocked,
    state.communicationMethodDetailsById,
    state.customMethodCardFieldBlocksById,
    state.customMethodCardMetaById,
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
      state.communicationMethodDetailsById?.[pendingCardId],
      () => communicationPresetFor(newId),
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
      facetDetailsById: state.communicationMethodDetailsById,
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
      communicationMethodDetailsById: maps.facetDetailsById,
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
    state.communicationMethodDetailsById,
    state.customMethodCardFieldBlocksById,
    state.customMethodCardMetaById,
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
          title: meta?.label ?? method?.label ?? comm.confirmModal.title,
          description:
            meta?.supportText ??
            method?.supportText ??
            comm.confirmModal.description,
          nextButtonText: modalEditUnlocked
            ? saveLabel
            : comm.addPlatform.nextButtonText,
        };
      })()
    : {
        title: comm.confirmModal.title,
        description: comm.confirmModal.description,
        nextButtonText: comm.confirmModal.nextButtonText,
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
        selectedCommunicationMethodIds: moveFacetSelectionIdToFront(
          selectedIds,
          id,
        ),
        customMethodCardMetaById: {
          ...(state.customMethodCardMetaById ?? {}),
          [id]: { label: title, supportText: description },
        },
        communicationMethodDetailsById: {
          ...(state.communicationMethodDetailsById ?? {}),
          [id]: communicationPresetFor(id),
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
      state.communicationMethodDetailsById,
      state.customMethodCardFieldBlocksById,
      state.customMethodCardMetaById,
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
            communicationMethodDetailsById: {
              ...(state.communicationMethodDetailsById ?? {}),
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
          communicationMethodDetailsById: {
            ...(state.communicationMethodDetailsById ?? {}),
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
      selectedCommunicationMethodIds: moveFacetSelectionIdToFront(
        selectedIds,
        pendingCardId,
      ),
      communicationMethodDetailsById: {
        ...(state.communicationMethodDetailsById ?? {}),
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
        <div
          className={CREATE_FLOW_CARD_STACK_AREA_MAX_CLASS}
          aria-busy={!recommendationsReady}
        >
          {recommendationsReady ? (
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
            toggleLabel={comm.page.seeAllLink}
            compactRecommendedLimit={5}
            compactCardIds={compactCardIds}
            compactDesktopLayout="flexWrap"
            headerLockupSize={mdUp ? "L" : "M"}
          />
          ) : null}
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
            <CommunicationMethodEditFields
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
      {confirmDialog}
    </>
  );
}
