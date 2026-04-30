"use client";

import { useCallback, useMemo, useState } from "react";
import Rule, { type Category } from "../../../../components/cards/Rule";
import { TemplateChipDetailModal } from "../../../../components/cards/TemplateReviewCard/TemplateChipDetailModal";
import { useMessages, useTranslation } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import {
  CREATE_FLOW_REVIEW_RULE_LAYOUT_CLASS,
  CreateFlowLockupCardStepShell,
} from "../../components/CreateFlowLockupCardStepShell";
import {
  buildFinalReviewCategoryRowsDetailed,
  type FinalReviewCategoryRowDetailed,
} from "../../../../../lib/create/buildFinalReviewCategories";
import { applyFinalReviewChipEditPatch } from "../../../../../lib/create/applyFinalReviewChipEditPatch";
import type {
  TemplateChipDetail,
  TemplateFacetGroupKey,
} from "../../../../../lib/create/templateReviewMapping";
import {
  FinalReviewChipEditModal,
  type FinalReviewChipEditPatch,
  type FinalReviewChipEditTarget,
} from "../../components/FinalReviewChipEditModal";
import { FinalReviewCommunityContextEditModal } from "../../components/FinalReviewCommunityContextEditModal";
import { useCreateFlowNavigation } from "../../hooks/useCreateFlowNavigation";
import { createFlowStepForFacetGroup } from "../../utils/facetGroupToCreateFlowStep";
import {
  getAssetPath,
  vectorMarkPath,
} from "../../../../../lib/assetUtils";

const FACET_FALLBACK_ORDER: readonly TemplateFacetGroupKey[] = [
  "coreValues",
  "communication",
  "membership",
  "decisionApproaches",
  "conflictManagement",
] as const;

/**
 * `finalReview.json.categories` ships a demo ordering + localized names
 * (Values / Communication / Membership / Decision-making / Conflict
 * management). We reuse that ordering for the state-derived rows so the
 * Rule layout stays stable across customize / use-without-changes /
 * plain-custom flows, and fall back to the demo chips when state resolves
 * to nothing selected.
 */
function readFallbackCategoryRows(
  categories: readonly { name: string; chips: readonly string[] }[],
): {
  names: {
    values: string;
    communication: string;
    membership: string;
    decisions: string;
    conflict: string;
  };
  rows: FinalReviewCategoryRowDetailed[];
} {
  const get = (i: number): string =>
    typeof categories[i]?.name === "string" ? categories[i].name : "";
  return {
    names: {
      values: get(0),
      communication: get(1),
      membership: get(2),
      decisions: get(3),
      conflict: get(4),
    },
    rows: categories.map((c) => ({
      name: c.name,
      groupKey: null,
      entries: [...c.chips].map((label) => ({
        label,
        groupKey: null,
        overrideKey: null,
      })),
    })),
  };
}

