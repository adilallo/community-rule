import facetGroups from "../../data/create/customRule/_facetGroups.json";
import type { CreateFlowState } from "../../app/(app)/create/types";

const FACET_GROUPS = ["size", "orgType", "scale", "maturity"] as const;
type FacetGroupId = (typeof FACET_GROUPS)[number];

const CHIP_TO_VALUE_BY_GROUP: Record<FacetGroupId, Record<string, string>> =
  (() => {
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

/**
 * Build `facet.size=…&facet.orgType=…` query string from Create Community
 * chip selections. Shared by `/api/create-flow/methods` and
 * `GET /api/templates` ranking (CR-88).
 */
export function buildFacetQueryString(state: CreateFlowState): string {
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
