import type { MethodFacetApiSectionId } from "./customRuleFacets";

export type FacetScoresBySlug = Record<string, number>;

const EMPTY_SCORES: FacetScoresBySlug = {};

const cache = new Map<string, FacetScoresBySlug>();
const inFlight = new Map<string, Promise<FacetScoresBySlug>>();

export function buildFacetRecommendationRequestKey(
  section: MethodFacetApiSectionId,
  queryString: string,
): string {
  return `${section}?${queryString}`;
}

export function getCachedFacetScores(
  requestKey: string,
): FacetScoresBySlug | undefined {
  return cache.get(requestKey);
}

function parseScoresFromMethodsJson(json: {
  methods?: { slug: string; matches?: { score?: number } }[];
}): FacetScoresBySlug {
  const scoresBySlug: FacetScoresBySlug = {};
  for (const m of json.methods ?? []) {
    if (typeof m.slug === "string") {
      scoresBySlug[m.slug] = m.matches?.score ?? 0;
    }
  }
  return scoresBySlug;
}

async function fetchFacetScoresFromApi(
  section: MethodFacetApiSectionId,
  queryString: string,
): Promise<FacetScoresBySlug> {
  const res = await fetch(
    `/api/create-flow/methods?section=${section}&${queryString}`,
    { credentials: "include" },
  );
  if (!res.ok) throw new Error(`status ${res.status}`);
  const json = (await res.json()) as {
    methods?: { slug: string; matches?: { score?: number } }[];
  };
  return parseScoresFromMethodsJson(json);
}

/**
 * Loads facet recommendation scores for one method deck. Results are cached
 * and in-flight requests are deduped so prefetch + screen hooks share work.
 */
export function loadFacetScores(
  section: MethodFacetApiSectionId,
  queryString: string,
): Promise<FacetScoresBySlug> {
  const requestKey = buildFacetRecommendationRequestKey(section, queryString);
  const cached = cache.get(requestKey);
  if (cached) return Promise.resolve(cached);

  let pending = inFlight.get(requestKey);
  if (!pending) {
    pending = fetchFacetScoresFromApi(section, queryString)
      .then((scores) => {
        cache.set(requestKey, scores);
        return scores;
      })
      .catch(() => EMPTY_SCORES)
      .finally(() => {
        inFlight.delete(requestKey);
      });
    inFlight.set(requestKey, pending);
  }
  return pending;
}
