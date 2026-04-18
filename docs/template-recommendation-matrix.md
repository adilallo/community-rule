# Template Recommendation Matrix — Implementation Context (CR-88)

**Status:** Draft / context doc. Reference only — not yet implemented.
**Linear:** [CR-88](https://linear.app/community-rule/issue/CR-88/backend-template-recommendation-matrix-xlsx-sheets-ingestion)
**Roadmap:** [`docs/backend-roadmap.md`](backend-roadmap.md) §4 (`RuleTemplate`) and §13.
**Spec ticket:** [`docs/backend-linear-tickets.md`](backend-linear-tickets.md) Ticket 16.

This doc consolidates the **four product-authored matrix spreadsheets** with the
**existing data model, create-flow facets, and section structure** so we have a
single reference while implementing the importer + recommendation API.

> **Scope note:** No data, API, or UI surface for this feature is in production
> yet. **Backwards compatibility is not a constraint** — we will replace the
> hand-typed `prisma/seed.ts` `COMPOSITION_BY_SLUG` map, the existing
> `GET /api/templates` response shape, and the static `messages/en/create/*.json`
> card decks where it makes the design cleaner.

---

## 1. Goal (one paragraph)

Replace the hand-curated `prisma/seed.ts` `COMPOSITION_BY_SLUG` map with a
**spreadsheet-authored matrix** for each rule section
(Communication, Membership, Decision-making, Conflict management — and later
Values), where each row is a **method/pattern card** and each column is either
**long-form copy that populates the card UI** or a **facet flag** (✓/x or score)
that the recommendation engine uses to filter and rank cards based on the
user's create-flow answers (community size, organization type, location/scale,
maturity).

The same authoring contract should make it trivial for product to ship updated
spreadsheets and have the create-flow card decks (and the home/templates page
recommendations) update without any code changes.

---

## 2. The four spreadsheets

All four xlsx files share **the same column shape**: leading **content
columns** + trailing **facet columns** (✓ / x cells). Sheet name is `Current`
in every workbook.

### 2.1 Shared facet columns (last 19, identical across the four sheets)

Order is preserved here because the columns are positional in the sheets:

| # | Column header (xlsx) | Maps to wizard step / state field | Wizard chip label (`messages/en/create/...`) |
|---|---|---|---|
| 1 | `1 member` | `community-size` → `selectedCommunitySizeIds` (id `"1"`) | `1 member` |
| 2 | `2-5 members` | id `"2"` | `2-5 members` |
| 3 | `6-12 members` | id `"3"` | `6-12 members` |
| 4 | `13-100 members` | id `"4"` | `13-100 members` |
| 5 | `100-100,000 members` | id `"5"` | `100-100,000 members` |
| 6 | `Organization Type:DAO` (or `DAO` in conflict/comms/membership) | `community-structure` → `selectedOrganizationTypeIds` (id `"6"` in `organizationTypes`) | `DAO` |
| 7 | `Organization Type:For profit business` (or `For profit business`) | id `"5"` in `organizationTypes` | `For profit business` |
| 8 | `Organization Type:Nonprofit` (or `Nonprofit`) | id `"4"` in `organizationTypes` | `Nonprofit` |
| 9 | `Organization Type:Open source project` (or `Open source project`) | id `"3"` | `Open source project` |
| 10 | `Organization Type:Mutual aid` (or `Mutual aid`) | id `"2"` | `Mutual aid` |
| 11 | `Organization Type: Worker’s coop` (or `Worker’s coop`) | id `"1"` | `Worker’s coop` |
| 12 | `Location: Global` (or `Global`) | `community-structure` → `selectedScaleIds` (id `"4"` in `scaleOptions`) | `Global` |
| 13 | `Location: National` (or `National`) | id `"3"` | `National` |
| 14 | `Location: Regional` (or `Regional`) | id `"2"` | `Regional` |
| 15 | `Location: Local` (or `Local`) | id `"1"` | `Local` |
| 16 | `Organizational Maturity: Early stage` (or `Early stage`) | `community-structure` → `selectedMaturityIds` (id `"1"` in `maturityOptions`) | `Early stage` |
| 17 | `Organizational Maturity: Growth stage` (or `Growth stage`) | id `"2"` | `Growth stage` |
| 18 | `Organizational Maturity: Established` (or `Established`) | id `"3"` | `Established` |
| 19 | `Organizational Maturity: Enterprise` (or `Enterprise`) | id `"4"` | `Enterprise` |

