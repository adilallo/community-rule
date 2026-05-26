"use client";

import { useEffect, useMemo } from "react";
import { buildFacetQueryString } from "../../../../lib/create/buildFacetQueryString";
import { METHOD_FACET_API_SECTION_IDS } from "../../../../lib/create/customRuleFacets";
import { loadFacetScores } from "../../../../lib/create/facetRecommendationsLoad";
import { useCreateFlow } from "../context/CreateFlowContext";

/**
 * Warms the facet recommendation cache for all method-deck sections once the
 * user has community facet selections, so method screens can render ranked
 * cards on first paint instead of flashing authoring order.
 */
export function usePrefetchMethodFacetRecommendations(): void {
  const { state } = useCreateFlow();
  const queryString = useMemo(
    () => buildFacetQueryString(state),
    [state],
  );

  useEffect(() => {
    if (queryString.length === 0) return;
    for (const section of METHOD_FACET_API_SECTION_IDS) {
      void loadFacetScores(section, queryString);
    }
  }, [queryString]);
}
