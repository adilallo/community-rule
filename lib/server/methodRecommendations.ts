import { prisma } from "./db";
import { isDatabaseConfigured } from "./env";
import {
  type RequestedFacets,
  type SectionId,
  flattenRequestedFacets,
} from "./validation/methodFacetsSchemas";

/**
 * Per-method ranking output (CR-88, §9.2).
 *
 * `score` = number of requested `(group, value)` pairs that this method's
 * `MethodFacet { matches: true }` rows cover. `matchedFacets` is the
 * deduped list of `"<group>:<value>"` keys that contributed — useful for
 * an eventual "Why this method?" UI tooltip.
 */
export type MethodRanking = {
  slug: string;
  matches: { score: number; matchedFacets: string[] };
};

export type ListMethodRecommendationsResult = {
  /** Ordered slug list, ranked highest-`score`-first; absent slugs scored `0`. */
  rankedSlugs: string[];
  /** Per-slug match data; missing entries should be treated as `score = 0`. */
  matchesBySlug: Record<string, MethodRanking["matches"]>;
};

/**
 * Returns the per-method match scores for `section`, given `facets`.
 * Returns `null` so callers can fall back to messages-file order when DB
 * is unavailable or the query fails.
 *
 * Notes:
 * - Empty facets ⇒ `rankedSlugs: []`, `matchesBySlug: {}` (caller falls back
 *   to authoring order).
 * - Sort is `score` desc only — re-stabilising into authoring order is the
 *   caller's job (the wizard already iterates the on-disk `methods[]` array).
 */
export async function listMethodRecommendations(args: {
  section: SectionId;
  facets: RequestedFacets;
}): Promise<ListMethodRecommendationsResult | null> {
  if (!isDatabaseConfigured()) return null;

  const requested = flattenRequestedFacets(args.facets);
  if (requested.length === 0) {
    return { rankedSlugs: [], matchesBySlug: {} };
  }

  try {
    const rows = await prisma.methodFacet.findMany({
      where: {
        section: args.section,
        matches: true,
        OR: requested.map(({ group, value }) => ({ group, value })),
      },
      select: { slug: true, group: true, value: true },
    });

    const matchesBySlug: Record<string, MethodRanking["matches"]> = {};
    for (const row of rows) {
      const key = `${row.group}:${row.value}`;
      const entry =
        matchesBySlug[row.slug] ??
        (matchesBySlug[row.slug] = { score: 0, matchedFacets: [] });
      if (!entry.matchedFacets.includes(key)) {
        entry.matchedFacets.push(key);
        entry.score += 1;
      }
    }

    const rankedSlugs = Object.entries(matchesBySlug)
      .sort(([, a], [, b]) => b.score - a.score)
      .map(([slug]) => slug);

    return { rankedSlugs, matchesBySlug };
  } catch {
    return null;
  }
}

/**
 * Score every template by joining its composed `(section, slug)` pairs
 * against `MethodFacet`. Returns a per-slug score map keyed by template slug
 * and a per-template breakdown of which method-level matches contributed.
 *
 * `templateMethods` enumerates the method slugs each template composes;
 * derived from `RuleTemplate.body` by the caller.
 */
export type TemplateRanking = {
  templateSlug: string;
  score: number;
  matchedFacets: string[];
};

export async function scoreTemplatesByFacets(args: {
  templateMethods: ReadonlyArray<{
    templateSlug: string;
    methods: ReadonlyArray<{ section: SectionId; slug: string }>;
  }>;
  facets: RequestedFacets;
}): Promise<TemplateRanking[] | null> {
  if (!isDatabaseConfigured()) return null;
  const requested = flattenRequestedFacets(args.facets);
  if (requested.length === 0) {
    return args.templateMethods.map((t) => ({
      templateSlug: t.templateSlug,
      score: 0,
      matchedFacets: [],
    }));
  }

  // Collect distinct (section, slug) pairs across all templates so we make
  // exactly one query.
  const sectionSlugSet = new Set<string>();
  for (const t of args.templateMethods) {
    for (const m of t.methods) {
      sectionSlugSet.add(`${m.section}:${m.slug}`);
    }
  }
  const sectionSlugPairs = Array.from(sectionSlugSet).map((key) => {
    const [section, slug] = key.split(":");
    return { section, slug };
  });
  if (sectionSlugPairs.length === 0) {
    return args.templateMethods.map((t) => ({
      templateSlug: t.templateSlug,
      score: 0,
      matchedFacets: [],
    }));
  }

  try {
    const rows = await prisma.methodFacet.findMany({
      where: {
        matches: true,
        AND: [
          { OR: sectionSlugPairs },
          { OR: requested.map(({ group, value }) => ({ group, value })) },
        ],
      },
      select: { section: true, slug: true, group: true, value: true },
    });

    // Build a lookup: (section,slug) -> Set of "<group>:<value>" matches.
    const matchesByMethod = new Map<string, Set<string>>();
    for (const row of rows) {
      const k = `${row.section}:${row.slug}`;
      const set = matchesByMethod.get(k) ?? new Set<string>();
      set.add(`${row.group}:${row.value}`);
      matchesByMethod.set(k, set);
    }

    return args.templateMethods.map((t) => {
      let score = 0;
      const matched: string[] = [];
      for (const m of t.methods) {
        const set = matchesByMethod.get(`${m.section}:${m.slug}`);
        if (!set) continue;
        for (const key of set) {
          score += 1;
          matched.push(`${m.section}:${m.slug}:${key}`);
        }
      }
      return { templateSlug: t.templateSlug, score, matchedFacets: matched };
    });
  } catch {
    return null;
  }
}
