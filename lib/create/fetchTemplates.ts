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

type TemplatesResponse = { templates?: RuleTemplateDto[] };

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
  try {
    const res = await fetch("/api/templates", {
      credentials: "include",
      signal: options?.signal,
    });
    const data = (await res.json()) as TemplatesResponse & { error?: string };
    if (!res.ok) {
      return {
        error:
          typeof data.error === "string"
            ? data.error
            : "Could not load templates",
      };
    }
    return Array.isArray(data.templates) ? data.templates : [];
  } catch (e) {
    if (isAbortError(e)) {
      throw e;
    }
    return { error: "Could not load templates" };
  }
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