export function FinalReviewScreen({
  variant = "default",
}: {
  variant?: "default" | "editPublished";
} = {}) {
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
  const { goToStep } = useCreateFlowNavigation();
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation("create.reviewAndComplete.finalReview");
  const m = useMessages();

  /**
   * Two modals coexist on this screen:
   *
   * - {@link FinalReviewChipEditModal} — editable Save-button version used
   *   whenever the chip resolves to a stable `overrideKey` (core-value
   *   chip id, or a method preset id). Writes through to
   *   `{group}DetailsById` state fields on Save; close-without-save is a
   *   no-op so any typed edits are discarded.
   * - {@link TemplateChipDetailModal} — read-only fallback for chips we
   *   can't map to an override key (e.g. template body entries on the
   *   "Use without changes" path where no preset matches the title).
   *
   * `activeEditTarget` drives the editable modal; `activeReadOnlyDetail`
   * drives the read-only modal; only one is ever non-null at a time.
   */
  const [activeEditTarget, setActiveEditTarget] =
    useState<FinalReviewChipEditTarget | null>(null);
  const [activeReadOnlyDetail, setActiveReadOnlyDetail] =
    useState<TemplateChipDetail | null>(null);
  const [communityContextModalOpen, setCommunityContextModalOpen] =
    useState(false);

  const handleSave = useCallback(
    (patch: FinalReviewChipEditPatch) => {
      markCreateFlowInteraction();
      updateState(applyFinalReviewChipEditPatch(state, patch));
    },
    [markCreateFlowInteraction, updateState, state],
  );

  const { categories: finalReviewCategories, chipLookup } = useMemo(() => {
    const { names, rows: fallbackRows } = readFallbackCategoryRows(
      m.create.reviewAndComplete.finalReview.categories,
    );
    const derived = buildFinalReviewCategoryRowsDetailed(state, names);
    const rowsToRender: readonly FinalReviewCategoryRowDetailed[] =
      derived.length > 0 ? derived : fallbackRows;
    const usingFallbackRows = derived.length === 0;

    const lookup = new Map<
      string,
      { target: FinalReviewChipEditTarget | null; readOnly: TemplateChipDetail }
    >();

    const cats: Category[] = rowsToRender.map((row, rowIndex) => {
      const effectiveGroupKey: TemplateFacetGroupKey | null =
        row.groupKey ??
        (usingFallbackRows && rowIndex < FACET_FALLBACK_ORDER.length
          ? FACET_FALLBACK_ORDER[rowIndex]
          : null);

      const reviewReturn =
        variant === "editPublished" ? ("edit-rule" as const) : ("final-review" as const);

      const chipOptions = row.entries.map((entry, idx) => {
        const chipId = `${row.name}-${idx}`;
        const readOnly: TemplateChipDetail = {
          chipId,
          chipLabel: entry.label,
          categoryName: row.name,
          groupKey: entry.groupKey,
          body: "",
        };
        const target: FinalReviewChipEditTarget | null =
          entry.groupKey && entry.overrideKey
            ? {
                overrideKey: entry.overrideKey,
                groupKey: entry.groupKey,
                chipLabel: entry.label,
              }
            : null;
        lookup.set(chipId, { target, readOnly });
        return {
          id: chipId,
          label: entry.label,
          state: "unselected" as const,
        };
      });
      return {
        name: row.name,
        chipOptions,
        addButton: effectiveGroupKey != null,
        onChipClick: (_categoryName: string, chipId: string) => {
          const hit = lookup.get(chipId);
          if (!hit) return;
          markCreateFlowInteraction();
          if (hit.target) {
            setActiveEditTarget(hit.target);
          } else {
            setActiveReadOnlyDetail(hit.readOnly);
          }
        },
        onAddClick:
          effectiveGroupKey != null
            ? () => {
                markCreateFlowInteraction();
                goToStep(createFlowStepForFacetGroup(effectiveGroupKey), {
                  reviewReturn,
                });
              }
            : undefined,
      };
    });
    return { categories: cats, chipLookup: lookup };
  }, [
    m.create.reviewAndComplete.finalReview.categories,
    state,
    markCreateFlowInteraction,
    goToStep,
    variant,
  ]);
  void chipLookup;

  const ruleCardTitle = useMemo(() => {
    const raw = typeof state.title === "string" ? state.title.trim() : "";
    return raw.length > 0 ? raw : t("ruleCardTitleFallback");
  }, [state.title, t]);

  /**
   * Match {@link CommunityReviewScreen}: the card body is the free-text
   * `community-context` field only — not `summary`.
   */
  const ruleCardDescription = useMemo(() => {
    const raw =
      typeof state.communityContext === "string"
        ? state.communityContext.trim()
        : "";
    return raw.length > 0 ? raw : undefined;
  }, [state.communityContext]);

  const rawCommunityContextForModal =
    typeof state.communityContext === "string" ? state.communityContext : "";

  const descriptionEmptyHint =
    variant === "editPublished" ? t("communityContextEditModal.emptyHint") : undefined;

  return (
    <CreateFlowLockupCardStepShell
      lockupTitle={
        variant === "editPublished" ? t("editPublishedTitle") : t("title")
      }
      lockupDescription={
        variant === "editPublished"
          ? t("editPublishedDescription")
          : t("description")
      }
    >
      <Rule
        title={ruleCardTitle}
        description={ruleCardDescription}
        onDescriptionClick={
          variant === "editPublished"
            ? () => setCommunityContextModalOpen(true)
            : undefined
        }
        descriptionEmptyHint={descriptionEmptyHint}
        descriptionEditAriaLabel={
          variant === "editPublished"
            ? t("communityContextEditModal.ariaEditDescription")
            : undefined
        }
        size={mdUp ? "L" : "M"}
        expanded={true}
        backgroundColor="bg-[#c9fef9]"
        logoUrl={getAssetPath(vectorMarkPath("mutual-aid"))}
        logoAlt={ruleCardTitle}
        categories={finalReviewCategories}
        className={CREATE_FLOW_REVIEW_RULE_LAYOUT_CLASS}
        onClick={() => {}}
      />
      <FinalReviewChipEditModal
        isOpen={activeEditTarget !== null}
        onClose={() => setActiveEditTarget(null)}
        target={activeEditTarget}
        state={state}
        onSave={handleSave}
      />
      <TemplateChipDetailModal
        isOpen={activeReadOnlyDetail !== null}
        onClose={() => setActiveReadOnlyDetail(null)}
        detail={activeReadOnlyDetail}
      />
      {variant === "editPublished" ? (
        <FinalReviewCommunityContextEditModal
          isOpen={communityContextModalOpen}
          onClose={() => setCommunityContextModalOpen(false)}
          initialValue={rawCommunityContextForModal}
          onSave={(value) => {
            markCreateFlowInteraction();
            updateState({ communityContext: value, summary: value });
          }}
        />
      ) : null}
    </CreateFlowLockupCardStepShell>
  );
}
