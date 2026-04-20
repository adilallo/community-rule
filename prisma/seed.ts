import { PrismaClient, type Prisma } from "@prisma/client";
import { seedMethodFacets } from "./seed/methodFacets";

/**
 * Curated rule templates for GET /api/templates.
 * Home “Popular templates” list uses `lib/templates/governanceTemplateCatalog.ts` (Figma 21764-16435);
 * DB titles/descriptions should stay aligned with `governanceTemplateCatalog.ts`.
 * `body.sections` use the same category row labels as the final-review RuleCard
 * (Values, Communication, Membership, Decision-making, Conflict management) so
 * template review matches that layout; `entries[].title` = chip labels, `body` = supporting text.
 * Chip titles per template are sourced from the product **Template Composition** workbook (xlsx column
 * layout: Decision-making, Membership Policies, Values, Communication, Conflict Management), mapped in
 * `COMPOSITION_BY_SLUG` below.
 */

/** Starter `body` for catalog templates — five category rows match template review / final-review layout. */
function governancePatternBody(coreValues: string): Prisma.InputJsonValue {
  return {
    sections: [
      {
        categoryName: "Values",
        entries: [{ title: "Core stance", body: coreValues }],
      },
      {
        categoryName: "Communication",
        entries: [
          {
            title: "Transparency",
            body: "Updates and decisions are shared through agreed channels so members stay aligned.",
          },
        ],
      },
      {
        categoryName: "Membership",
        entries: [
          {
            title: "Participation",
            body: "Roles and eligibility are explicit so people know how to take part.",
          },
        ],
      },
      {
        categoryName: "Decision-making",
        entries: [
          {
            title: "Process",
            body: "Steps are documented so legitimacy stays high as you scale.",
          },
        ],
      },
      {
        categoryName: "Conflict management",
        entries: [
          {
            title: "Resolution",
            body: "Disputes use fair, documented paths before they harden into splits.",
          },
        ],
      },
    ],
  };
}

/** Chip copy from Template Composition.xlsx (Decision-making, Membership, Values, Communication, Conflict). */
const COMPOSITION_CHIP_BODY =
  "Suggested focus for this governance area. Replace with your own language in the create flow.";

function entriesFromCompositionCell(cell: string): { title: string; body: string }[] {
  const trimmed = cell.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/,\s*/)
    .map((title) => title.trim())
    .filter(Boolean)
    .map((title) => ({ title, body: COMPOSITION_CHIP_BODY }));
}

function bodyFromXlsxComposition(row: {
  decisionMaking: string;
  membership: string;
  values: string;
  communication: string;
  conflict: string;
}): Prisma.InputJsonValue {
  return {
    sections: [
      { categoryName: "Values", entries: entriesFromCompositionCell(row.values) },
      {
        categoryName: "Communication",
        entries: entriesFromCompositionCell(row.communication),
      },
      {
        categoryName: "Membership",
        entries: entriesFromCompositionCell(row.membership),
      },
      {
        categoryName: "Decision-making",
        entries: entriesFromCompositionCell(row.decisionMaking),
      },
      {
        categoryName: "Conflict management",
        entries: entriesFromCompositionCell(row.conflict),
      },
    ],
  };
}

/**
 * Curated template chip rows — sourced from product Template Composition.xlsx
 * (Governance Template × category columns).
 */
const COMPOSITION_BY_SLUG: Record<
  string,
  {
    decisionMaking: string;
    membership: string;
    values: string;
    communication: string;
    conflict: string;
  }
