"use client";

/**
 * `decision-approaches` step — Figma “Flow — Right Rail” (node `20523-23509`).
 * Registry: `CREATE_FLOW_SCREEN_REGISTRY["decision-approaches"]` (`layoutKind: "right-rail"`).
 *
 * Layout matches {@link CreateFlowTwoColumnSelectShell}: one column below `lg` (1024px), two columns
 * at `lg+` with a scrollable rail — same breakpoint and height chain as select steps, distinct content.
 *
 * Card click opens the Figma "Add Approach" create modal (node `20870-72155`) with five controls
 * rendered by {@link DecisionApproachEditFields}: Core Principle, Applicable Scope, Step-by-Step
 * Instructions, Consensus Level, and Objections & Deadlocks. The same field set is reused on
 * `/create/final-review` — see `FinalReviewChipEditModal`. Confirm persists both the chip
 * selection and any user edits as a `decisionApproachDetailsById[id]` override; section
 * defaults come from `messages/en/create/customRule/decisionApproaches.json` and will be
 * replaced with DB-driven content.
 */

import { useState, useCallback, useMemo, useRef } from "react";
import CardStack from "../../../../components/cards/CardStack";
import HeaderLockup from "../../../../components/type/HeaderLockup";
import Create from "../../../../components/modals/Create";
import InlineTextButton from "../../../../components/buttons/InlineTextButton";
import InfoMessageBox from "../../../../components/controls/InfoMessageBox";
import type { InfoMessageBoxItem } from "../../../../components/controls/InfoMessageBox/InfoMessageBox.types";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { useDiscardCustomizeConfirm } from "../../hooks/useDiscardCustomizeConfirm";
import { useMethodCardDeckOrdering } from "../../hooks/useMethodCardDeckOrdering";
import { CreateFlowTwoColumnSelectShell } from "../../components/CreateFlowTwoColumnSelectShell";
import { DecisionApproachEditFields } from "../../components/methodEditFields";
import CustomMethodCardWizard from "../../components/CustomMethodCardWizard";
import { uploadCreateFlowFile } from "../../../../../lib/create/uploadToServer";
import { decisionApproachPresetFor } from "../../../../../lib/create/finalReviewChipPresets";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import { mergePresetMethodsWithCustom } from "../../../../../lib/create/mergePresetMethodsWithCustom";
import { moveFacetSelectionIdToFront } from "../../../../../lib/create/methodCardSelectionOrder";
import { isCustomMethodCardId } from "../../../../../lib/create/isCustomMethodCardId";
import { decisionApproachFacetMatchesPreset } from "../../../../../lib/create/methodCardFacetMatchesPresetForId";
import { usesWizardFieldBlocksModalBody } from "../../../../../lib/create/usesWizardFieldBlocksModalBody";
import { removeMethodCardFromFacetSelection } from "../../../../../lib/create/removeMethodCardFromFacetSelection";
import {
  cloneMethodCardBlocksForDuplicate,
  cloneMethodCardDetailsForDuplicate,
  duplicateMethodCardTitle,
  forkMethodCardFacetMapsForDuplicate,
  omitIdFromStringRecord,
} from "../../../../../lib/create/duplicateMethodCardModalDraft";
import type { DecisionApproachDetailEntry } from "../../types";
import CustomMethodCardModalBody from "../../components/CustomMethodCardModalBody";
import { buildCustomRuleModalKebabMenu } from "../../components/customRuleModalKebabMenu";
import { methodCardMetaWithCustomizeHeader } from "../../../../../lib/create/methodCardCustomizeMetaPatch";
import {
  captureMethodCardCustomizeSnapshot,
  type MethodCardCustomizeSnapshot,
  type MethodCardHeaderDraft,
} from "../../../../../lib/create/methodCardCustomizeSession";
import MethodCardCustomizeModalHeader from "../../components/MethodCardCustomizeModalHeader";

