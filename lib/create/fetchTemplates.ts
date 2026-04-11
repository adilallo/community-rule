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
  featured: boolean;
};

type TemplatesResponse = { templates?: RuleTemplateDto[] };

export async function fetchTemplates(): Promise<
  RuleTemplateDto[] | { error: string }
> {
  try {
    const res = await fetch("/api/templates", { credentials: "include" });
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
  } catch {
    return { error: "Could not load templates" };
  }
}

export async function fetchTemplateBySlug(
  slug: string,
): Promise<RuleTemplateDto | null | { error: string }> {
  const result = await fetchTemplates();
  if ("error" in result) {
    return result;
  }
  return result.find((t) => t.slug === slug) ?? null;
}
