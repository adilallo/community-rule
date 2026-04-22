import { prisma } from "./db";
import { isDatabaseConfigured } from "./env";

/**
 * Public fields safe to expose via the unauthenticated rule detail surfaces
 * (`GET /api/rules/[id]` and `/rules/[id]`). `userId` is intentionally omitted.
 */
const PUBLISHED_RULE_PUBLIC_SELECT = {
  id: true,
  title: true,
  summary: true,
  document: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type PublicPublishedRule = {
  id: string;
  title: string;
  summary: string | null;
  document: unknown;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Fetch a single published rule by id for public read surfaces.
 *
 * Returns `null` when the database is not configured, the id does not match
 * any row, or the query throws — callers render a 404 in all missing cases
 * and are expected to surface the "DB not configured" state separately if
 * they care about distinguishing it (the API route does; the page does not).
 */
export async function getPublicPublishedRuleById(
  id: string,
): Promise<PublicPublishedRule | null> {
  if (!isDatabaseConfigured()) return null;
  if (typeof id !== "string" || id.trim() === "") return null;
  try {
    const rule = await prisma.publishedRule.findUnique({
      where: { id },
      select: PUBLISHED_RULE_PUBLIC_SELECT,
    });
    return rule;
  } catch {
    return null;
  }
}
