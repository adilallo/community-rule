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

/** Metadata for signed-in “my rules” profile list (no full `document` JSON). */
const PUBLISHED_RULE_OWNER_LIST_SELECT = {
  id: true,
  title: true,
  summary: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type OwnerPublishedRuleListItem = {
  id: string;
  title: string;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Lists published rules owned by the given user (**most recently updated first**,
 * then stable `id` tie-break).
 * Returns `null` when the database is not configured or the query throws.
 */
export async function listPublishedRulesForUser(
  userId: string,
  take: number,
): Promise<OwnerPublishedRuleListItem[] | null> {
  if (!isDatabaseConfigured()) return null;
  if (typeof userId !== "string" || userId.trim() === "") return null;
  const clamped = Math.min(Math.max(0, take), 100);
  if (clamped === 0) return [];
  try {
    return await prisma.publishedRule.findMany({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: clamped,
      select: PUBLISHED_RULE_OWNER_LIST_SELECT,
    });
  } catch {
    return null;
  }
}
