# Recommendation Matrix — Implementation Context

**Status:** Implemented. This doc is the canonical spec — keep code in sync with it.

**Authoring:** Committed JSON under `data/create/customRule/` plus `npx prisma db seed` — no runtime `.xlsx` import.

**Related:** [`docs/create-flow.md`](../create-flow.md) (wizard URLs and stages), [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (API route table).

This doc documents the **method facet matrix** that powers ranking from shared facet data:

1. **Create-flow card ranking (shipped)** — the four card-deck wizard steps
   (`communication-methods`, `membership-methods`, `decision-approaches`,
   `conflict-management`) reorder their `methods[]` array based on which
   methods match the user's selected community facets.
2. **Template list API (shipped)** — `GET /api/templates?facet.*` returns scored/ranked `RuleTemplate` rows when query params are present.
3. **Template marketing grids (optional follow-up)** — home `MarketingRuleStackSection.tsx` and `/templates` may call `GET /api/templates` **without** facets; product can pass `facet.*` when those surfaces should rank like the wizard.

> **Scope note:** Card / modal copy lives in
> `messages/en/create/customRule/*.json` as flat `methods` arrays (one
> entry per method, with `id`, `label`, `supportText`, `recommended`,
> and a `sections` map). The matrix layer adds **facet data** — which
> methods match which user facets — as committed JSON in
> `data/create/customRule/*.json`, validated by Zod and seeded into
> `MethodFacet`. There is no spreadsheet importer, no `xlsx` runtime
> dependency, and the spreadsheets in `~/Downloads/` were a **one-time
> authoring artifact** — they are not part of the runtime contract.

---

## 1. Where things live

### 1a. Card / modal copy — `messages/en/create/customRule/<section>.json`

Source of truth for all displayed text. Each file holds the page chrome
(`page`, `confirmModal`, `addPlatform`/`addApproach`, `sectionHeadings`,
plus decision-approaches' `sidebar` / `messageBox` / `cardStack` /
`scopeAddButtonLabel`) plus a flat `methods` array. Read via
`useMessages().create.customRule.<section>.methods`. Never duplicated
elsewhere for in-app UI. `GET /api/create-flow/methods` exposes the same
copy for external consumers (§9.2); the wizard may still read messages
directly.

### 1b. Facet data — `data/create/customRule/<section>.json`

Mirrors the messages path one-to-one (same filename, different root) so a
content reviewer can read the two side-by-side. Each file is a typed JSON
object mapping each method `id` → its facet matches across the four
canonical groups (`size`, `orgType`, `scale`, `maturity`). Validated by
the Zod schema at seed time and in CI (see §3 — no app-boot validator).
Lives **outside** `messages/<locale>/` because facets are not localized
— they describe the methods, not the UI text.

### 1c. Messages folder layout

Create-flow messages are grouped into three stages from
[`docs/create-flow.md`](../create-flow.md) §"Product stages":

| Folder | Files |
| --- | --- |
| `messages/en/create/community/` | `informational.json`, `communityName.json`, `communityStructure.json`, `communityContext.json`, `communitySize.json`, `communityUpload.json`, `communitySave.json`, `review.json` |
| `messages/en/create/customRule/` | `coreValues.json`, `communication.json`, `membership.json`, `decisionApproaches.json`, `conflictManagement.json` |
| `messages/en/create/reviewAndComplete/` | `confirmStakeholders.json`, `finalReview.json`, `completed.json`, `publish.json` |
| `messages/en/create/` (root, cross-cutting) | `footer.json`, `topNav.json`, `draftHydration.json`, `templateReview.json`, plus layout-shell strings (`select.json`, `text.json`, `upload.json`) |

[`messages/en/index.ts`](../../messages/en/index.ts) exposes
`useMessages().create.<stage>.<section>`. Facet JSON paths
(`data/create/customRule/<section>.json`) mirror the `customRule/`
filenames — that pairing is intentional (§1a/§1b).

---

## 2. Facet groups (the canonical 19-column matrix)

Four facet groups, 19 values total, identical across all four sections.
These are the only dimensions the recommendation engine scores against.

| Group | Value `id`s (canonical lowercase keys) | Wizard chip labels | `CreateFlowState` field |
| --- | --- | --- | --- |
| `size` | `oneMember`, `twoToFive`, `sixToTwelve`, `thirteenToOneHundred`, `oneHundredToOneHundredK` | `1 member`, `2-5 members`, `6-12 members`, `13-100 members`, `100-100,000 members` | `selectedCommunitySizeIds` |
| `orgType` | `dao`, `forProfit`, `nonprofit`, `openSource`, `mutualAid`, `workersCoop` | `DAO`, `For profit business`, `Nonprofit`, `Open source project`, `Mutual aid`, `Worker's coop` | `selectedOrganizationTypeIds` |
| `scale` | `global`, `national`, `regional`, `local` | `Global`, `National`, `Regional`, `Local` | `selectedScaleIds` |
| `maturity` | `earlyStage`, `growthStage`, `established`, `enterprise` | `Early stage`, `Growth stage`, `Established`, `Enterprise` | `selectedMaturityIds` |

**Wizard chip ids vs facet value keys.** Wizard chips today use positional
1..N ids inside their messages files (see `chipRowsFromLabels` in
`app/(app)/create/screens/select/CommunityStructureSelectScreen.tsx` and
`CommunitySizeSelectScreen.tsx`). The recommendation layer needs a
**stable lookup** from those positional chip ids to the canonical facet
value keys above. Live that lookup table in
`data/create/customRule/_facetGroups.json` so every consumer sees the
same mapping.

Shape: a single object keyed by group, then by the canonical value id,
with the wizard chip's positional id and source messages path. The
chip's display label is **not** duplicated here — it stays in the
messages file (the lookup is just position → canonical id). Order in
each group's `values` follows §2's canonical key order, **not** the
chip's positional order in the messages file:

```json
{
  "size": {
    "source": "messages/en/create/community/communitySize.json#/communitySizes",
    "values": {
      "oneMember":               { "chipId": "1" },
      "twoToFive":               { "chipId": "2" },
      "sixToTwelve":             { "chipId": "3" },
      "thirteenToOneHundred":    { "chipId": "4" },
      "oneHundredToOneHundredK": { "chipId": "5" }
    }
  },
  "orgType": {
    "source": "messages/en/create/community/communityStructure.json#/organizationTypes",
    "values": {
      "workersCoop":  { "chipId": "1" },
      "mutualAid":    { "chipId": "2" },
      "openSource":   { "chipId": "3" },
      "nonprofit":    { "chipId": "4" },
      "forProfit":    { "chipId": "5" },
      "dao":          { "chipId": "6" }
    }
  },
  "scale": {
    "source": "messages/en/create/community/communityStructure.json#/scaleOptions",
    "values": {
      "local":    { "chipId": "1" },
      "regional": { "chipId": "2" },
      "national": { "chipId": "3" },
      "global":   { "chipId": "4" }
    }
  },
  "maturity": {
    "source": "messages/en/create/community/communityStructure.json#/maturityOptions",
    "values": {
      "earlyStage":  { "chipId": "1" },
      "growthStage": { "chipId": "2" },
      "established": { "chipId": "3" },
      "enterprise":  { "chipId": "4" }
    }
  }
}
```

Validated by the same Zod schema module as the facet files
(`lib/server/validation/methodFacetsSchemas.ts`). The parity test in §12
asserts every `chipId` matches an actual position in the referenced
messages file (off-by-one fails loudly). Adding a chip in messages
without updating this file → schema error.

---

## 3. Method inventory per section

Every method's slug must exist as a `methods[].id` in the corresponding
messages file *and* as a key in the corresponding facet file. Parity is
enforced at two points (no app-boot hook):

- **`prisma db seed`** — `loadSectionFacets()` runs the Zod schema
  against each `data/create/customRule/<section>.json` file before
  upserting; any orphan slug or unknown facet value fails the seed.
- **`tests/unit/methodFacets.test.ts`** — runs in CI on every PR;
  re-asserts the same parity statically (no DB needed) so authoring
  errors are caught before the seed ever runs.

There is intentionally **no Next.js app-boot validator** — schema
failures should surface in CI/seed, not at request time.

| Section | Screen | Messages file | Facet file | Method count |
| --- | --- | --- | --- | --- |
| `communication` | `app/(app)/create/screens/card/CommunicationMethodsScreen.tsx` | `messages/en/create/customRule/communication.json` | `data/create/customRule/communication.json` | 11 |
| `membership` | `app/(app)/create/screens/card/MembershipMethodsScreen.tsx` | `messages/en/create/customRule/membership.json` | `data/create/customRule/membership.json` | 19 |
| `decisionApproaches` | `app/(app)/create/screens/right-rail/DecisionApproachesScreen.tsx` | `messages/en/create/customRule/decisionApproaches.json` | `data/create/customRule/decisionApproaches.json` | 32 |
| `conflictManagement` | `app/(app)/create/screens/card/ConflictManagementScreen.tsx` | `messages/en/create/customRule/conflictManagement.json` | `data/create/customRule/conflictManagement.json` | 19 |

`section` keys above are the canonical lowercase camelCase tokens used in
the DB, the API query string, and the Zod schemas. The four xlsx
authoring artifacts in `~/Downloads/` (see "Source workbooks" appendix
below) are the human reference for which methods match which facets;
they do not ship.

---

## 4. Existing data model & wizard surface area

### 4.1 `RuleTemplate` (today, unchanged)

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
authored today by `bodyFromXlsxComposition()` in `prisma/seed.ts` from
the hand-typed `COMPOSITION_BY_SLUG` map. **Stays hand-curated** — the
matrix doesn't change how templates are authored, only how they are
ranked. Section ordering (Values → Communication → Membership →
Decision-making → Conflict management) is set by `governancePatternBody`
and is canonical.

### 4.2 Wizard facets captured today (`CreateFlowState`)

```ts
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

The first four are exactly the four facet groups in §2. The last four
are the user's chosen methods per section (used to pre-rank or to feed
recommendations on later steps). `createFlowStateSchema` in
`lib/server/validation/createFlowSchemas.ts` is the canonical Zod schema
— recommendation-side schemas should import the facet-id arrays from
there rather than redefine them.

### 4.3 Wizard step order

Source of truth: `app/(app)/create/utils/flowSteps.ts` (`FLOW_STEP_ORDER`).
Relevant slice for the matrix:

```
review → core-values → communication-methods → membership-methods →
decision-approaches → conflict-management → confirm-stakeholders → final-review
```

### 4.4 Where templates surface in the UI (in scope for ranking)

| Surface | File |
| --- | --- |
| Marketing home "Popular templates" | `app/(marketing)/_components/MarketingRuleStackSection.tsx` |
| Templates index | `app/(marketing)/templates/page.tsx` |
| Template preview (by slug) | `app/(app)/create/review-template/[slug]/page.tsx` |
| "Use without changes" → publish | `app/(app)/create/CreateFlowLayoutClient.tsx` `handleUseTemplateWithoutChanges` |
| API list | `app/api/templates/route.ts` (`GET`; optional `facet.*` — §9.1) |
| API detail | `app/api/templates/[slug]/route.ts` (`GET` — §9.4) |
| API catalog | `app/api/create-flow/methods/route.ts` (`GET` — §9.2); `lib/server/governanceCatalog.ts` |

**Marketing UIs** may omit `facet.*` (curated ordering only). When facets
are passed, templates are ranked and `scores` may be returned. Template **Customize**
now prefills the custom-rule flow via
[`buildTemplateCustomizePrefill`](../../lib/create/applyTemplatePrefill.ts)
(applied in `CreateFlowLayoutClient.tsx`) and routes to `core-values`
when Community already has input, else to `informational`. Template **Use
without changes** writes `template.body.sections` into `state.sections`
and routes to `confirm-stakeholders`, so the user exits via the normal
`final-review → handleFinalize → publishRule` path and picks up the
server-enforced 401 sign-in gate for free.

When the user picks a template **before** completing the community
stage, both handlers still apply their side effects eagerly (prefill or
`sections`/`summary`) and pin a
`pendingTemplateAction: { slug, mode: "customize" | "useWithoutChanges" }`
on `CreateFlowState`, then route to `informational`. Once the user
reaches `/create/review`, `CommunityReviewScreen` consumes the pin and
`router.replace`s past itself — to `core-values` for `customize`, to
`confirm-stakeholders` for `useWithoutChanges`. The community-review
screen is therefore only shown when the user came from "Create Custom"
(no template), matching the intent already expressed at the
template-review step.

---

## 5. Repo conventions to follow (don't reinvent)

References point at the canonical example for each.

### 5.1 API routes (`app/api/**/route.ts`)

`app/api/drafts/me/route.ts` is the reference. Every new route in this
feature must match:

1. `if (!isDatabaseConfigured()) return dbUnavailable();` — always first
   (`lib/server/env.ts`, `lib/server/responses.ts`).
2. For auth'd routes: `const user = await getSessionUser();` then
   `NextResponse.json({ error: "Unauthorized" }, { status: 401 })` if
   missing. Recommendation read endpoints stay unauthenticated.
3. Request bodies: `readLimitedJson(request)` →
   `<schema>.safeParse(parsed.value)` → `jsonFromZodError(validated.error)`
   on failure (`lib/server/validation/requestBody.ts`,
   `lib/server/validation/zodHttp.ts`).
4. Success: `NextResponse.json({ <key>: data })` — flat object, no
   `success: true` envelope.
5. Errors: structured `{ error: { code, message } }` (Zod path) or simple
   `{ error: "..." }` (auth path).
6. Server-side query helpers swallow Prisma failures and return
   `[]`/`null` (see `listRuleTemplatesFromDb` in
   `lib/server/ruleTemplates.ts`). Routes do **not** wrap helper calls
   in `try/catch`.

### 5.2 Zod schemas live in `lib/server/validation/`

- One file per feature area
  (`lib/server/validation/methodFacetsSchemas.ts` for this feature).
- Export the schema **and** the inferred type
  (`export type X = z.infer<typeof xSchema>`).
- Reuse facet-id arrays from `createFlowStateSchema` rather than
  redeclaring them.

### 5.3 Prisma access

- Singleton: `import { prisma } from "lib/server/db";` — never
  `new PrismaClient()` from app code.
- Server-only fetch/list helpers live under `lib/server/<feature>.ts`,
  return DTOs (not raw Prisma rows), and degrade gracefully
  (`isDatabaseConfigured()` short-circuit, `try/catch` → empty result).
- Use `prisma.$transaction` for the seed step that swaps facet rows
  (delete-then-create per `(section, slug)` pair atomically).

### 5.4 DTO style

Hand-written `type` aliases that mirror a Prisma `select` clause,
co-located with the consumer (see `RuleTemplateDto` in
`lib/create/fetchTemplates.ts`).

### 5.5 Tests

- Vitest under `tests/unit/*.test.ts` for schemas and pure functions
  (see `tests/unit/createFlowValidation.test.ts`).
- Test the facet JSON files themselves with a parity test
  (`tests/unit/methodFacets.test.ts`) that loads each `data/` file
  alongside its messages file and asserts every `methods[].id` has a
  facet entry and vice-versa.
- API routes are not unit-tested today; cover behavior indirectly via
  schema tests.

### 5.6 Logging

Use `logger` from `lib/logger.ts` for any server-side info/warn/error in
scripts and route helpers. No `apiError` helper exists; do not introduce
one.

### 5.7 i18n stays the source of truth for copy

Card decks and modal copy live in
`messages/en/create/customRule/<section>.json` and are read
via `useMessages().create.customRule.<section>` (`messages/en/index.ts`,
`app/contexts/MessagesContext.tsx`). The matrix never puts copy in the
DB. The recommendation API returns slugs and scores only — never copy —
so Storybook stories, MSW handlers, and Vitest specs keep importing the
message JSON statically and don't need an API mock for content.

### 5.8 Component-prop normalization rule

The repo's lowercase prop normalization rule
(`.cursor/rules/component-props.mdc`) applies to **React component props
only**. It does **not** apply to API query params, DB columns, JSON
keys, or messages keys. Conventions used by this feature: facet group
ids and facet values are camelCase (`orgType`, `workersCoop`); messages
keys are camelCase (`stepByStepInstructions`, `restorationFallbacks`);
method slugs are kebab-case (`peer-mediation`, `lazy-consensus`).

---

## 6. Authoring contract (the JSON shape)

Each `data/create/customRule/<section>.json` file is a single object
keyed by method slug. Each entry has the four facet groups, each holding
booleans (or numeric weights, optional) per canonical value id.

```ts
type FacetMatch = boolean | { match: boolean; weight?: number };

type SectionFacets = Record<
  string, // method slug, e.g. "peer-mediation"
  {
    size:     Record<"oneMember" | "twoToFive" | "sixToTwelve" | "thirteenToOneHundred" | "oneHundredToOneHundredK", FacetMatch>;
    orgType:  Record<"dao" | "forProfit" | "nonprofit" | "openSource" | "mutualAid" | "workersCoop", FacetMatch>;
    scale:    Record<"global" | "national" | "regional" | "local", FacetMatch>;
    maturity: Record<"earlyStage" | "growthStage" | "established" | "enterprise", FacetMatch>;
  }
>;
```

Example (illustrative, not a real entry):

```json
{
  "peer-mediation": {
    "size":     { "oneMember": false, "twoToFive": true,  "sixToTwelve": true,  "thirteenToOneHundred": true,  "oneHundredToOneHundredK": false },
    "orgType":  { "dao": false, "forProfit": false, "nonprofit": true, "openSource": true, "mutualAid": true, "workersCoop": true },
    "scale":    { "global": false, "national": false, "regional": true, "local": true },
    "maturity": { "earlyStage": true, "growthStage": true, "established": true, "enterprise": false }
  }
}
```

Bulk shorthand: a field that's omitted defaults to `false`, so files
only need to enumerate matching facets when authors prefer the compact
form. The Zod schema (run at seed time and in the parity test, per §3)
fills defaults and enforces:

- Every key in the file matches a `methods[].id` in the corresponding
  messages file (no orphans either way — fail loudly).
- Every facet group is present for every method (or fully omitted, in
  which case it defaults to "all false").
- Facet values are exactly the canonical ids in §2 (typos fail).

### One-time transcription from the workbooks

The four `.xlsx` files in `~/Downloads/` (see appendix) carry the facet
matches as the trailing 19 columns after the descriptive copy columns
(slug, label, supportText, applicableScope, consensusLevel, etc.). The
implementing agent should:

1. Inspect one workbook with `openpyxl` to confirm the column order
   matches §2 (`size` × 5, `orgType` × 6, `scale` × 4, `maturity` × 4 =
   19 facet columns). The copy ingest already confirmed the leading
   columns; the trailing 19 are the only new bit.
2. Write a one-shot Python script (mirror of the throwaway
   `/tmp/ingest_methods.py` used for the messages ingest — **do not
   commit**) that:
   - Reads each workbook's `Current` sheet,
   - Slugifies the first column the same way the messages ingest did
     (kebab-case, ASCII-folded, lowercase) so keys match
     `methods[].id` exactly,
   - Treats `✓` (and `1`, `true`, `yes` — case-insensitive) as `true` and
     everything else (`x`, blank, `-`, `0`, `false`, `no`, `✗`) as `false`.
     The workbooks intentionally use `✓` to mark a match and `x` to mark a
     non-match (cross-out) — both are filled cells but only `✓` counts as
     a positive recommendation,
   - Emits one `data/create/customRule/<section>.json` per workbook in
     the §6 shape, sorted by method slug,
   - Emits `data/create/customRule/_facetGroups.json` from the column
     header → canonical-id mapping above (§2).
3. Hand-review the diff against the workbook for the first ~3 methods
   per section, then commit the JSON files.
4. Run `tests/unit/methodFacets.test.ts` (§12) to confirm parity with
   the messages files, and `prisma db seed` to confirm the schema +
   transaction work.

The script is throwaway. Future facet edits happen by hand in the JSON
files. The workbooks stay at `~/Downloads/` and are **not** committed —
the post-ingest JSON files (both `messages/` and `data/`) are the
historical record.

---

## 7. Storage

Facet data lives in the JSON files above (the source of truth) and is
**hydrated into the DB at seed time** so the API can do efficient joins
when ranking templates by composed-method match. The JSON is canonical —
the DB is a derived index.

```prisma
model MethodFacet {
  id       String  @id @default(cuid())
  section  String  // communication | membership | decisionApproaches | conflictManagement
  slug     String  // matches the `id` of an entry in the messages file's `methods` array
  group    String  // size | orgType | scale | maturity
  value    String  // e.g. "workersCoop"
  matches  Boolean // ✓ → true, blank/explicit-false → false
  weight   Float?  // optional numeric override for future scoring tweaks
  @@unique([section, slug, group, value])
  @@index([section])
  @@index([group, value, matches])
}
```

Why this shape:

- **JSON is the source of truth** — diffs are reviewable in PRs, no
  binary artifacts, no importer to maintain. `prisma db seed` (or the
  facet-only equivalent script) reads the JSON and upserts rows.
- **DB enables joins** — template ranking joins `MethodFacet` against
  the methods listed in `RuleTemplate.body` to compute per-template
  match scores. In-memory ranking would also work but the join is
  cleaner and matches existing patterns.
- **Slug is the contract** — every JSON key matches a `methods[].id` in
  messages; boot-time validation enforces this both ways.
- **No runtime spreadsheet dependency** — `xlsx` / SheetJS is **not**
  added to `package.json`. The original `~/Downloads/*.xlsx` files
  authored both the messages content (already ingested) and the facet
  matches (one-time transcription into the JSON files described in §6).
  Future facet edits happen directly in the JSON.

---

## 8. Seed / sync

`prisma/seed.ts` (or a small co-located helper at
`prisma/seed/methodFacets.ts`) does:

```ts
async function seedMethodFacets() {
  const sections: Section[] = [
    "communication",
    "membership",
    "decisionApproaches",
    "conflictManagement",
  ];

  for (const section of sections) {
    const facets = await loadSectionFacets(section); // reads + Zod-validates the JSON
    await prisma.$transaction([
      prisma.methodFacet.deleteMany({ where: { section } }),
      prisma.methodFacet.createMany({
        data: flattenSectionFacets(section, facets),
      }),
    ]);
  }
}
```

- **Validation runs first.** `loadSectionFacets` reads the JSON and runs
  the Zod schema against it; any orphan slug, missing facet group, or
  unknown facet value fails the seed.
- **Per-section atomic swap.** Delete-then-create inside one
  transaction so the DB is never partially populated.
- **No flags, no `--dry-run`, no fixture workbooks.** The seed is
  idempotent and cheap (~80 methods × 19 facets = ~1500 rows total);
  re-running on every prisma seed is fine.
- **No app-boot validator.** Authoring errors surface in CI (parity
  test, §3) or at `prisma db seed` time — never at request time.

---

## 9. APIs

Endpoints follow §5.1 conventions. List and method routes support
optional `facet.*` ranking. `GET /api/create-flow/methods` returns the
full catalog (copy + optional scores); `GET /api/templates/[slug]` returns
template detail and composition. The in-app wizard may still read messages
via `useMessages()`; external clients should use the HTTP catalog (English
v1 only today).

### 9.1 `GET /api/templates`

Optional facet query params:

- `facet.size=<valueId>` (repeatable)
- `facet.orgType=<valueId>`
- `facet.scale=<valueId>`
- `facet.maturity=<valueId>`

Behavior:

- No params → existing curated ordering (`featured`, `sortOrder`,
  `title`), no scoring.
- With facets → score each template by joining its `body`-referenced
  method slugs against `MethodFacet` and **summing matches**, then
  sort highest-first.

**Scoring algorithm (simple count, v1).**

For each template, build the set of `(section, slug)` pairs from
`RuleTemplate.body` (the existing curated composition). For each
`(section, slug)` pair, count how many of the requested
`facet.<group>=<value>` query params match an existing
`MethodFacet { matches: true }` row. The template's score is the
**sum across all its methods**:

```
score(template)
  = Σ over (section, slug) in template.body:
      Σ over (group, value) in requested facets:
        1 if MethodFacet exists with matches=true for (section, slug, group, value)
        else 0
```

Notes:
- A template with five matching methods scores ~5× a template with one
  matching method, which is the desired bias toward whole-stack fit.
- `weight` in `MethodFacet` is **ignored** by v1 — it's only there so
  authors can store nuance for a future weighted-rank pass without a
  migration.
- Ties broken by today's curated ordering (`featured` desc → `sortOrder`
  asc → `title` asc) so no-facets and zero-match cases produce identical
  output to the existing endpoint.
- Templates with `score = 0` are still returned, ranked last by the
  curated tie-break (recommendations rank, never hide; see §10).

Response:

```ts
{
  templates: RuleTemplateDto[],
  scores?: Record<string, { score: number; matchedFacets: string[] }>
}
```

`scores[slug].matchedFacets` is the deduped list of
`"<section>:<slug>:<group>:<value>"` keys that contributed, useful for
debugging and for an eventual "Why this template?" UI tooltip.

### 9.2 `GET /api/create-flow/methods?section=<section>[&facet.*=...]`

Public catalog for one facet. Powers wizard re-ranking (scores) and
external method browsers (full copy). Assembler:
`lib/server/governanceCatalog.ts`.

**`section` values:** `communication`, `membership`,
`decisionApproaches`, `conflictManagement`, `coreValues` (query alias
`values` → `coreValues`). Core values have **no** `MethodFacet` rows;
`facet.*` is ignored for `coreValues`.

**Method sections** — full deck, messages authoring order:

```ts
{
  section: "communication" | "membership" | "decisionApproaches" | "conflictManagement",
  methods: Array<{
    slug: string;
    label: string;
    description: string;  // messages supportText
    sections: Record<string, unknown>;
    matches?: { score: number; matchedFacets: string[] };  // present when facet.* sent
  }>
}
```

**Core values** — preset list; `id` is `"1"` … `"n"` (position in
`coreValues.json`, not a kebab slug):

```ts
{
  section: "coreValues",
  methods: Array<{
    id: string;
    label: string;
    meaning: string;
    signals: string;
  }>
}
```

**Scoring algorithm** (method sections only). Same simple count as §9.1:

```
score(method)
  = Σ over (group, value) in requested facets:
      1 if MethodFacet exists with matches=true for (section, method.slug, group, value)
      else 0
```

With `facet.*` present, methods are **ranked by `matches.score` desc**,
then authoring order; **all** methods are returned (zero-score rows stay
in the deck). Without facets, `matches` is omitted and order is
authoring order. `Cache-Control: public, max-age=3600`.

Server: `listMethodRecommendations` + `listCatalogMethods` /
`listCatalogCoreValues`. DB failure with facets still returns the full
catalog without `matches` (wizard treats scores as 0).

### 9.4 `GET /api/templates/[slug]`

Single seeded template. Public read; `404` when unknown.

```ts
{
  template: RuleTemplateDto,
  methods: Array<{ section: SectionId; slug: string }>  // templateMethodsFromBody(body)
}
```

`Cache-Control: public, max-age=3600`. List behavior unchanged in §9.1.

### 9.5 External catalog consumers

1. Cache section responses (`GET /api/create-flow/methods?section=…`).
2. Render cards from `label` + `description`; modal bodies from `sections`.
3. Template preview: `GET /api/templates/:slug` → join each
   `{ section, slug }` to the cached section catalog.
4. Do not import Next.js `messages/` from outside the app — treat these
   GET routes as the stable contract until copy is served from a CMS or
   database instead of committed JSON.

### 9.3 `POST /api/templates/recommend` (optional)

If product wants to send the full `CreateFlowState` instead of just
facet ids, body schema can reuse `createFlowStateSchema`. Not
implemented today.

**Empty / partial facets:** never error. Fall back to today's ordering
and return all rows.

---

## 10. Wizard wiring

- `communication-methods` / `membership-methods` / `decision-approaches`
  / `conflict-management` screens each call
  `GET /api/create-flow/methods?section=...&facet.*=...` for scores
  (`matches.score` per slug). Card label, description, and modal copy
  still come from `useMessages().create.customRule.<section>.methods`
  in-app; external clients use the API copy fields (§9.5). Each screen
  reorders the messages array via `rankMethodsByScore` (full deck
  returned; zero-score slugs sort to authoring order).
- API failure or empty facets → render the messages deck in its on-disk
  order. No regression from today.
- Selecting a template on the template-review page via **Customize**
  prefills the create flow's `selected*MethodIds` and core-values chip
  snapshot from the template's composition — see
  [`buildTemplateCustomizePrefill`](../../lib/create/applyTemplatePrefill.ts)
  and the `handleCustomizeTemplate` handler in
  `CreateFlowLayoutClient.tsx`.
- Recommendations **never hide** options — ranking only. Authors expect
  to see "all 32 decision-making patterns" with the matching ones
  surfaced first.

---

## 11. Resolved decisions (no open questions)

- ~~Where card copy lives~~ → `messages/en/create/customRule/*.json`,
  flat `methods` array per file. Done.
- ~~Card / modal split in messages files~~ → collapsed into a single
  `methods` array; modal title/description derive from each entry's
  `label`/`supportText`. Done.
- ~~`rightRail.json` rename~~ → file is now
  `messages/en/create/decisionApproaches.json`; namespace is
  `m.create.decisionApproaches` (and will become
  `m.create.customRule.decisionApproaches` after the §1c folder reorg).
  Done.
- ~~Facet authoring format~~ → typed JSON files committed under
  `data/create/customRule/`, validated by Zod. No spreadsheets at
  runtime, no `xlsx` dep, no importer.
- ~~Where facet data lives at runtime~~ → JSON is canonical; DB is
  hydrated at seed time for join-friendly queries.
- ~~Decision-making `Consensus Level` scale~~ → integer 0-100 in
  messages; the original spreadsheet's 0.0-1.0 floats were converted
  during the one-time content ingest.
- ~~Membership section key naming~~ → `eligibility` /
  `joiningProcess` / `expectations` (matches wizard).
- ~~Scoring vs filtering~~ → ranking only; never hide rows (§10).
- ~~`RuleTemplate` rows~~ → stay hand-curated in `prisma/seed.ts`
  `COMPOSITION_BY_SLUG`. The matrix just adds ranking; it doesn't
  regenerate templates.
- ~~Values matrix~~ → out of scope. Values are baked into each
  curated template (and authored in `coreValues.json` for the
  open-ended wizard step). No facet matrix needed; if a template is
  recommended, its values come along statically.
- ~~Ranking algorithm~~ → simple count (sum of `MethodFacet { matches:
  true }` rows touched by the requested facets); per-method for §9.2
  and per-template (sum across composed methods) for §9.1. `weight` is
  reserved for a future v2; ignored by v1.
- ~~Boot-time validation~~ → none. Parity is enforced by the seed step
  (§8) and the parity test in CI (§3, §12). No `next dev` startup hook.
- ~~Messages folder layout~~ → three-stage folders under
  `messages/en/create/` (§1c). Facet paths assume that layout.
- ~~Spreadsheet handoff~~ → the four `~/Downloads/*.xlsx` files are
  passed to the implementing agent alongside this doc. They are **not**
  committed; the post-ingest `messages/en/create/customRule/*.json`
  and `data/create/customRule/*.json` files are the historical record.

---

## 12. Test plan

- [x] `prisma db seed` populates `MethodFacet` from the four
      `data/create/customRule/<section>.json` files with no errors,
      producing the expected row count
      (`(11 + 19 + 32 + 19) × 19 = 1539` rows max, fewer if authors
      use the omit-default shorthand).
- [x] `tests/unit/methodFacets.test.ts` asserts every method slug in
      each facet file matches a `methods[].id` in the corresponding
      messages file (and vice-versa) — no orphans either way. Also
      asserts every `chipId` in `_facetGroups.json` resolves to a real
      position in the referenced messages file (off-by-one fails).
- [x] `tests/unit/methodFacetsSchemas.test.ts` exercises the Zod schema
      (rejects unknown facet values, unknown groups, unknown sections,
      malformed booleans).
- [x] `tests/unit/methodRecommendations.test.ts` exercises the scoring
      function directly with a fixture set: a method matching 2 of 3
      requested facets scores `2`; a template composing two methods
      that each match `2` and `3` requested facets scores `5`; ties
      fall back to curated `(featured, sortOrder, title)` order.
- [x] `GET /api/create-flow/methods?section=conflictManagement&facet.orgType=nonprofit`
      returns all 19 methods, ranked, with the `nonprofit`-matching
      methods scoring higher than non-matching ones; zero-match
      methods preserve their on-disk authoring order.
- [x] `GET /api/templates?facet.orgType=nonprofit&facet.size=sixToTwelve`
      returns templates re-ordered by composed-method match count, with
      score-0 templates still present at the end in curated order.
- [x] No-facets `GET /api/templates` matches today's curated ordering
      (no regression for the existing marketing/templates surfaces).
- [x] DB-down smoke: with `DATABASE_URL` unset, the four wizard
      card-deck steps still render the full deck from messages (no
      5xx, no broken cards).
- [x] Editing a `data/create/customRule/<section>.json` entry and
      re-running `prisma db seed` changes the rank order returned by
      both endpoints without any code change.

---

## 13. Source files referenced

- `prisma/schema.prisma` — `RuleTemplate`, `MethodFacet`, `TemplateFacet`.
- `prisma/seed.ts` — curated templates + `seedMethodFacets` (§8).
- `app/api/templates/route.ts` — list + optional facet params (§9.1).
- `app/api/templates/[slug]/route.ts` — detail + composition (§9.4).
- `lib/server/governanceCatalog.ts` — catalog DTOs from messages (§9.2).
- `app/api/drafts/me/route.ts` — reference route shape.
- `lib/server/db.ts` — Prisma singleton.
- `lib/server/responses.ts` — `dbUnavailable()`.
- `lib/server/ruleTemplates.ts` — `listRuleTemplatesFromDb` (extend with
  facet param + scoring helper).
- `lib/server/methodRecommendations.ts` — facet scoring for §9.1–9.2.
- `lib/server/validation/methodFacetsSchemas.ts` — Zod schema
  for the JSON facet files and the API request shapes.
- `lib/server/validation/createFlowSchemas.ts` — reuse facet-id arrays
  rather than redeclaring them.
- `lib/server/validation/requestBody.ts` — `readLimitedJson`.
- `lib/server/validation/zodHttp.ts` — `jsonFromZodError`.
- `lib/logger.ts` — server-side `logger`.
- `app/(app)/create/types.ts` — `CreateFlowState` and facet fields.
- `app/(app)/create/utils/flowSteps.ts` — canonical step order.
- `app/(app)/create/utils/createFlowScreenRegistry.ts` — screen
  metadata.
- `app/(app)/create/screens/select/CommunityStructureSelectScreen.tsx`
  — chip-id derivation pattern (positional `String(i+1)`).
- `app/(app)/create/screens/card/CommunicationMethodsScreen.tsx` (and
  the three sibling screens) — already iterate `methods[]` via
  `methodById`; the API ranking layer plugs in here.
- `messages/en/create/customRule/{communication,membership,decisionApproaches,conflictManagement}.json`
  — flat `methods` arrays. Source of truth for in-app copy;
  the matrix never edits these.
- `messages/en/create/{community,reviewAndComplete}/*.json` — the other
  two other create stages; not consumed by the matrix but listed for
  context alongside §1c.
- `data/create/customRule/{communication,membership,decisionApproaches,conflictManagement}.json`
  — facet matches per method.
- `data/create/customRule/_facetGroups.json` — canonical facet
  group/value ids and the wizard-chip-id ↔ facet-value-id mapping.
- `tests/unit/createFlowValidation.test.ts` — Vitest pattern for
  schema/parity tests.
- `tests/unit/governanceCatalog.test.ts` — catalog ↔ messages parity.
- `tests/unit/createFlowMethodsRoute.test.ts` — methods API routes.
- `tests/unit/templatesBySlugRoute.test.ts` — template detail route.

---

## Appendix — Source workbooks (one-time authoring artifact)

These four spreadsheets are **handed to the implementing agent
alongside this doc**. They were used once to seed the messages content
(already done) and will be used once more to transcribe the facet
matches into `data/create/customRule/*.json` per §6's "One-time
transcription" steps. They are **not** committed to the repo, **not**
part of the runtime contract, and **not** referenced by any code path.

| File (in `~/Downloads/`) | Sheet | Rows | Section |
| --- | --- | --- | --- |
| `Communication Methods.xlsx` | `Current` | 11 | `communication` |
| `Group_Membership_Methods.xlsx` | `Current` | 19 | `membership` |
| `Decision-making.xlsx` | `Current` | 32 | `decisionApproaches` |
| `Conflict Management Methods.xlsx` | `Current` | 19 | `conflictManagement` |

Each workbook's leading columns hold the descriptive copy already
ingested into `messages/en/create/customRule/<section>.json`; the
trailing 19 columns hold the facet matches that need to land in
`data/create/customRule/<section>.json`. Ongoing facet edits happen
directly in those JSON files — the workbooks are
historical reference only, and the committed JSON (in both `messages/`
and `data/`) is the canonical record.