**Important normalization rules (importer must enforce):**

- Decision-making prefixes columns with `Organization Type:`, `Location:`,
  `Organizational Maturity:`. The other three sheets drop the prefix. Importer
  should normalize to a single canonical key (e.g.
  `orgType.workersCoop`, `scale.local`, `maturity.earlyStage`, `size.6_12`).
- Cell value semantics: `✓` → match, `x` (lowercase) → no match, blank → no
  match, numbers → optional weighted score (only `Decision-making.xlsx` row 32
  contains a non-symbol cell — `"Military, Corporations"` in the size column —
  see §2.4 data-quality issues).
- Wizard chip ids are **positional 1..N** within each `messages/en/create/*`
  array (see `chipRowsFromLabels` in
  `app/create/screens/select/CommunityStructureSelectScreen.tsx` lines 49–57).
  The importer should emit a stable lookup table mapping
  `(facetGroup, label) → wizardChipId` so the recommendation engine can match
  a user's `selectedXxxIds` against the matrix without depending on label
  spelling.
- Curly apostrophes appear in `Worker’s coop`. Compare on a normalized key,
  not on raw label.

### 2.2 Communication Methods (`Communication Methods.xlsx`, sheet `Current`)

Maps 1:1 to `messages/en/create/communication.json` and the
`communication-methods` step
(`app/create/screens/card/CommunicationMethodsScreen.tsx`).

**Content columns (positions 1–5):**

| Sheet column | Card field |
|---|---|
| `Label` | `cards[<id>].label` and `modals[<id>].title` |
| `Description` | `cards[<id>].supportText` and `modals[<id>].description` |
| `Core Principle & Scope` | `modals[<id>].sections.corePrinciple` |
| `Logistics, Admin & Norms` | `modals[<id>].sections.logisticsAdmin` |
| `Code of Conduct` | `modals[<id>].sections.codeOfConduct` |

`SECTION_FIELDS = ["corePrinciple", "logisticsAdmin", "codeOfConduct"]` is
the source of truth (`CommunicationMethodsScreen.tsx`).

**Card rows (11):** In-Person Meetings · Signal · Video Meetings · Loomio ·
Matrix / Element · GitHub / GitLab · Discord · Email Distribution List · Slack
· WhatsApp · Discourse (Forum).

### 2.3 Membership / Group-Membership (`Group_Membership_Methods.xlsx`, sheet `Current`)

Maps to the `membership-methods` step
(`app/create/screens/card/MembershipMethodsScreen.tsx`) and
`messages/en/create/membership.json`.

**Content columns (positions 1–5):**

| Sheet column | Card field (proposed naming) |
|---|---|
| `Label` | `cards[<id>].label` / modal title |
| `Description` | `cards[<id>].supportText` / modal description |
| `Eligibility & Philosophy` | modal section A (`eligibilityPhilosophy`) |
| `Joining Process` | modal section B (`joiningProcess`) |
| `Expectations & Removal` | modal section C (`expectationsRemoval`) |

**Card rows (19):** Open Access · Orientation Required · Invitation Only ·
Contribution Based · Mentorship · Peer Sponsorship · Consensus or Vote-Based
Approval · Trial Period / Provisional Membership · Referral System with
Screening · Membership Agreement or Pledge · Weighted or Tiered Membership ·
Hybrid Approval Process · Skill-Based Contribution · Pay-to-Join · Application
& Review · Identity Verification · Collective Interviews · Skill-Based
Evaluation · Lottery / Sortition.

> The wizard's existing `membership.json` modal section keys do not yet match
> these. Since backwards compatibility is not a constraint, **rename the
> wizard's section keys to match the matrix** (`eligibilityPhilosophy` /
> `joiningProcess` / `expectationsRemoval`) when wiring this up — the existing
> copy is placeholder.

### 2.4 Decision-making (`Decision-making.xlsx`, sheet `Current`)

Maps to the `decision-approaches` step
(`app/create/screens/right-rail/DecisionApproachesScreen.tsx`) and
`messages/en/create/rightRail.json`.

**Content columns (positions 1–7):**

