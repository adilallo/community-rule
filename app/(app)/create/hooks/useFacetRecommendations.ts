"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import facetGroups from "../../../../data/create/customRule/_facetGroups.json";
import {
  type CreateFlowState,
} from "../types";
import { useCreateFlow } from "../context/CreateFlowContext";

/**
 * Card-deck section ids served by `/api/create-flow/methods` (CR-88 §9.2).
 */
export type RecommendationSection =
  | "communication"
  | "membership"
  | "decisionApproaches"
  | "conflictManagement";

const FACET_GROUPS = ["size", "orgType", "scale", "maturity"] as const;
type FacetGroupId = (typeof FACET_GROUPS)[number];

/** Reverse map chipId → canonical facet value id, per group. */
const CHIP_TO_VALUE_BY_GROUP: Record<FacetGroupId, Record<string, string>> = (() => {
  const out: Record<FacetGroupId, Record<string, string>> = {
    size: {},
    orgType: {},
    scale: {},
    maturity: {},
  };
  for (const group of FACET_GROUPS) {
    const block = (facetGroups as Record<string, unknown>)[group];
    if (block && typeof block === "object" && "values" in block) {
      const values = (block as { values: Record<string, { chipId: string }> })
        .values;
      for (const [valueId, entry] of Object.entries(values)) {
        out[group][entry.chipId] = valueId;
      }
    }
  }
  return out;
})();

/** Chip-id state accessors per group. */
const STATE_KEY_BY_GROUP: Record<FacetGroupId, keyof CreateFlowState> = {
  size: "selectedCommunitySizeIds",
  orgType: "selectedOrganizationTypeIds",
  scale: "selectedScaleIds",
  maturity: "selectedMaturityIds",
};

function readChipIds(
  state: CreateFlowState,
  group: FacetGroupId,
): string[] {
  const value = state[STATE_KEY_BY_GROUP[group]];
  return Array.isArray(value) ? (value as string[]) : [];
}

function buildFacetQuery(state: CreateFlowState): string {
  const params = new URLSearchParams();
  for (const group of FACET_GROUPS) {
    const valuesById = CHIP_TO_VALUE_BY_GROUP[group];
    for (const chipId of readChipIds(state, group)) {
      const valueId = valuesById[chipId];
      if (valueId) {
        params.append(`facet.${group}`, valueId);
      }
    }
  }
  return params.toString();
}

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
  const queryString = useMemo(() => buildFacetQuery(state), [state]);
  const hasAnyFacets = queryString.length > 0;

  const [result, setResult] = useState<FacetRecommendationsResult>({
    isReady: !hasAnyFacets,
    scoresBySlug: EMPTY_SCORES,
    hasAnyFacets,
  });

  // Track the last successful request input so we don't re-fetch on every state poke.
  const lastQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!hasAnyFacets) {
      setResult({
        isReady: true,
        scoresBySlug: EMPTY_SCORES,
        hasAnyFacets: false,
      });
      lastQueryRef.current = null;
      return;
    }
    const requestKey = `${section}?${queryString}`;
    if (lastQueryRef.current === requestKey) return;
    lastQueryRef.current = requestKey;

    const ctrl = new AbortController();
    setResult((prev) => ({ ...prev, isReady: false, hasAnyFacets: true }));
    fetch(`/api/create-flow/methods?section=${section}&${queryString}`, {
      credentials: "include",
      signal: ctrl.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        return (await res.json()) as {
          methods?: { slug: string; matches?: { score?: number } }[];
        };
      })
      .then((json) => {
        const scoresBySlug: Record<string, number> = {};
        for (const m of json.methods ?? []) {
          if (typeof m.slug === "string") {
            scoresBySlug[m.slug] = m.matches?.score ?? 0;
          }
        }
        setResult({ isReady: true, scoresBySlug, hasAnyFacets: true });
      })
      .catch((e) => {
        if ((e as { name?: string }).name === "AbortError") return;
        setResult({
          isReady: true,
          scoresBySlug: EMPTY_SCORES,
          hasAnyFacets: true,
        });
      });

    return () => {
      ctrl.abort();
      // Clear the dedup key so React 19 Strict Mode's mount → unmount → mount
      // cycle (and any future remount) re-issues the request instead of
      // returning early on the same key.
      if (lastQueryRef.current === requestKey) {
        lastQueryRef.current = null;
      }
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
