/**
 * Governance template cards aligned with Figma Community-Rule-System node 21764-16435
 * (Card / Rule variants: icon + title + short description + surface color).
 *
 * Each slug is seeded in Prisma and links to `/create/review-template/[slug]`.
 */

export type GovernanceTemplateCatalogEntry = {
  slug: string;
  title: string;
  description: string;
  /** Tailwind background class — colors from Figma invert/brand surfaces */
  backgroundColor: string;
  /** Path under public/ for getAssetPath() — Figma Asset / Template Mark */
  iconPath: string;
  /**
   * When true, the templates grid shows the “RECOMMENDED” tag (facet-based
   * scores will set this in `ruleTemplateToGridEntry` when wired; catalog
   * entries omit unless intentionally static).
   */
  recommended?: boolean;
};

/** SVGs in `public/assets/template-mark/<slug>.svg` (kebab-case slug). */
export function governanceTemplateIconPath(slug: string): string {
  return `assets/template-mark/${slug}.svg`;
}

/**
 * Order matches the Figma stack (top → bottom).
 */
export const GOVERNANCE_TEMPLATE_CATALOG: GovernanceTemplateCatalogEntry[] = [
  {
    slug: "consensus",
    title: "Consensus",
    description:
      "Important decisions require unanimous agreement. Proposals pass only if no serious objections remain.",
    backgroundColor: "bg-[var(--color-surface-invert-positive-secondary)]",
    iconPath: governanceTemplateIconPath("consensus"),
  },
  {
    slug: "consensus-clusters",
    title: "Circles",
    description:
      "Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council.",
    backgroundColor: "bg-[var(--color-surface-invert-brand-teal)]",
    iconPath: governanceTemplateIconPath("consensus-clusters"),
  },
  {
    slug: "solidarity-network",
    title: "Solidarity Network",
    description:
      "Power is held by autonomous \"cells.\" A central hub acts as a switchboard for resources but cannot dictate cell activities.",
    backgroundColor: "bg-[var(--color-surface-invert-positive-primary)]",
    iconPath: governanceTemplateIconPath("solidarity-network"),
  },
  {
    slug: "sortition-jury",
    title: "Sortition (Jury)",
    description:
      "A representative sample of the community is chosen by lottery to form a temporary council.",
    backgroundColor: "bg-[var(--color-surface-invert-brand-lavender)]",
    iconPath: governanceTemplateIconPath("sortition-jury"),
  },
  {
    slug: "liquid-democracy",
    title: "Liquid Democracy",
    description:
      "Members can vote directly or delegate their vote to a trusted peer on a per-topic basis.",
    backgroundColor: "bg-[var(--color-surface-invert-brand-kiwi)]",
    iconPath: governanceTemplateIconPath("liquid-democracy"),
  },
  {
    slug: "do-ocracy",
    title: "Do-ocracy",
    description:
      "Authority is granted to those doing the work. If you do the task, you decide how it gets done.",
    backgroundColor: "bg-[var(--color-surface-invert-brand-royal)]",
    iconPath: governanceTemplateIconPath("do-ocracy"),
  },
  {
    slug: "quadratic-governance",
    title: "Quadratic Governance",
    description:
      "Voting cost is squared (V²), preventing a majority from steamrolling a passionate minority.",
    backgroundColor: "bg-[var(--color-surface-invert-brand-secondary)]",
    iconPath: governanceTemplateIconPath("quadratic-governance"),
  },
  {
    slug: "federated-clusters",
    title: "Federated Clusters",
    description:
      "Independent groups share a central brand/charter but have total autonomy over internal rules.",
    backgroundColor: "bg-[var(--color-surface-invert-brand-primary)]",
    iconPath: governanceTemplateIconPath("federated-clusters"),
  },
  {
    slug: "devolution",
    title: "Devolution",
    description:
      "Starts as a Dictatorship for speed, moving to a Board, and finally to full community ownership.",
    backgroundColor: "bg-[var(--color-surface-invert-negative-secondary)]",
    iconPath: governanceTemplateIconPath("devolution"),
  },
  {
    slug: "benevolent-dictator",
    title: "Benevolent Dictator",
    description:
      "A single individual holds ultimate power, usually intended as a temporary state until the project is stable.",
    backgroundColor: "bg-[var(--color-surface-invert-negative-primary)]",
    iconPath: governanceTemplateIconPath("benevolent-dictator"),
  },
  {
    slug: "petition",
    title: "Petition",
    description:
      "Any participant can propose a rule change. If enough sign it, it goes to a general vote.",
    backgroundColor: "bg-[var(--color-surface-invert-brand-teal)]",
    iconPath: governanceTemplateIconPath("petition"),
  },
  {
    slug: "self-appointed-board",
    title: "Self-Appointed Board",
    description:
      "An existing board selects its own successors to preserve a specific mission over time.",
    backgroundColor: "bg-[var(--color-surface-invert-brand-rust)]",
    iconPath: governanceTemplateIconPath("self-appointed-board"),
  },
  {
    slug: "elected-board",
    title: "Elected Board",
    description:
      "An elected board determines policies and organizes their implementation.",
    backgroundColor: "bg-[var(--color-surface-invert-warning-secondary)]",
    iconPath: governanceTemplateIconPath("elected-board"),
  },
];

const bySlug = new Map(
  GOVERNANCE_TEMPLATE_CATALOG.map((e) => [e.slug, e] as const),
);

/**
 * Order for the home “Popular templates” row (four cards). Must match catalog slugs.
 */
export const GOVERNANCE_TEMPLATE_HOME_SLUGS: readonly string[] = [
  "consensus-clusters",
  "consensus",
  "elected-board",
  "petition",
];

export function getGovernanceTemplatesForHome(): GovernanceTemplateCatalogEntry[] {
  return GOVERNANCE_TEMPLATE_HOME_SLUGS.map((slug) => {
    const e = bySlug.get(slug);
    if (!e) {
      throw new Error(`governanceTemplateCatalog: missing slug "${slug}"`);
    }
    return e;
  });
}

export function getGovernanceTemplateCatalogEntry(
  slug: string,
): GovernanceTemplateCatalogEntry | undefined {
  return bySlug.get(slug);
}
