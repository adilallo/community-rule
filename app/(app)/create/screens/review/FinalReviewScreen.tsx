"use client";

import { useCallback, useMemo, useState } from "react";
import RuleCard from "../../../../components/cards/RuleCard";
import type { Category } from "../../../../components/cards/RuleCard/RuleCard.types";
import { TemplateChipDetailModal } from "../../../../components/cards/TemplateReviewCard/TemplateChipDetailModal";
import { useMessages, useTranslation } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import {
  CREATE_FLOW_REVIEW_RULE_CARD_LAYOUT_CLASS,
  CreateFlowLockupCardStepShell,
} from "../../components/CreateFlowLockupCardStepShell";
import {
  buildFinalReviewCategoryRowsDetailed,
  type FinalReviewCategoryRowDetailed,
} from "../../../../../lib/create/buildFinalReviewCategories";
import type { TemplateChipDetail } from "../../../../../lib/create/templateReviewMapping";
import {
  FinalReviewChipEditModal,
  type FinalReviewChipEditPatch,
  type FinalReviewChipEditTarget,
} from "../../components/FinalReviewChipEditModal";

/**
 * `finalReview.json.categories` ships a demo ordering + localized names
 * (Values / Communication / Membership / Decision-making / Conflict
 * management). We reuse that ordering for the state-derived rows so the
 * RuleCard layout stays stable across customize / use-without-changes /
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

export function FinalReviewScreen() {
  const { state, updateState, markCreateFlowInteraction } = useCreateFlow();
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

  const handleSave = useCallback(
    (patch: FinalReviewChipEditPatch) => {
      markCreateFlowInteraction();
      switch (patch.groupKey) {
        case "coreValues": {
          updateState({
            coreValueDetailsByChipId: {
              ...(state.coreValueDetailsByChipId ?? {}),
              [patch.overrideKey]: patch.value,
            },
          });
          return;
        }
        case "communication": {
          updateState({
            communicationMethodDetailsById: {
              ...(state.communicationMethodDetailsById ?? {}),
              [patch.overrideKey]: patch.value,
            },
          });
          return;
        }
        case "membership": {
          updateState({
            membershipMethodDetailsById: {
              ...(state.membershipMethodDetailsById ?? {}),
              [patch.overrideKey]: patch.value,
            },
          });
          return;
        }
        case "decisionApproaches": {
          updateState({
            decisionApproachDetailsById: {
              ...(state.decisionApproachDetailsById ?? {}),
              [patch.overrideKey]: patch.value,
            },
          });
          return;
        }
        case "conflictManagement": {
          updateState({
            conflictManagementDetailsById: {
              ...(state.conflictManagementDetailsById ?? {}),
              [patch.overrideKey]: patch.value,
            },
          });
          return;
        }
      }
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

    const lookup = new Map<
      string,
      { target: FinalReviewChipEditTarget | null; readOnly: TemplateChipDetail }
    >();

    const cats: Category[] = rowsToRender.map((row) => {
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
      };
    });
    return { categories: cats, chipLookup: lookup };
  }, [
    m.create.reviewAndComplete.finalReview.categories,
    state,
    markCreateFlowInteraction,
  ]);
  void chipLookup;

  const ruleCardTitle = useMemo(() => {
    const raw = typeof state.title === "string" ? state.title.trim() : "";
    return raw.length > 0 ? raw : t("ruleCardTitleFallback");
  }, [state.title, t]);

  const ruleCardDescription = useMemo(() => {
    const raw =
      typeof state.summary === "string" ? state.summary.trim() : "";
    return raw.length > 0 ? raw : t("ruleCardDescriptionFallback");
  }, [state.summary, t]);

  return (
    <CreateFlowLockupCardStepShell
      lockupTitle={t("title")}
      lockupDescription={t("description")}
    >
      <RuleCard
        title={ruleCardTitle}
        description={ruleCardDescription}
        size={mdUp ? "L" : "M"}
        expanded={true}
        backgroundColor="bg-[#c9fef9]"
        logoUrl="/assets/Vector_MutualAid.svg"
        logoAlt={ruleCardTitle}
        categories={finalReviewCategories}
        className={CREATE_FLOW_REVIEW_RULE_CARD_LAYOUT_CLASS}
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
    </CreateFlowLockupCardStepShell>
  );
}