| Sheet column | Card field (proposed naming) |
|---|---|
| `Label` | card title |
| `Description` | card support text |
| `Core Principle` | modal section A (`corePrinciple`) |
| `Applicable Scope` | modal section B (`applicableScope`) — free-text examples, e.g. `"Daily Operations, Minor Expenditures"` |
| `Consensus Level` | numeric 0.0–1.0 stored under `scalars.consensusLevel` (e.g. `0.51`, `0.67`, `1.0`) — drives the **Consensus axis** in any future visual sort/filter |
| `Step-by-Step Instructions` | modal section C (`stepByStep`) |
| `Objections & Deadlocks` | modal section D (`objectionsDeadlocks`) |

**Card rows (32):** Lazy Consensus · Do-ocracy · Consensus Decision-Making ·
Rotational Leadership · Modified Consensus · Consensus Seeking with Delegates
· Sociocracy · Supermajority Rule · Ranked Choice Voting · Range Voting ·
Majority Rule · Approval Voting · Weighted Voting · Cumulative Voting ·
Quadratic Voting · Continuous Voting · Holacracy · Collaborative Platforms ·
Deliberative Polling · Investor-Filled Board Seats · Elected Board of
Directors · Advisory Committees · Delegated Decision-Making · Executive
Committees · First Past the Post · Lottery/Sortition · Proof of Work · Random
Choice · Algorithm-Driven Decisions · Autocratic Decision-Making ·
Hierarchical Decision-Making · Negotiated Decisions.

**Data-quality issues to handle in the importer (do not silently drop):**

- Row 32 (`Hierarchical Decision-Making`): the `Consensus Level` cell contains
  `"Military, Corporations"` (the value clearly belongs to `Applicable Scope`,
  which itself already contains `"Military, Corporations"`). Importer should
  flag this as a validation error and require a fix in the source workbook
  rather than try to repair it.
- Row 11 (`Range Voting`): the **last facet column** (`Maturity: Enterprise`)
  is empty in the source — treat empty as `x` (no match) **only after** the
  importer logs a warning so the author knows it wasn't intentional ✓.

### 2.5 Conflict Management (`Conflict Management Methods.xlsx`, sheet `Current`)

Maps to the `conflict-management` step
(`app/create/screens/card/ConflictManagementScreen.tsx`) and
`messages/en/create/conflictManagement.json`.

**Content columns (positions 1–6):**

| Sheet column | Card field (proposed naming) |
|---|---|
| `Title` | card title (note: not `Label` like the other three) |
| `Description` | card support text |
| `Core Principle` | modal section A (`corePrinciple`) |
| `Applicable Scope` | modal section B (`applicableScope`) |
| `Process Protocol` | modal section C (`processProtocol`) |
| `Restoration & Fallbacks` | modal section D (`restorationFallbacks`) |

**Card rows (19):** Peer Mediation · Conflict Resolution Council · Facilitated
Negotiation · Ad Hoc Arbitration · Conflict Workshops · Supermajority Vote ·
Interest-Based Bargaining · Restorative Practices · Mediation · Circle
Processes · Judicial Committees · Managerial Decision · Internal Tribunal ·
Consensus Building · Binding Arbitration · Non-Binding Arbitration · Binding
Contracts · Lottery/Sortition · Rotational Judging.

> Conflict Management sheet uses `Title` instead of `Label` and omits the
> `Organization Type:` / `Location:` / `Organizational Maturity:` prefixes —
> normalize both at import time.

---

## 3. Existing data model & wizard surface area

### 3.1 `RuleTemplate` (today)

```64:73:prisma/schema.prisma
model RuleTemplate {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  category    String?
  description String?
  body        Json
  sortOrder   Int      @default(0)
  featured    Boolean  @default(false)
}
```

`body` JSON is the rendered rule document
(`{ sections: [{ categoryName, entries: [{ title, body }] }, ...] }`),
authored today by the `bodyFromXlsxComposition()` helper in
`prisma/seed.ts` from a hand-typed `COMPOSITION_BY_SLUG` map.

**Section ordering (canonical):** Values → Communication → Membership →
Decision-making → Conflict management. Final-review and `governancePatternBody`
both rely on this exact order and casing.

```16:60:prisma/seed.ts
function governancePatternBody(coreValues: string): Prisma.InputJsonValue {
  return {
    sections: [
      { categoryName: "Values", entries: [{ title: "Core stance", body: coreValues }] },
      { categoryName: "Communication", entries: [...] },
      { categoryName: "Membership", entries: [...] },
      { categoryName: "Decision-making", entries: [...] },
      { categoryName: "Conflict management", entries: [...] },
    ],
  };
}
```

