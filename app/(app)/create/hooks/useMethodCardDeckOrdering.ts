"use client";

import { useMemo } from "react";
import {
  mergeCompactCardIdsWithPinnedSelected,
  orderRankedMethodsWithPinnedSelection,
} from "../../../../lib/create/methodCardDisplayOrder";
import {
  deriveCompactCards,
  rankMethodsByScore,
  useFacetRecommendations,
  type RecommendationSection,
} from "./useFacetRecommendations";

type MethodEntry = { id: string; label: string; supportText: string };

/**
 * Applies score ranking, compact-slot rules, then surfaces selected ids first in
 * `selected*Ids` order (most-recent add at index 0 via
 * {@link moveFacetSelectionIdToFront}). Selection-first applies whenever the facet
 * has any selection — not only after footer Confirm (`methodSectionsPinCommitted`).
 */
export function useMethodCardDeckOrdering(
  section: RecommendationSection,
  methods: readonly MethodEntry[],
  selectedIds: readonly string[],
) {
  const { scoresBySlug, hasAnyFacets } = useFacetRecommendations(section);

  const rankedMethods = useMemo(
    () => rankMethodsByScore(methods, scoresBySlug),
    [methods, scoresBySlug],
  );

  const selectionShowcaseActive = selectedIds.length > 0;

  const displayMethods = useMemo(
    () =>
      orderRankedMethodsWithPinnedSelection(
        rankedMethods,
        selectedIds,
        selectionShowcaseActive,
      ),
    [rankedMethods, selectedIds, selectionShowcaseActive],
  );

  const { compactCardIds: baseCompactCardIds, recommendedIds } = useMemo(
    () =>
      deriveCompactCards(
        rankedMethods,
        scoresBySlug,
        hasAnyFacets,
        /* limit */ 5,
      ),
    [rankedMethods, scoresBySlug, hasAnyFacets],
  );

  const compactCardIds = useMemo(
    () =>
      mergeCompactCardIdsWithPinnedSelected(
        displayMethods.map((m) => m.id),
        baseCompactCardIds,
        selectedIds,
        selectionShowcaseActive,
        5,
      ),
    [displayMethods, baseCompactCardIds, selectedIds, selectionShowcaseActive],
  );

  const sampleCards = useMemo(
    () =>
      displayMethods.map((entry) => ({
        id: entry.id,
        label: entry.label,
        supportText: entry.supportText,
        recommended: recommendedIds.has(entry.id),
      })),
    [displayMethods, recommendedIds],
  );

  const methodById = useMemo(
    () => new Map(rankedMethods.map((entry) => [entry.id, entry])),
    [rankedMethods],
  );

  return {
    rankedMethods,
    displayMethods,
    compactCardIds,
    recommendedIds,
    sampleCards,
    methodById,
  };
}
