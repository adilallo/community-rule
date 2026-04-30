/**
 * Client fetch for curated rule templates (GET /api/templates).
 */

export type RuleTemplateDto = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  description: string | null;
  body: unknown;
  sortOrder: number;
  featured: boolean;
};

type TemplatesResponse = {
  templates?: RuleTemplateDto[];
  scores?: Record<string, TemplateFacetScoreDto>;
};

function parseScoresPayload(
  raw: unknown,
): Record<string, TemplateFacetScoreDto> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, TemplateFacetScoreDto>;
  }
  return {};
}

async function getTemplatesJson(
  queryString: string,
  signal: AbortSignal | undefined,
): Promise<
  | { ok: true; data: TemplatesResponse & { error?: string }; statusOk: boolean }
  | { ok: false; error: "network" | "aborted" }
> {
  const url =
    queryString.length > 0 ? `/api/templates?${queryString}` : "/api/templates";
  try {
    const res = await fetch(url, {
      credentials: "include",
      signal,
    });
    const data = (await res.json()) as TemplatesResponse & { error?: string };
    return { ok: true, data, statusOk: res.ok };
  } catch (e) {
    if (isAbortError(e)) {
      return { ok: false, error: "aborted" };
    }
    return { ok: false, error: "network" };
  }
}

/** Matches `listRankedRuleTemplatesFromDb` / GET `/api/templates` with facet params. */
export type TemplateFacetScoreDto = {
  score: number;
  matchedFacets: string[];
};

export type RankedTemplatesFetchResult = {
  templates: RuleTemplateDto[];
  scores: Record<string, TemplateFacetScoreDto>;
};

export type FetchTemplatesOptions = {
  signal?: AbortSignal;
};

function isAbortError(e: unknown): boolean {
  return (
    (e instanceof DOMException && e.name === "AbortError") ||
    (e instanceof Error && e.name === "AbortError")
  );
}

/** For callers that `catch` around `fetchTemplates` / `fetchTemplateBySlug`. */
export function isTemplatesFetchAborted(e: unknown): boolean {
  return isAbortError(e);
}

export async function fetchTemplates(
  options?: FetchTemplatesOptions,
): Promise<RuleTemplateDto[] | { error: string }> {
  const got = await getTemplatesJson("", options?.signal);
  if (got.ok === false) {
    if (got.error === "aborted") {
      throw new DOMException("Aborted", "AbortError");
    }
    return { error: "Could not load templates" };
  }
  const { data, statusOk } = got;
  if (!statusOk) {
    return {
      error:
        typeof data.error === "string"
          ? data.error
          : "Could not load templates",
    };
  }
  return Array.isArray(data.templates) ? data.templates : [];
}

/**
 * Facet-ranked list + per-template scores (CR-88). Query must be non-empty
 * `facet.size=…&…` from {@link buildFacetQueryString}.
 */
export async function fetchRankedTemplatesByFacets(options: {
  facetQuery: string;
  signal?: AbortSignal;
}): Promise<RankedTemplatesFetchResult | { error: string }> {
  if (options.facetQuery.length === 0) {
    return { error: "Could not load templates" };
  }
  const got = await getTemplatesJson(options.facetQuery, options.signal);
  if (got.ok === false) {
    if (got.error === "aborted") {
      throw new DOMException("Aborted", "AbortError");
    }
    return { error: "Could not load templates" };
  }
  const { data, statusOk } = got;
  if (!statusOk) {
    return {
      error:
        typeof data.error === "string"
          ? data.error
          : "Could not load templates",
    };
  }
  const templates = Array.isArray(data.templates) ? data.templates : [];
  return { templates, scores: parseScoresPayload(data.scores) };
}

export async function fetchTemplateBySlug(
  slug: string,
  options?: FetchTemplatesOptions,
): Promise<RuleTemplateDto | null | { error: string }> {
  const result = await fetchTemplates(options);
  if ("error" in result) {
    return result;
  }
  return result.find((t) => t.slug === slug) ?? null;
}