### 3.2 Wizard facets captured today (`CreateFlowState`)

```83:95:app/create/types.ts
selectedCommunitySizeIds?: string[];
selectedOrganizationTypeIds?: string[];
selectedScaleIds?: string[];
selectedMaturityIds?: string[];
selectedCoreValueIds?: string[];
selectedCommunicationMethodIds?: string[];
selectedMembershipMethodIds?: string[];
selectedDecisionApproachIds?: string[];
selectedConflictManagementIds?: string[];
```

The first four are exactly the four **facet groups** in the matrix sheets. The
last four are the user's chosen **cards per section**, which the recommendation
flow can either pre-select (when picked from a template) or feed back into
ranking.

These same fields are validated server-side by `createFlowStateSchema` in
`lib/server/validation/createFlowSchemas.ts` (lines 47–106) — the recommend
endpoint should reuse that schema (or a strict subset) instead of redefining
the facet shape.

### 3.3 Wizard step order

Source of truth is `app/create/utils/flowSteps.ts` (`FLOW_STEP_ORDER`). The
relevant slice is:

```
review → core-values → communication-methods → membership-methods →
decision-approaches → conflict-management → confirm-stakeholders → final-review
```

`docs/create-flow.md`'s step table is **stale**; trust `flowSteps.ts`.

### 3.4 Where templates already surface in the UI

| Surface | File |
|---|---|
| Marketing home "Popular templates" | `app/(marketing)/MarketingRuleStackSection.tsx` |
| Templates index | `app/(marketing)/templates/page.tsx` |
| Template preview (by slug) | `app/create/review-template/[slug]/page.tsx` |
| "Use without changes" → publish | `app/create/CreateFlowLayoutClient.tsx` `handleUseTemplateWithoutChanges` |
| API list | `app/api/templates/route.ts` (GET only, no params) |

There is currently **no** recommendation logic, no facet filtering, and the
`/create/informational?template=<slug>` query param is a known no-op (see
`CreateFlowLayoutClient.tsx` lines 479–482).

---

## 4. Repo conventions to follow (don't reinvent)

These are the patterns the implementation must match. References point at the
canonical example for each.

### 4.1 API routes (`app/api/**/route.ts`)

`app/api/drafts/me/route.ts` is the reference — every new route in this
feature must match this exact shape:

1. `if (!isDatabaseConfigured()) return dbUnavailable();` — always first.
   (`lib/server/env.ts`, `lib/server/responses.ts`).
2. For auth'd routes: `const user = await getSessionUser();` then
   `return NextResponse.json({ error: "Unauthorized" }, { status: 401 });` if
   missing. (Recommendation read endpoints can stay unauthenticated.)
3. For request bodies: `readLimitedJson(request)` →
   `<schema>.safeParse(parsed.value)` → `jsonFromZodError(validated.error)` on
   failure. (`lib/server/validation/requestBody.ts`,
   `lib/server/validation/zodHttp.ts`).
4. Success: `NextResponse.json({ <key>: data })` — flat object with one or two
   named keys, no `success: true` envelope.
5. Errors: structured `{ error: { code, message } }` (Zod path) or simple
   `{ error: "..." }` (auth path). Match what's already in the repo.
6. Server-side query helpers swallow Prisma failures and return `[]`/`null`
   (see `listRuleTemplatesFromDb` in `lib/server/ruleTemplates.ts` lines 9–30).
   Routes do **not** wrap helper calls in `try/catch`.

### 4.2 Zod schemas live in `lib/server/validation/`

- One file per feature area (e.g. `createFlowSchemas.ts`, future
  `templateRecommendationSchemas.ts`).
- Export the schema **and** the inferred type
  (`export type X = z.infer<typeof xSchema>`).
- Wrap any free-form JSON blobs with `assertPlainJsonValue` /
  `DEFAULT_PLAIN_JSON_LIMITS` (`lib/server/validation/plainJson.ts`) so the
  size/depth bounds match the rest of the API.
- Reuse `FLOW_STEP_ORDER` and existing array bounds where they overlap (see
  the `selectedXxxMethodIds` arrays in `createFlowStateSchema`).

### 4.3 Prisma access

