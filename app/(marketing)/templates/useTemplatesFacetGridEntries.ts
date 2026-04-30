"use client";

import { useEffect, useState } from "react";
import { readAnonymousCreateFlowState } from "../../(app)/create/utils/anonymousDraftStorage";
import { buildFacetQueryString } from "../../../lib/create/buildFacetQueryString";
import {
  fetchRankedTemplatesByFacets,
  isTemplatesFetchAborted,
} from "../../../lib/create/fetchTemplates";
import {
  gridEntriesWithFacetScores,
  type TemplateGridCardEntry,
} from "../../../lib/templates/templateGridPresentation";

type UseTemplatesFacetGridEntriesArgs = {
  initialGridEntries: TemplateGridCardEntry[];
  enableFacetRecommendations: boolean;
};

/**
 * When `enableFacetRecommendations` (review → “Create from template” only),
 * re-fetch ranked templates from `GET /api/templates?facet.*` using the
 * persisted create-flow draft. Otherwise returns `initialGridEntries` from SSR.
 */
export function useTemplatesFacetGridEntries({
  initialGridEntries,
  enableFacetRecommendations,
}: UseTemplatesFacetGridEntriesArgs): TemplateGridCardEntry[] {
  const [entries, setEntries] = useState(initialGridEntries);

  useEffect(() => {
    if (!enableFacetRecommendations) {
      setEntries(initialGridEntries);
      return;
    }
    const state = readAnonymousCreateFlowState();
    const facetQuery = buildFacetQueryString(state);
    if (facetQuery.length === 0) {
      setEntries(initialGridEntries);
      return;
    }

    const ac = new AbortController();
    void (async () => {
      try {
        const result = await fetchRankedTemplatesByFacets({
          signal: ac.signal,
          facetQuery,
        });
        if (ac.signal.aborted) return;
        if ("error" in result) {
          setEntries(initialGridEntries);
          return;
        }
        setEntries(
          gridEntriesWithFacetScores(result.templates, result.scores),
        );
      } catch (e) {
        if (isTemplatesFetchAborted(e)) return;
        setEntries(initialGridEntries);
      }
    })();

    return () => {
      ac.abort();
    };
  }, [enableFacetRecommendations, initialGridEntries]);

  return entries;
}