export function DecisionApproachesScreen() {
  const m = useMessages();
  const da = m.create.customRule.decisionApproaches;
  const modalKebabMenu = m.create.customRule.modalKebabMenu;
  const mdUp = useCreateFlowMdUp();
  const { confirmDiscard, confirmDirtyCustomizeCancel, confirmDialog } =
    useDiscardCustomizeConfirm();
  const { state, updateState, replaceState, markCreateFlowInteraction } =
    useCreateFlow();
  const pendingEphemeralDuplicateIdRef = useRef<string | null>(null);
  const customizeSnapshotRef = useRef<
    MethodCardCustomizeSnapshot<DecisionApproachDetailEntry> | null
  >(null);
  const [messageBoxCheckedIds, setMessageBoxCheckedIds] = useState<string[]>(
    [],
  );
  const [expanded, setExpanded] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingCardId, setPendingCardId] = useState<string | null>(null);
  const [pendingDraft, setPendingDraft] =
    useState<DecisionApproachDetailEntry | null>(null);
  const [addCustomWizardOpen, setAddCustomWizardOpen] = useState(false);
  const [modalEditUnlocked, setModalEditUnlocked] = useState(false);
  const [draftFieldBlocks, setDraftFieldBlocks] = useState<
    CustomMethodCardFieldBlock[] | null
  >(null);
  const [customizeHeaderDraft, setCustomizeHeaderDraft] =
    useState<MethodCardHeaderDraft | null>(null);

  const selectedIds = state.selectedDecisionApproachIds ?? [];

  const messageBoxItems: InfoMessageBoxItem[] = useMemo(
    () =>
      da.messageBox.items.map((item) => ({
        id: item.id,
        label: item.label,
      })),
    [da.messageBox.items],
  );

  const mergedMethods = useMemo(
    () =>
      mergePresetMethodsWithCustom(
        da.methods,
        selectedIds,
        state.customMethodCardMetaById,
      ),
    [da.methods, selectedIds, state.customMethodCardMetaById],
  );

  const { sampleCards, compactCardIds, methodById } = useMethodCardDeckOrdering(
    "decisionApproaches",
    mergedMethods,
    selectedIds,
  );

  const handleOpenAddWizard = useCallback(() => {
    markCreateFlowInteraction();
    setAddCustomWizardOpen(true);
  }, [markCreateFlowInteraction]);

  const sidebarDescription = (
    <>
      {da.sidebar.descriptionBefore}
      <InlineTextButton onClick={handleOpenAddWizard}>
        {da.sidebar.descriptionLinkLabel}
      </InlineTextButton>
      {da.sidebar.descriptionAfter}
    </>
  );

  const handleMessageBoxCheckboxChange = useCallback(
    (id: string, checked: boolean) => {
      markCreateFlowInteraction();
      setMessageBoxCheckedIds((prev) =>
        checked ? [...prev, id] : prev.filter((x) => x !== id),
      );
    },
    [markCreateFlowInteraction],
  );

  const seedDraft = useCallback(
    (id: string): DecisionApproachDetailEntry => {
      const saved = state.decisionApproachDetailsById?.[id];
      if (saved) {
        return {
          ...saved,
          applicableScope: [...saved.applicableScope],
          selectedApplicableScope: [...saved.selectedApplicableScope],
        };
      }
      return decisionApproachPresetFor(id);
    },
    [state.decisionApproachDetailsById],
  );

  const handleCardSelect = useCallback(
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
    (next: DecisionApproachDetailEntry) => {
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
    return decisionApproachFacetMatchesPreset(pendingDraft, pendingCardId);
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
        decisionApproachDetailsById: omitIdFromStringRecord(
          prev.decisionApproachDetailsById,
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
        "decisionApproaches",
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
    const initialFieldBlocks =
      isCustomMethodCardId(pendingCardId, state.customMethodCardMetaById)
        ? structuredClone(
            state.customMethodCardFieldBlocksById?.[pendingCardId] ?? [],
          )
        : null;
    const method = methodById.get(pendingCardId);
    const meta = state.customMethodCardMetaById?.[pendingCardId];
    const headerDraft: MethodCardHeaderDraft = {
      title: meta?.label ?? method?.label ?? da.confirmModal.title,
      description:
        meta?.supportText ??
        method?.supportText ??
        da.confirmModal.description,
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
    da.confirmModal.description,
    da.confirmModal.title,
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
      state.decisionApproachDetailsById?.[pendingCardId],
      () => decisionApproachPresetFor(newId),
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
      facetDetailsById: state.decisionApproachDetailsById,
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
      decisionApproachDetailsById: maps.facetDetailsById,
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
    state.decisionApproachDetailsById,
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
      state.decisionApproachDetailsById?.[pendingCardId],
      () => decisionApproachPresetFor(newId),
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
      facetDetailsById: state.decisionApproachDetailsById,
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
      decisionApproachDetailsById: maps.facetDetailsById,
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
    state.decisionApproachDetailsById,
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

  const handleToggleExpand = useCallback(() => {
    markCreateFlowInteraction();
    setExpanded((prev) => !prev);
  }, [markCreateFlowInteraction]);

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
        selectedDecisionApproachIds: moveFacetSelectionIdToFront(
          selectedIds,
          id,
        ),
        customMethodCardMetaById: {
          ...(state.customMethodCardMetaById ?? {}),
          [id]: { label: title, supportText: description },
        },
        decisionApproachDetailsById: {
          ...(state.decisionApproachDetailsById ?? {}),
          [id]: decisionApproachPresetFor(id),
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
      state.decisionApproachDetailsById,
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
            decisionApproachDetailsById: {
              ...(state.decisionApproachDetailsById ?? {}),
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
          decisionApproachDetailsById: {
            ...(state.decisionApproachDetailsById ?? {}),
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
      selectedDecisionApproachIds: moveFacetSelectionIdToFront(
        selectedIds,
        pendingCardId,
      ),
      decisionApproachDetailsById: {
        ...(state.decisionApproachDetailsById ?? {}),
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

  const modalConfig = pendingCardId
      ? (() => {
        const method = methodById.get(pendingCardId);
        const meta = state.customMethodCardMetaById?.[pendingCardId];
        const saveLabel = modalKebabMenu.saveEdits;
        return {
          title: meta?.label ?? method?.label ?? da.confirmModal.title,
          description:
            meta?.supportText ??
            method?.supportText ??
            da.confirmModal.description,
          nextButtonText: modalEditUnlocked
            ? saveLabel
            : da.addApproach.nextButtonText,
        };
      })()
    : {
        title: da.confirmModal.title,
        description: da.confirmModal.description,
        nextButtonText: da.confirmModal.nextButtonText,
      };

  return (
    <>
    <CreateFlowTwoColumnSelectShell
      contentTopBelowMd="space-800"
      lgVerticalAlign="start"
      header={
        <div className="flex w-full min-w-0 flex-col gap-3">
          <HeaderLockup
            title={da.sidebar.title}
            description={sidebarDescription}
            size={mdUp ? "L" : "M"}
            justification={mdUp ? "left" : "center"}
          />
          <InfoMessageBox
            title={da.messageBox.title}
            items={messageBoxItems}
            checkedIds={messageBoxCheckedIds}
            onCheckboxChange={handleMessageBoxCheckboxChange}
          />
        </div>
      }
    >
      <div className="flex w-full min-w-0 flex-col items-stretch gap-6 py-0">
        <CardStack
          cards={sampleCards}
          selectedIds={selectedIds}
          onCardSelect={handleCardSelect}
          expanded={expanded}
          onToggleExpand={handleToggleExpand}
          hasMore={true}
          toggleLabel={da.cardStack.toggleSeeAll}
          showLessLabel={da.cardStack.toggleShowLess}
          title=""
          description={
            expanded ? (
              <>
                {da.cardStack.expandedStackDescriptionBefore}
                <InlineTextButton onClick={handleOpenAddWizard}>
                  {da.sidebar.descriptionLinkLabel}
                </InlineTextButton>
                {da.cardStack.expandedStackDescriptionAfter}
              </>
            ) : (
              ""
            )
          }
          layout="singleStack"
          compactRecommendedLimit={5}
          compactCardIds={compactCardIds}
          className="w-full"
          headerLockupSize={mdUp ? "L" : "M"}
        />
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
            <DecisionApproachEditFields
              value={pendingDraft}
              onChange={handleDraftChange}
              readOnly={fieldsLocked}
            />
          )
        ) : null}
      </Create>
    </CreateFlowTwoColumnSelectShell>
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