- Singleton: `import { prisma } from "lib/server/db";` — never
  `new PrismaClient()` from app code. (Standalone scripts under `scripts/` /
  `prisma/` may instantiate their own, matching `prisma/seed.ts` lines
  363–403.)
- Server-only "fetch/list" helpers live under `lib/server/<feature>.ts`,
  return DTOs (not raw Prisma rows), and degrade gracefully
  (`isDatabaseConfigured()` short-circuit, `try/catch` → empty result).
- No `$transaction` patterns exist yet; **introduce one** for the importer
  (write `TemplateMethod` + `TemplateMethodFacet` rows atomically).

### 4.4 DTO style

- Hand-written `type` aliases that mirror a Prisma `select` clause, co-located
  with the consumer (see `RuleTemplateDto` in
  `lib/create/fetchTemplates.ts` lines 5–14).
- For a feature with both client and server consumers, put the type in
  `lib/<feature>/types.ts` and import from both sides.

### 4.5 Standalone scripts

- Use `tsx` (already a dev dep; entry point `package.json` `prisma.seed`
  field).
- Layout matches `prisma/seed.ts`: `async function main()`, log a one-line
  success summary, `console.error(e); process.exit(1)` on failure,
  `await prisma.$disconnect()` in `finally`.
- Add an entry to `package.json` `scripts` (e.g.
  `"templates:import": "tsx scripts/import-templates-xlsx.ts"`).
- No shared dotenv loader — rely on env from the shell / Next runtime.
- Support a `--dry-run` flag that validates + diffs without writing.

### 4.6 Tests

- Vitest under `tests/unit/*.test.ts` for parsers / validators / pure
  functions (see `tests/unit/createFlowValidation.test.ts`).
- API routes are not unit-tested today; cover route behavior indirectly with a
  `tests/unit/templateRecommendationSchemas.test.ts` (Zod) plus a fixture
  workbook + importer test under `tests/unit/importTemplatesXlsx.test.ts`.
- E2E for the wizard (if needed) goes under `tests/e2e/*.spec.ts` — not
  required for CR-88 acceptance.
- Test utilities: `tests/utils/test-utils.tsx` (`renderWithProviders`); MSW
  server in `tests/msw/server.ts`. No Prisma mock helper exists; importer test
  should use a fixture workbook and stub the `prisma` client at the import
  site.

### 4.7 Logging

- Use `logger` from `lib/logger.ts` for any server-side info/warn/error in
  scripts and route helpers (matches `app/api/auth/magic-link/request/route.ts`
  lines 14–15, 35–45). No `apiError` helper exists; do not introduce one.

### 4.8 New deps

- `xlsx` (SheetJS) is **not** currently in `package.json`. Add it as a
  **prod** dep only if the importer is invoked from app code; if the importer
  is script-only, `devDependency` is fine. CR-88's plan calls for a
  build/CLI-time importer, so `devDependencies` is the right home.

### 4.9 i18n / `messages/` constraint

- Card decks and modal copy are currently keyed in
  `messages/en/<feature>.json` and read via
  `useMessages().create.<feature>` (`app/contexts/MessagesContext.tsx`,
  `messages/en/index.ts`).
- Only `en` is wired today, so we **don't** have a translation backlog
  blocking us. The wiring step (§7) replaces `messages/en/create/{communication,
  membership,rightRail,conflictManagement}.json` card/modal payloads with
  values served by `GET /api/template-methods` (still keyed by the same
  message namespace shape so future i18n can layer on if needed). Header
  strings, button labels, and other purely-static UI copy stay in
  `messages/en/*`.

### 4.10 `.cursorrules` scope

- The repo's `.cursorrules` PascalCase / lowercase normalization rule applies
  to **React component props only**. It does **not** apply to API query
  params, request bodies, or DB columns. The recommendation API uses lowercase
  facet keys throughout (`orgType`, `scale`, `maturity`, `size`).

---

## 5. Authoring contract (informs §6 storage + §7 importer)

The four spreadsheets together imply this row schema (per matrix workbook):