> = {
  consensus: {
    decisionMaking: "Consensus Decision-Making, Modified Consensus",
    membership: "Consensus or Vote-Based Approval, Peer Sponsorship",
    values: "Consensus, Community Care, Horizontalism",
    communication: "In-Person Meetings, Loomio",
    conflict: "Consensus Building, Facilitated Negotiation",
  },
  "consensus-clusters": {
    decisionMaking: "Sociocracy, Holacracy",
    membership: "Contribution Based, Orientation Required",
    values: "Decentralization, Adaptability, Autonomy",
    communication: "Slack, Matrix / Element",
    conflict: "Circle Processes, Restorative Practices",
  },
  "solidarity-network": {
    decisionMaking: "Do-ocracy, Modified Consensus",
    membership: "Open Access, Peer Sponsorship",
    values: "Solidarity, Mutual Aid, Anti-oppression",
    communication: "Signal, Matrix / Element",
    conflict: "Peer Mediation, Restorative Practices",
  },
  "sortition-jury": {
    decisionMaking: "Lottery/Sortition, Deliberative Polling",
    membership: "Lottery / Sortition",
    values: "Fairness, Equity, Transparency",
    communication: "In-Person Meetings, Video Meetings",
    conflict: "Lottery/Sortition, Rotational Judging",
  },
  "liquid-democracy": {
    decisionMaking: "Delegated Decision-Making, Continuous Voting",
    membership: "Identity Verification, Open Access",
    values: "Agency, Flexibility, Transparency",
    communication: "Loomio, Discourse (Forum)",
    conflict: "Ad Hoc Arbitration, Peer Mediation",
  },
  "do-ocracy": {
    decisionMaking: "Do-ocracy, Lazy Consensus",
    membership: "Contribution Based, Skill-Based Contribution",
    values: "Agency, Autonomy, Voluntarism",
    communication: "GitHub / GitLab, Discord",
    conflict: "Peer Mediation, Facilitated Negotiation",
  },
  "quadratic-governance": {
    decisionMaking: "Quadratic Voting",
    membership: "Identity Verification, Pay-to-Join",
    values: "Fairness, Innovation, Independence",
    communication: "Discourse (Forum), Discord",
    conflict: "Supermajority Vote, Conflict Resolution Council",
  },
  "federated-clusters": {
    decisionMaking: "Consensus Seeking with Delegates",
    membership: "Hybrid Approval Process, Membership Agreement or Pledge",
    values: "Interoperability, Localism, Interdependence",
    communication: "Matrix / Element, Discourse (Forum)",
    conflict: "Internal Tribunal, Ad Hoc Arbitration",
  },
  devolution: {
    decisionMaking: "Autocratic Decision-Making, Delegated Decision-Making",
    membership: "Invitation Only, Open Access",
    values: "Capacity Building, Education, Maintenance",
    communication: "Discord, GitHub / GitLab",
    conflict: "Conflict Workshops, Managerial Decision",
  },
  "benevolent-dictator": {
    decisionMaking: "Autocratic Decision-Making, Hierarchical Decision-Making",
    membership: "Invitation Only, Mentorship",
    values: "Reliability, Stewardship, Leadership",
    communication: "Email Distribution List, GitHub / GitLab",
    conflict: "Managerial Decision, Binding Contracts",
  },
  petition: {
    decisionMaking: "Ranked Choice Voting, Majority Rule",
    membership: "Open Access, Identity Verification",
    values: "Freedom of Information, Accountability, Participation",
    communication: "Loomio, Discourse (Forum)",
    conflict: "Supermajority Vote, Binding Arbitration",
  },
  "self-appointed-board": {
    decisionMaking: "Advisory Committees, Executive Committees",
    membership: "Invitation Only, Application & Review",
    values: "Stewardship, Resilience, Reliability",
    communication: "Video Meetings, Email Distribution List",
    conflict: "Judicial Committees, Internal Tribunal",
  },
  "elected-board": {
    decisionMaking: "Elected Board of Directors, Majority Rule",
    membership: "Application & Review, Membership Agreement or Pledge",
    values: "Accountability, Transparency, Trust",
    communication: "Email Distribution List, Slack",
    conflict: "Conflict Resolution Council, Mediation",
  },
};

function bodyFromSlugComposition(slug: string): Prisma.InputJsonValue {
  const row = COMPOSITION_BY_SLUG[slug];
  if (!row) {
    return governancePatternBody("Template composition pending.");
  }
  return bodyFromXlsxComposition(row);
}

