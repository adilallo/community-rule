"use client";

import { useMemo } from "react";
import { useCreateFlow } from "../context/CreateFlowContext";
import type { CreateFlowMethodCardFacetSection } from "../types";
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
 * Applies score ranking, compact-slot rules, optional “pinned selection” showcase
 * order. Rows stay pinned across navigation while `methodSectionsPinCommitted` is true
 * and the section still has selections; we do **not** clear the flag when selection
 * arrays briefly go empty during draft hydration (`replaceState` / merge flashes) —
 * display order already ignores the pin until `pinActive` is true again.
 */
export function useMethodCardDeckOrdering(
  section: RecommendationSection,
  methods: readonly MethodEntry[],
  selectedIds: readonly string[],
) {
  const { state } = useCreateFlow();
  const facetKey = section as CreateFlowMethodCardFacetSection;
  const { scoresBySlug, hasAnyFacets } = useFacetRecommendations(section);

  const pinStored =
    state.methodSectionsPinCommitted?.[facetKey] === true;
  const pinActive = Boolean(pinStored && selectedIds.length > 0);

  const rankedMethods = useMemo(
    () => rankMethodsByScore(methods, scoresBySlug),
    [methods, scoresBySlug],
  );

  const displayMethods = useMemo(
    () =>
      orderRankedMethodsWithPinnedSelection(
        rankedMethods,
        selectedIds,
        pinActive,
      ),
    [rankedMethods, selectedIds, pinActive],
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
        pinActive,
        5,
      ),
    [displayMethods, baseCompactCardIds, selectedIds, pinActive],
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