```ts
type MatrixRow = {
  /** Stable slug derived from `Label`/`Title` (kebab-case, lowercase, ascii).
   *  Used as the card id everywhere downstream. */
  id: string;

  /** Section this row belongs to. One of: communication, membership,
   *  decisionMaking, conflictManagement. (values is not yet sheet-driven.) */
  section: "communication" | "membership" | "decisionMaking" | "conflictManagement";

  /** Card-facing copy. Keys differ per section; importer normalizes. */
  card: {
    label: string;
    description: string;
    /** Section-specific long-form fields (3–4 per section). */
    modalSections: Record<string, string>;
  };

  /** Optional numeric scalar fields (e.g. decisionMaking `Consensus Level`). */
  scalars?: Record<string, number>;

  /** Facet matches (✓ → true, x/blank → false). Keys are canonical facet ids. */
  facets: {
    size: Record<"1" | "2_5" | "6_12" | "13_100" | "100_100k", boolean>;
    orgType: Record<"dao" | "forProfit" | "nonprofit" | "openSource" | "mutualAid" | "workersCoop", boolean>;
    scale: Record<"global" | "national" | "regional" | "local", boolean>;
    maturity: Record<"earlyStage" | "growthStage" | "established" | "enterprise", boolean>;
  };
};
```

A sibling **manifest** documents the per-section section-key mapping and
column header → canonical facet/scalar key mapping, so the importer can be
stable across header rewording.

---

## 6. Storage (decided: normalized tables)

We are introducing two new Prisma models. Hand-typed `COMPOSITION_BY_SLUG` in
`prisma/seed.ts` is replaced by template rows that **reference** method slugs.

```prisma
model TemplateMethod {
  id            String   @id @default(cuid())
  section       String   // communication | membership | decisionMaking | conflictManagement
  slug          String
  label         String
  description   String
  modalSections Json     // { corePrinciple: "...", logisticsAdmin: "...", ... }
  scalars       Json?    // { consensusLevel: 0.51 }
  sortOrder     Int      @default(0)
  facets        TemplateMethodFacet[]
  @@unique([section, slug])
  @@index([section])
}

model TemplateMethodFacet {
  id        String  @id @default(cuid())
  methodId  String
  group     String  // size | orgType | scale | maturity
  value     String  // e.g. "workersCoop"
  matches   Boolean // ✓ → true, x/blank → false
  weight    Float?  // optional numeric override for future scoring
  method    TemplateMethod @relation(fields: [methodId], references: [id], onDelete: Cascade)
  @@unique([methodId, group, value])
  @@index([group, value, matches])
}
```

`RuleTemplate.body` continues to express a **chosen composition** of methods
(one or more per section). Curated templates in `prisma/seed.ts` become
references to `TemplateMethod.slug` instead of literal copy strings — when
copy changes in the spreadsheet, every template that references that slug
inherits the new copy.

A follow-up (out of scope for CR-88) may add a `RuleTemplateMethodLink` join
table if templates need ordering or per-template overrides; the current `body`
JSON shape is sufficient for the first ship.

---

## 7. Importer (`scripts/import-templates-xlsx.ts`)

Phased plan that the implementation agent can follow top-to-bottom. Mirrors
the structure of `prisma/seed.ts` (singleton client, `main()` +
`finally { $disconnect }`, `process.exit(1)` on failure).

1. **Read `.xlsx`** with [`xlsx`](https://www.npmjs.com/package/xlsx) (SheetJS,
   add as devDependency) from a configurable input dir (default
   `data/template-matrix/`). The four workbooks live there as committed
   artifacts, not in `Downloads/`.
2. **Schema-validate per section** with Zod schemas that live in
   `lib/server/validation/templateRecommendationSchemas.ts` so the API and
   importer share the row shape: required column headers, allowed cell
   symbols (`✓`, `x`, blank, decimal for `Consensus Level`).
3. **Normalize**: kebab-case slug from label, strip
   `Organization Type:` / `Location:` / `Organizational Maturity:` prefixes,
   collapse whitespace, normalize curly quotes.
4. **Cross-sheet validation**: facet columns must match the canonical 19-column
   set; unknown columns fail loudly via the importer (use `logger.error`).
5. **Diff & upsert** inside `prisma.$transaction([...])`: upsert
   `TemplateMethod` rows by `(section, slug)`; delete + recreate
   `TemplateMethodFacet` rows for each method.
6. **Emit a JSON snapshot** to `prisma/data/template-matrix.json` so
   `prisma/seed.ts` can replay imports when the source workbooks aren't
   available (e.g. CI seed without the spreadsheet checked in).
7. **Flags**: `--dry-run` (validate + diff, no writes), `--allow-warnings`
   (don't fail on the row-32 / row-11 issues in §2.4 while authors are
   iterating).
