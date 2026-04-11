import { PrismaClient, type Prisma } from "@prisma/client";

/**
 * Curated rule templates for GET /api/templates.
 * Home “Popular templates” list uses `lib/templates/governanceTemplateCatalog.ts` (Figma 21764-16435);
 * DB titles/descriptions should stay aligned with `governanceTemplateCatalog.ts`.
 * `body.sections` use the same category row labels as the final-review RuleCard
 * (Values, Communication, Membership, Decision-making, Conflict management) so
 * template review matches that layout; `entries[].title` = chip labels, `body` = long text for documents.
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
    body: {
      sections: [
        {
          categoryName: "Values",
          entries: [
            {
              title: "Distributed authority",
              body: "Authority lives in Circles close to the work. Domains are explicit so power is visible and negotiable.",
            },
            {
              title: "Transparency",
              body: "Decisions, roles, and metrics that affect members are easy to find and updated regularly.",
            },
            {
              title: "Equivalence",
              body: "Policy affects people in proportion to their stake; no silent vetoes from outside a domain.",
            },
          ],
        },
        {
          categoryName: "Communication",
          entries: [
            {
              title: "Circle channels",
              body: "Each Circle maintains channels for async updates and synchronous sense-making.",
            },
            {
              title: "Council cadence",
              body: "The Council meets on a fixed rhythm to align strategy, resolve overlaps, and hear escalations.",
            },
          ],
        },
        {
          categoryName: "Membership",
          entries: [
            {
              title: "Circle membership",
              body: "People join Circles by agreement of that Circle and clarity on domain contribution.",
            },
            {
              title: "Link roles",
              body: "Members link Circles as delegates or representatives when decisions span domains.",
            },
          ],
        },
        {
          categoryName: "Decision-making",
          entries: [
            {
              title: "Consent within Circles",
              body: "Circles act when there is no reasoned objection from anyone in the Circle with a stake.",
            },
            {
              title: "Cross-domain consent",
              body: "When work spans Circles, proposals include impacted domains and integrate their concerns.",
            },
          ],
        },
        {
          categoryName: "Conflict management",
          entries: [
            {
              title: "Objection testing",
              body: "Objections must show how a proposal fails the aim or creates harm; the group integrates or adapts.",
            },
            {
              title: "Mediation",
              body: "Facilitators help parties hear each other before escalating to Council or broader processes.",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "consensus",
    title: "Consensus",
    category: "Governance pattern",
    description:
      "Important decisions require broad agreement. Proposals move forward when serious objections are resolved and the group can stand behind the outcome.",
    sortOrder: 1,
    featured: true,
    body: {
      sections: [
        {
          categoryName: "Values",
          entries: [
            {
              title: "Consciousness",
              body: "We make decisions with awareness of impact on people, ecosystems, and future generations.",
            },
            {
              title: "Ecology",
              body: "We design governance to reduce harm and regenerate the systems we depend on.",
            },
            {
              title: "Abundance",
              body: "We assume enough for needs when resources are shared fairly and waste is reduced.",
            },
            {
              title: "Art",
              body: "We leave room for creativity, culture, and expression in how we organize.",
            },
            {
              title: "Decisiveness",
              body: "We balance care with forward motion—clear timelines and roles prevent endless loops.",
            },
          ],
        },
        {
          categoryName: "Communication",
          entries: [
            {
              title: "Signal",
              body: "We use Signal (or equivalent) for sensitive coordination and timely member updates.",
            },
          ],
        },
        {
          categoryName: "Membership",
          entries: [
            {
              title: "Open Admission",
              body: "People who share our values and agree to practices can participate without unnecessary gatekeeping.",
            },
          ],
        },
        {
          categoryName: "Decision-making",
          entries: [
            {
              title: "Lazy Consensus",
              body: "Proposals advance if no blocking concern is raised within the discussion window.",
            },
            {
              title: "Modified Consensus",
              body: "For larger decisions we use structured consensus with documented objections and integration steps.",
            },
          ],
        },
        {
          categoryName: "Conflict management",
          entries: [
            {
              title: "Code of Conduct",
              body: "We uphold a code of conduct that sets expectations and pathways for accountability.",
            },
            {
              title: "Restorative Justice",
              body: "When harm occurs we prioritize repair, learning, and changed conditions over punishment.",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "elected-board",
    title: "Elected Board",
    category: "Governance pattern",
    description:
      "Members elect a board to steward policy and operations. The board coordinates implementation and remains accountable through transparent reporting and elections.",
    sortOrder: 2,
    featured: true,
    body: {
      sections: [
        {
          categoryName: "Values",
          entries: [
            {
              title: "Accountability",
              body: "The board answers to the membership through elections, published decisions, and recall where applicable.",
            },
            {
              title: "Service",
              body: "Board service is a temporary duty with term limits and clarity on scope of authority.",
            },
          ],
        },
        {
          categoryName: "Communication",
          entries: [
            {
              title: "Board minutes",
              body: "Minutes summarize decisions, rationales, and next steps; members can access them on a regular cadence.",
            },
            {
              title: "Member forums",
              body: "The board hosts open sessions for questions, priorities, and feedback from the membership.",
            },
          ],
        },
        {
          categoryName: "Membership",
          entries: [
            {
              title: "Eligibility to vote",
              body: "Voting members are defined clearly; associate or advisory roles are distinguished from full votes.",
            },
            {
              title: "Board terms",
              body: "Staggered terms keep continuity while refreshing leadership on a predictable schedule.",
            },
          ],
        },
        {
          categoryName: "Decision-making",
          entries: [
            {
              title: "Board vote",
              body: "The board decides matters in its charter by majority or supermajority as specified.",
            },
            {
              title: "Member ratification",
              body: "Major structural changes require member approval according to your bylaws.",
            },
          ],
        },
        {
          categoryName: "Conflict management",
          entries: [
            {
              title: "Recusal",
              body: "Directors recuse themselves when personal or financial conflicts appear.",
            },
            {
              title: "Appeals",
              body: "Members can appeal board decisions through a defined, fair process.",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "petition",
    title: "Petition",
    category: "Governance pattern",
    description:
      "Any participant can propose a rule change. If enough sign it, it goes to a general vote.",
    sortOrder: 3,
    featured: true,
    body: {
      sections: [
        {
          categoryName: "Values",
          entries: [
            {
              title: "Open participation",
              body: "Legitimate voices can bring proposals without needing informal gatekeepers.",
            },
            {
              title: "Legitimacy",
              body: "Outcomes are trusted when process, quorum, and notice rules are followed consistently.",
            },
          ],
        },
        {
          categoryName: "Communication",
          entries: [
            {
              title: "Discussion period",
              body: "Every proposal has a visible discussion window before voting closes.",
            },
            {
              title: "Announcements",
              body: "Calls to vote and results are posted where all participants can see them.",
            },
          ],
        },
        {
          categoryName: "Membership",
          entries: [
            {
              title: "Voting pool",
              body: "Who may vote is explicit (e.g. members in good standing for 30 days).",
            },
            {
              title: "Quorum",
              body: "Votes count only when quorum is met so decisions reflect an engaged subset.",
            },
          ],
        },
        {
          categoryName: "Decision-making",
          entries: [
            {
              title: "Petition threshold",
              body: "Sponsors or seconders may be required so proposals show a minimal base of support.",
            },
            {
              title: "Majority rules",
              body: "Adoption thresholds (simple majority, supermajority) are defined per decision type.",
            },
          ],
        },
        {
          categoryName: "Conflict management",
          entries: [
            {
              title: "Good faith",
              body: "Debate focuses on substance; harassment or bad-faith tactics are addressed under conduct policies.",
            },
            {
              title: "Ombuds",
              body: "A neutral contact helps people navigate disputes about process or interpretation.",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "solidarity-network",
    title: "Solidarity Network",
    category: "Governance pattern",
    description:
      'Power is held by autonomous "cells." A central hub acts as a switchboard for resources but cannot dictate cell activities.',
    sortOrder: 4,
    featured: false,
    body: governancePatternBody(
      'Power is held by autonomous "cells." A central hub acts as a switchboard for resources but cannot dictate cell activities.',
    ),
  },
  {
    slug: "sortition-jury",
    title: "Sortition (Jury)",
    category: "Governance pattern",
    description:
      "A representative sample of the community is chosen by lottery to form a temporary council.",
    sortOrder: 5,
    featured: false,
    body: governancePatternBody(
      "A representative sample of the community is chosen by lottery to form a temporary council.",
    ),
  },
  {
    slug: "liquid-democracy",
    title: "Liquid Democracy",
    category: "Governance pattern",
    description:
      "Members can vote directly or delegate their vote to a trusted peer on a per-topic basis.",
    sortOrder: 6,
    featured: false,
    body: governancePatternBody(
      "Members can vote directly or delegate their vote to a trusted peer on a per-topic basis.",
    ),
  },
  {
    slug: "do-ocracy",
    title: "Do-ocracy",
    category: "Governance pattern",
    description:
      "Authority is granted to those doing the work. If you do the task, you decide how it gets done.",
    sortOrder: 7,
    featured: false,
    body: governancePatternBody(
      "Authority is granted to those doing the work. If you do the task, you decide how it gets done.",
    ),
  },
  {
    slug: "quadratic-governance",
    title: "Quadratic Governance",
    category: "Governance pattern",
    description:
      "Voting cost is squared (V²), preventing a majority from steamrolling a passionate minority.",
    sortOrder: 8,
    featured: false,
    body: governancePatternBody(
      "Voting cost is squared (V²), preventing a majority from steamrolling a passionate minority.",
    ),
  },
  {
    slug: "federated-clusters",
    title: "Federated Clusters",
    category: "Governance pattern",
    description:
      "Independent groups share a central brand/charter but have total autonomy over internal rules.",
    sortOrder: 9,
    featured: false,
    body: governancePatternBody(
      "Independent groups share a central brand/charter but have total autonomy over internal rules.",
    ),
  },
  {
    slug: "devolution",
    title: "Devolution",
    category: "Governance pattern",
    description:
      "Starts as a Dictatorship for speed, moving to a Board, and finally to full community ownership.",
    sortOrder: 10,
    featured: false,
    body: governancePatternBody(
      "Starts as a Dictatorship for speed, moving to a Board, and finally to full community ownership.",
    ),
  },
  {
    slug: "benevolent-dictator",
    title: "Benevolent Dictator",
    category: "Governance pattern",
    description:
      "A single individual holds ultimate power, usually intended as a temporary state until the project is stable.",
    sortOrder: 11,
    featured: false,
    body: governancePatternBody(
      "A single individual holds ultimate power, usually intended as a temporary state until the project is stable.",
    ),
  },
  {
    slug: "self-appointed-board",
    title: "Self-Appointed Board",
    category: "Governance pattern",
    description:
      "An existing board selects its own successors to preserve a specific mission over time.",
    sortOrder: 12,
    featured: false,
    body: governancePatternBody(
      "An existing board selects its own successors to preserve a specific mission over time.",
    ),
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