const TEMPLATES: {
  slug: string;
  title: string;
  category: string;
  description: string;
  sortOrder: number;
  featured: boolean;
  body: Prisma.InputJsonValue;
}[] = [
  {
    slug: "consensus-clusters",
    title: "Circles",
    category: "Governance pattern",
    description:
      "Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council.",
    sortOrder: 0,
    featured: true,
    body: bodyFromSlugComposition("consensus-clusters"),
  },
  {
    slug: "consensus",
    title: "Consensus",
    category: "Governance pattern",
    description:
      "Important decisions require unanimous agreement. Proposals pass only if no serious objections remain.",
    sortOrder: 1,
    featured: true,
    body: bodyFromSlugComposition("consensus"),
  },
  {
    slug: "elected-board",
    title: "Elected Board",
    category: "Governance pattern",
    description:
      "An elected board determines policies and organizes their implementation.",
    sortOrder: 2,
    featured: true,
    body: bodyFromSlugComposition("elected-board"),
  },
  {
    slug: "petition",
    title: "Petition",
    category: "Governance pattern",
    description:
      "Any participant can propose a rule change. If enough sign it, it goes to a general vote.",
    sortOrder: 3,
    featured: true,
    body: bodyFromSlugComposition("petition"),
  },
  {
    slug: "solidarity-network",
    title: "Solidarity Network",
    category: "Governance pattern",
    description:
      'Power is held by autonomous "cells." A central hub acts as a switchboard for resources but cannot dictate cell activities.',
    sortOrder: 4,
    featured: false,
    body: bodyFromSlugComposition("solidarity-network"),
  },
  {
    slug: "sortition-jury",
    title: "Sortition (Jury)",
    category: "Governance pattern",
    description:
      "A representative sample of the community is chosen by lottery to form a temporary council.",
    sortOrder: 5,
    featured: false,
    body: bodyFromSlugComposition("sortition-jury"),
  },
  {
    slug: "liquid-democracy",
    title: "Liquid Democracy",
    category: "Governance pattern",
    description:
      "Members can vote directly or delegate their vote to a trusted peer on a per-topic basis.",
    sortOrder: 6,
    featured: false,
    body: bodyFromSlugComposition("liquid-democracy"),
  },
  {
    slug: "do-ocracy",
    title: "Do-ocracy",
    category: "Governance pattern",
    description:
      "Authority is granted to those doing the work. If you do the task, you decide how it gets done.",
    sortOrder: 7,
    featured: false,
    body: bodyFromSlugComposition("do-ocracy"),
  },
  {
    slug: "quadratic-governance",
    title: "Quadratic Governance",
    category: "Governance pattern",
    description:
      "Voting cost is squared (V²), preventing a majority from steamrolling a passionate minority.",
    sortOrder: 8,
    featured: false,
    body: bodyFromSlugComposition("quadratic-governance"),
  },
  {
    slug: "federated-clusters",
    title: "Federated Clusters",
    category: "Governance pattern",
    description:
      "Independent groups share a central brand/charter but have total autonomy over internal rules.",
    sortOrder: 9,
    featured: false,
    body: bodyFromSlugComposition("federated-clusters"),
  },
  {
    slug: "devolution",
    title: "Devolution",
    category: "Governance pattern",
    description:
      "Starts as a Dictatorship for speed, moving to a Board, and finally to full community ownership.",
    sortOrder: 10,
    featured: false,
    body: bodyFromSlugComposition("devolution"),
  },
  {
    slug: "benevolent-dictator",
    title: "Benevolent Dictator",
    category: "Governance pattern",
    description:
      "A single individual holds ultimate power, usually intended as a temporary state until the project is stable.",
    sortOrder: 11,
    featured: false,
    body: bodyFromSlugComposition("benevolent-dictator"),
  },
  {
    slug: "self-appointed-board",
    title: "Self-Appointed Board",
    category: "Governance pattern",
    description:
      "An existing board selects its own successors to preserve a specific mission over time.",
    sortOrder: 12,
    featured: false,
    body: bodyFromSlugComposition("self-appointed-board"),
  },
];

const prisma = new PrismaClient();

async function main() {
  for (const row of TEMPLATES) {
    const { slug, title, category, description, sortOrder, featured, body } =
      row;
    await prisma.ruleTemplate.upsert({
      where: { slug },
      create: {
        slug,
        title,
        category,
        description,
        sortOrder,
        featured,
        body,
      },
      update: {
        title,
        category,
        description,
        sortOrder,
        featured,
        body,
      },
    });
  }

  const facetSeed = await seedMethodFacets(prisma);
  // eslint-disable-next-line no-console -- seed CLI feedback
  console.log(
    `Seeded MethodFacet rows: ${Object.entries(facetSeed.rowsBySection)
      .map(([section, count]) => `${section}=${count}`)
      .join(", ")}`,
  );
}

main()
  .then(() => {
    // eslint-disable-next-line no-console -- seed CLI feedback
    console.log(`Seeded ${TEMPLATES.length} rule template(s).`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