8. **Tests** in `tests/unit/importTemplatesXlsx.test.ts`: a fixture workbook
   with two rows per section asserts both validation errors (unknown column,
   bad symbol, miscategorized cell) and successful normalization. Reuse
   Vitest patterns from `tests/unit/createFlowValidation.test.ts`.

Per Ticket 16 and the roadmap, **prefer batch `.xlsx` import** over a live
Google Sheets API in production. Authors export to `.xlsx` and a maintainer
runs `npm run templates:import` (or CI does on a `data/template-matrix/` change).

---

## 8. APIs

Two read endpoints. Both follow §4.1 conventions exactly: `dbUnavailable()`
guard → server helper from `lib/server/templateMethods.ts` →
`NextResponse.json({ ... })`.

### 8.1 `GET /api/templates` (rewrite)

Query params (all optional):

- `facet.size=<chipId>` (repeatable)
- `facet.orgType=<chipId>` (repeatable)
- `facet.scale=<chipId>` (repeatable)
- `facet.maturity=<chipId>` (repeatable)

Behavior:

- No params → existing curated ordering (`featured`, `sortOrder`, `title`),
  no scoring.
- With facets → score each template by counting matching facets across the
  methods referenced in its `body`; return ranked `templates` plus an
  optional `scores` map.

Response:

```ts
{
  templates: RuleTemplateDto[],
  scores?: Record<string, { score: number; matchedFacets: string[] }>
}
```

Param parsing helper lives next to `listRuleTemplatesFromDb` in
`lib/server/ruleTemplates.ts` (e.g. `parseTemplateFacetsFromSearchParams`).

### 8.2 `GET /api/template-methods?section=<section>[&facet.*=...]`

Powers the four card-deck wizard steps and the section-level recommendation
view. Response:

```ts
{
  section: "communication" | "membership" | "decisionMaking" | "conflictManagement",
  methods: Array<{
    slug: string;
    label: string;
    description: string;
    modalSections: Record<string, string>;
    scalars?: Record<string, number>;
    /** Per-method facet match against the requested facets (omitted when no facets passed). */
    matches?: { score: number; matchedFacets: string[] };
  }>
}
```

Server helper: `listTemplateMethodsFromDb({ section, facets })` in
`lib/server/templateMethods.ts`. Same swallow-and-return-`[]` failure mode as
`listRuleTemplatesFromDb`.

### 8.3 `POST /api/templates/recommend` (follow-up, optional)

If product wants to send the full `CreateFlowState` (not just facet ids), the
body schema **reuses** `createFlowStateSchema` from
`lib/server/validation/createFlowSchemas.ts`. Same scoring engine, just a
richer input. Skip until §8.1 + §8.2 ship.

**Empty / partial facets:** never error. Fall back to today's ordering and
return all rows.

---

## 9. Wizard wiring (UI follow-on, not strictly part of CR-88)

Once the API exists:

- `communication-methods` / `membership-methods` / `decision-approaches` /
  `conflict-management` screens each call
  `GET /api/template-methods?section=...&facet.*=...`. The card label and
  modal copy come from the API response, not from
  `messages/en/create/<section>.json`. Static JSON in those four files is
  pruned to the page-level strings (header titles, button labels, modal
  chrome) only.
- Selecting a template on the marketing home or `templates/` page can prefill
  the create flow's `selected*MethodIds` from the template's composition (this
  closes the `?template=` no-op gap noted in
  `CreateFlowLayoutClient.tsx`).
- Recommendations should never **hide** options from the user — ranking only.
  Authors expect to see "all 32 decision-making patterns" with the ✓-matching
  ones surfaced first.

---

## 10. Open questions for product before coding

1. **Should `Values` also be sheet-driven?** Today it's free-text only and
   not in any of the four matrices. Roadmap implies eventual parity.
2. **Scoring vs filtering**: do we want to **hide** non-✓ rows when a facet
   is set, or only **rank** them? Recommend ranking with a soft cutoff.
3. **Per-template featured composition vs library-wide**: should
   `RuleTemplate` rows continue to exist as named compositions
   ("Consensus", "Elected Board", etc.), or become derived from a
   "this is the best mix for nonprofit + 13–100 + early stage" scoring? Doc
   today assumes the former — templates remain curated.
