"use client";

import { useEffect, useMemo, useState } from "react";
import { buildFacetQueryString } from "../../../../lib/create/buildFacetQueryString";
import type { MethodFacetApiSectionId } from "../../../../lib/create/customRuleFacets";
import {
  buildFacetRecommendationRequestKey,
  getCachedFacetScores,
  loadFacetScores,
} from "../../../../lib/create/facetRecommendationsLoad";
import { useCreateFlow } from "../context/CreateFlowContext";

/**
 * Card-deck section ids served by `/api/create-flow/methods` (CR-88 §9.2).
 * Same tuple as {@link METHOD_FACET_API_SECTION_IDS} (`CUSTOM_RULE_FACETS`, CR-92).
 */
export type RecommendationSection = MethodFacetApiSectionId;

export type FacetRecommendationsResult = {
  /** `true` once the network call completes (or short-circuits with no facets). */
  isReady: boolean;
  /** `slug → score`; missing slug means `0`. */
  scoresBySlug: Record<string, number>;
  /**
   * `true` iff the user has selected at least one community facet. When
   * `false`, callers should preserve authoring order rather than reranking.
   */
  hasAnyFacets: boolean;
};

const EMPTY_SCORES: Record<string, number> = {};

function initialFacetRecommendationsResult(
  section: RecommendationSection,
  queryString: string,
): FacetRecommendationsResult {
  const hasAnyFacets = queryString.length > 0;
  if (!hasAnyFacets) {
    return {
      isReady: true,
      scoresBySlug: EMPTY_SCORES,
      hasAnyFacets: false,
    };
  }
  const requestKey = buildFacetRecommendationRequestKey(section, queryString);
  const cached = getCachedFacetScores(requestKey);
  if (cached) {
    return {
      isReady: true,
      scoresBySlug: cached,
      hasAnyFacets: true,
    };
  }
  return {
    isReady: false,
    scoresBySlug: EMPTY_SCORES,
    hasAnyFacets: true,
  };
}

/**
 * Calls `GET /api/create-flow/methods?section=<section>&facet.*=...` for the
 * card-deck step `section` and returns a `slug → score` map for re-ranking
 * the messages-file `methods[]` array (CR-88 §10).
 *
 * Returns `{ isReady: true, scoresBySlug: {} }` when the user has not selected
 * any community facets — callers fall back to the authoring order.
 *
 * Network failures resolve to `scoresBySlug: {}` so the wizard is never
 * blocked on the recommendation backend.
 */
export function useFacetRecommendations(
  section: RecommendationSection,
): FacetRecommendationsResult {
  const { state } = useCreateFlow();
  const queryString = useMemo(
    () => buildFacetQueryString(state),
    [state],
  );
  const hasAnyFacets = queryString.length > 0;

  const [result, setResult] = useState<FacetRecommendationsResult>(() =>
    initialFacetRecommendationsResult(section, queryString),
  );

  useEffect(() => {
    if (!hasAnyFacets) {
      setResult({
        isReady: true,
        scoresBySlug: EMPTY_SCORES,
        hasAnyFacets: false,
      });
      return;
    }

    const requestKey = buildFacetRecommendationRequestKey(section, queryString);
    const cached = getCachedFacetScores(requestKey);
    if (cached) {
      setResult({
        isReady: true,
        scoresBySlug: cached,
        hasAnyFacets: true,
      });
      return;
    }

    let cancelled = false;
    setResult((prev) =>
      prev.isReady && prev.hasAnyFacets
        ? { ...prev, isReady: false }
        : { isReady: false, scoresBySlug: EMPTY_SCORES, hasAnyFacets: true },
    );

    void loadFacetScores(section, queryString).then((scoresBySlug) => {
      if (cancelled) return;
      setResult({ isReady: true, scoresBySlug, hasAnyFacets: true });
    });

    return () => {
      cancelled = true;
    };
  }, [section, queryString, hasAnyFacets]);

  return result;
}

/**
 * Stable comparator for re-ranking a messages-file `methods[]` array. Higher
 * `scoresBySlug[id]` first; ties fall back to authoring index, so a
 * zero-facet user sees the original ordering verbatim.
 */
export function rankMethodsByScore<T extends { id: string }>(
  methods: readonly T[],
  scoresBySlug: Record<string, number>,
): T[] {
  const indexById = new Map<string, number>();
  methods.forEach((m, i) => indexById.set(m.id, i));
  return [...methods].sort((a, b) => {
    const sa = scoresBySlug[a.id] ?? 0;
    const sb = scoresBySlug[b.id] ?? 0;
    if (sa !== sb) return sb - sa;
    return (indexById.get(a.id) ?? 0) - (indexById.get(b.id) ?? 0);
  });
}

/**
 * Picks (a) which method ids fill the compact card stack and (b) which of
 * those should render with the "Recommended" tag. The messages JSON no
 * longer carries a static `recommended` flag — both selections come
 * entirely from facet scores (CR-88 §10).
 *
 * Behavior:
 * - Facets selected & at least one method scored > 0 →
 *   `compactCardIds` = up to `limit` top-scored methods (1..limit cards;
 *   never padded with unrecommended fillers). All shown cards get the
 *   "Recommended" badge.
 * - No facets selected, or every method scored 0 → `compactCardIds` =
 *   first `limit` in ranked/authoring order, `recommendedIds` empty (no
 *   badges shown — honest "no signal yet" fallback).
 *
 * `CardStack.view` is responsible for laying out variable-length compact
 * arrays gracefully (uses `.map`/`.slice` and length-guarded indexing).
 */
export function deriveCompactCards<T extends { id: string }>(
  rankedMethods: readonly T[],
  scoresBySlug: Record<string, number>,
  hasAnyFacets: boolean,
  limit: number,
): { compactCardIds: string[]; recommendedIds: Set<string> } {
  const fallback = () => ({
    compactCardIds: rankedMethods.slice(0, limit).map((m) => m.id),
    recommendedIds: new Set<string>(),
  });

  if (!hasAnyFacets) return fallback();

  const matched = rankedMethods.filter(
    (m) => (scoresBySlug[m.id] ?? 0) > 0,
  );
  if (matched.length === 0) return fallback();

  const top = matched.slice(0, limit);
  return {
    compactCardIds: top.map((m) => m.id),
    recommendedIds: new Set(top.map((m) => m.id)),
  };
}
