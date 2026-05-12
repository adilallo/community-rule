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

export type ProfileRuleListItem = OwnerPublishedRuleListItem & {
  role: "owner" | "stakeholder";
};

/**
 * Published rules the user can access as an **accepted** stakeholder (`userId` set).
 * Same metadata shape as {@link listPublishedRulesForUser}; no `document`.
 */
export async function listStakeholderRulesForUser(
  userId: string,
  take: number,
): Promise<OwnerPublishedRuleListItem[] | null> {
  if (!isDatabaseConfigured()) return null;
  if (typeof userId !== "string" || userId.trim() === "") return null;
  const clamped = Math.min(Math.max(0, take), 100);
  if (clamped === 0) return [];
  try {
    const rows = await prisma.ruleStakeholder.findMany({
      where: { userId },
      take: clamped,
      orderBy: [{ rule: { updatedAt: "desc" } }, { id: "asc" }],
      select: {
        rule: { select: PUBLISHED_RULE_OWNER_LIST_SELECT },
      },
    });
    return rows.map((r) => r.rule);
  } catch {
    return null;
  }
}

/**
 * Profile list: owned rules plus stakeholder access, **owner wins** if both,
 * sorted by `updatedAt` desc (then `id`).
 */
export async function listProfileRulesForUser(
  userId: string,
  take: number,
): Promise<ProfileRuleListItem[] | null> {
  const cap = Math.min(Math.max(0, take), 100);
  if (cap === 0) return [];
  /** Merge then slice so ordering is global by `updatedAt`. */
  const fetchCap = 100;
  const [owned, stakeholderRules] = await Promise.all([
    listPublishedRulesForUser(userId, fetchCap),
    listStakeholderRulesForUser(userId, fetchCap),
  ]);
  if (owned === null || stakeholderRules === null) return null;
  const ownerIds = new Set(owned.map((r) => r.id));
  const stakeholderOnly = stakeholderRules.filter((r) => !ownerIds.has(r.id));
  const combined: ProfileRuleListItem[] = [
    ...owned.map((r) => ({ ...r, role: "owner" as const })),
    ...stakeholderOnly.map((r) => ({
      ...r,
      role: "stakeholder" as const,
    })),
  ];
  combined.sort((a, b) => {
    const t = b.updatedAt.getTime() - a.updatedAt.getTime();
    if (t !== 0) return t;
    return a.id.localeCompare(b.id);
  });
  return combined.slice(0, cap);
}