4. **Authoring source of truth**: are the `Downloads/*.xlsx` files committed
   to `data/template-matrix/` going forward, or do they live in a Drive folder
   pulled by the importer at build time? Recommend committing.
5. **Data validation strictness**: the current Decision-making sheet has a
   miscategorized cell (row 32, see §2.4). Importer should fail by default,
   with a `--allow-warnings` flag for in-progress edits.

---

## 11. Test plan (acceptance for CR-88)

- [ ] `scripts/import-templates-xlsx.ts` runs end-to-end on the four committed
      workbooks with no errors and produces the expected DB diff (or JSON
      snapshot).
- [ ] Editing a row in the source workbook and re-running the importer changes
      the rank order returned by `GET /api/templates?facet.orgType=4`
      (the `Nonprofit` chip id) without any manual Studio edit.
- [ ] `tests/unit/importTemplatesXlsx.test.ts` rejects each documented
      validation failure (unknown column, bad symbol, miscategorized row).
- [ ] `tests/unit/templateRecommendationSchemas.test.ts` exercises the Zod
      schemas the importer and API share.
- [ ] Manual smoke on the four wizard card-deck steps: facet-narrowed
      ordering surfaces matching cards first; facetless GET returns the
      full curated list.
- [ ] No regression in existing template surfaces (marketing home, templates
      index, review-template preview).

---

## 12. Source files referenced

- `prisma/schema.prisma` — `RuleTemplate` model (lines 64–73).
- `prisma/seed.ts` — current curated composition + xlsx-shaped helpers
  (lines 1–404).
- `app/api/templates/route.ts` — existing GET endpoint (to be rewritten).
- `app/api/drafts/me/route.ts` — reference route shape (`dbUnavailable` →
  `getSessionUser` → `readLimitedJson` → `safeParse` → `jsonFromZodError`).
- `lib/server/db.ts` — Prisma singleton (lines 1–18).
- `lib/server/responses.ts` — `dbUnavailable()` (lines 1–8).
- `lib/server/ruleTemplates.ts` — `listRuleTemplatesFromDb` (lines 9–30).
- `lib/server/validation/createFlowSchemas.ts` — schema to reuse for
  `POST /api/templates/recommend` (lines 47–106).
- `lib/server/validation/requestBody.ts` — `readLimitedJson` (lines 13–48).
- `lib/server/validation/zodHttp.ts` — `jsonFromZodError` (lines 4–17).
- `lib/server/validation/plainJson.ts` — `assertPlainJsonValue` /
  `DEFAULT_PLAIN_JSON_LIMITS`.
- `lib/logger.ts` — server-side `logger`.
- `app/create/types.ts` — `CreateFlowState` and facet fields.
- `app/create/utils/flowSteps.ts` — canonical step order.
- `app/create/utils/createFlowScreenRegistry.ts` — screen layout per step.
- `app/create/screens/select/CommunityStructureSelectScreen.tsx` — chip-id
  derivation pattern (positional `String(i+1)`).
- `app/create/screens/card/CommunicationMethodsScreen.tsx` — section-field
  contract (`SECTION_FIELDS`).
- `messages/en/create/{communitySize,communityStructure,communication,membership,rightRail,conflictManagement}.json` —
  current static card / chip copy that the matrix supersedes.
- `lib/templates/governanceTemplateCatalog.ts`,
  `lib/templates/templateGridPresentation.ts`,
  `lib/create/fetchTemplates.ts` — current presentation/DTO layer.
- `tests/unit/createFlowValidation.test.ts` — Vitest pattern for new
  schema/importer tests.
- Roadmap: `docs/backend-roadmap.md` §4 (lines 83–85), §13.
- Spec: `docs/backend-linear-tickets.md` Ticket 16 (lines 280–304).

## 13. Source workbooks

| File | Sheet | Rows | Cols | Section |
|---|---|---|---|---|
| `Communication Methods.xlsx` | `Current` | 11 cards | 24 | `communication` |
| `Group_Membership_Methods.xlsx` | `Current` | 19 cards | 24 | `membership` |
| `Decision-making.xlsx` | `Current` | 32 cards | 26 | `decisionMaking` |
| `Conflict Management Methods.xlsx` | `Current` | 19 cards | 25 | `conflictManagement` |

Counts include the header row. Decision-making has 26 columns because of two
extra content fields (`Consensus Level`, `Step-by-Step Instructions` vs the
4-section pattern of the others).
