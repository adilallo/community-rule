# Next 16 substrate evaluation (Phase 3)

Evaluation of `experimental.cacheComponents` (formerly `experimental.ppr`)
and React Compiler against this repo on Next.js 16.2.6. Originally written
as a canary report when both flags were deferred; updated when both shipped
as follow-up work (see "Outcome" sections below).

## TL;DR

| Flag | Recommendation | Status |
| --- | --- | --- |
| `cacheComponents` (PPR successor) | **Ship** | **Shipped.** `force-dynamic` removed from `(app)` and `(admin)` layouts; `<ConditionalNavigation />` (and `<MarketingNavigation />`) wrapped in `<Suspense fallback={null}>`. `(app)`/`(admin)` routes are now `◐ Partial Prerender` instead of `ƒ Dynamic`. `/` static shell dropped from 45 KB → 11.7 KB gzipped. |
| React Compiler | **Ship (annotation mode)** | **Shipped (plumbing only).** `babel-plugin-react-compiler` + `eslint-plugin-react-compiler` installed. `reactCompiler: { compilationMode: "annotation" }` enabled in `next.config.mjs`. ESLint rule wired in at "warn" — found 31 latent warnings across 8 files (none introduced by this change). Migrating containers to `"use memo"` is a future task. |

Both flags now ship in `main`. The findings below describe what changed in
Next 16, what work each required, and the outcomes.

## Repo baseline (Next 16.2.6, Turbopack, no experimental flags)

- Build status: clean (`npx next build`)
- Static routes: `/`, `/_not-found`, `/about`, `/blog`, `/components-preview`,
  `/how-it-works`, `/learn`, `/templates`, `/use-cases`
- SSG routes: `/blog/[slug]`, `/use-cases/[slug]`, `/use-cases/[slug]/rule`
- Dynamic routes: all `/api/*`, `/create`, `/create/[screenId]`,
  `/create/review-template/[slug]`, `/login`, `/monitor`, `/profile`,
  `/rules/[id]`
- `.next/static` total: **3.6 MB** (uncompressed)

Note: Next 16 with Turbopack no longer prints per-route first-load JS sizes
in the build summary. Bundle analyzer (`ANALYZE=true`) is the canonical
source for size data — see Phase 4a.

## 3a. `cacheComponents` (PPR) — SHIPPED

### What changed in Next 16

`experimental.ppr` has been merged into `experimental.cacheComponents`:

```
Error: experimental.ppr has been merged into cacheComponents. The Partial
Prerendering feature is still available, but is now enabled via cacheComponents.
```

Crucially, the per-route incremental opt-in is gone:

```
cacheComponents: invalid type: string "incremental", expected a boolean
```

So `cacheComponents: true` flips PPR semantics on globally for every route.

### Blocker

With `cacheComponents: true`, the build fails:

```
./app/(admin)/layout.tsx:6:14
Route segment config "dynamic" is not compatible with `nextConfig.cacheComponents`.
Please remove it.

./app/(app)/layout.tsx:8:14
Route segment config "dynamic" is not compatible with `nextConfig.cacheComponents`.
Please remove it.
```

Both layouts use `export const dynamic = "force-dynamic"` to render
session-aware chrome (set in Phase 4b of the prior plan). `cacheComponents`
requires expressing that dynamism via `<Suspense>` boundaries plus
`unstable_noStore()`/`unstable_cache()` instead of route-segment `dynamic`.

### Work performed

1. Removed `export const dynamic = "force-dynamic"` from
   [app/(app)/layout.tsx](../../app/(app)/layout.tsx) and
   [app/(admin)/layout.tsx](../../app/(admin)/layout.tsx).
2. Wrapped `<ConditionalNavigation />` (server component reading
   `getNavAuthSignedIn()` → `cookies()`) in `<Suspense fallback={null}>` in
   both layouts.
3. Same change for `<MarketingNavigation />` in
   [app/(marketing)/layout.tsx](../../app/(marketing)/layout.tsx) — the
   marketing nav reads `usePathname()` (uncached per request) and would
   otherwise block the static shell at routes like `/rules/[id]`.
4. Enabled `experimental.cacheComponents: true` in
   [next.config.mjs](../../next.config.mjs).

`unstable_noStore()` already sits inside `getNavAuthSignedIn()`; no
additional cache primitives were needed.

### Why `fallback={null}` and not a placeholder

Any non-null fallback would also need to live in the static shell. The
existing `ConditionalNavigationClient` reads `usePathname()` to decide
chromeless paths (`/create/*`, `/login`), which is uncached data —
disallowed in the static shell under `cacheComponents`. A truly static
placeholder is possible but would cause layout shift on routes that
ultimately render no nav. Trade-off accepted: brief blank-nav while the
dynamic island streams in.

### Outcome (measured against `npx next build`)

| Route group | Before | After |
| --- | --- | --- |
| `/`, `/about`, `/blog`, `/components-preview`, `/how-it-works`, `/learn` | `○ Static` | `○ Static` |
| `/create`, `/create/[screenId]`, `/profile`, `/monitor`, `/login`, `/rules/[id]` | `ƒ Dynamic` | `◐ Partial Prerender` |
| `/templates`, `/use-cases`, `/use-cases/[slug]`, `/blog/[slug]` | `○ Static` / `◐ SSG` | `◐ Partial Prerender` |

`/` static shell: 45 KB gzipped → 11.7 KB gzipped (74% reduction). All
196 test files / 1251 tests pass.

## 3b. React Compiler — SHIPPED (annotation mode, plumbing only)

### What changed in Next 16

`experimental.reactCompiler` moved to the top-level `reactCompiler` key:

```
⚠ `experimental.reactCompiler` has been moved to `reactCompiler`. Please
update your next.config.mjs file accordingly.
```

And requires the babel plugin to be installed:

```
Failed to resolve package babel-plugin-react-compiler while attempting to
resolve React Compiler. We attempted to resolve React Compiler relative
to the next package. Is babel-plugin-react-compiler installed in your
node_modules directory?
```

### Work performed

1. `npm install --save-dev babel-plugin-react-compiler eslint-plugin-react-compiler`.
2. Added top-level `reactCompiler: { compilationMode: "annotation" }` to
   [next.config.mjs](../../next.config.mjs).
3. Wired `react-compiler/react-compiler` as `"warn"` in
   [eslint.config.mjs](../../eslint.config.mjs) (both JS and TS plugin blocks).
4. No `"use memo"` directives added in this pass — the goal is plumbing,
   not migration. The compiler is a no-op until components opt in.

### Why annotation mode first (unchanged from original plan)

We have many hand-rolled memoized containers. The risk of `compilationMode: "all"`
on day one is that the compiler bails on a critical component in a way that
changes render counts. Annotation mode lets us migrate one component at a
time with eslint enforcement.

### ESLint audit results

`npx eslint app lib` after wiring the rule found **31 react-compiler warnings
across 8 files**:

| Category | Count |
| --- | --- |
| "Hooks may not be referenced as normal values" (passing hook references as values) | 25 |
| "Writing to a variable defined outside a component or hook" (module-level mutation) | 2 |
| "Hooks must always be called in a consistent order" (conditional hooks) | 2 |
| "React Compiler skipped optimizing" (file has React rules disabled) | 2 |

Files flagged:
- `app/(app)/create/context/CreateFlowContext.tsx`
- `app/(app)/create/hooks/useCompletedRuleShareExport.ts`
- `app/(marketing)/use-cases/[slug]/page.tsx`
- `app/(marketing)/use-cases/page.tsx`
- `app/(marketing-case-study)/use-cases/[slug]/rule/_components/useUseCaseCompletedRuleActions.ts`
- `app/(marketing-case-study)/use-cases/[slug]/rule/page.tsx`
- `app/components/controls/SelectInput/SelectInput.container.tsx`
- `app/components/sections/RelatedArticles/RelatedArticles.view.tsx`

All warnings are latent (not introduced by this change). The compiler runs
in annotation mode, so these files are not affected at runtime until they
opt in. Not fixed in this commit — these are the migration targets to
address before flipping to `compilationMode: "all"`.

### Verification

- Test suite green: 196 files / 1251 tests pass.
- Build green: `npx next build` clean with the new config.
- TSC clean.
- Bundle size delta minimal — no `"use memo"` annotations means no compiler
  runtime calls are emitted in user code yet.

## Impact on Phase 4 (MessagesProvider)

Phase 4 (route-scoped `MessagesProvider`) shipped before this work. With
`cacheComponents` now enabled, the marketing routes' messages dictionary
lives in the static shell — cached at the CDN with no per-request cost.
The route-scoping is still a win for the dynamic islands' RSC payload, but
the static-shell win is now structural, not bundle-size dependent.

## Follow-up work

`cacheComponents` and React Compiler annotation mode now ship. Remaining
work (file separately when scheduled):

1. **Migrate top React Compiler bail sites.** Fix the 31 latent warnings
   (especially the hook-reference patterns in `CreateFlowContext` and the
   conditional hooks in `SelectInput.container`) so those files become
   compiler-eligible.
2. **Annotate high-render containers with `"use memo"`.** Targets:
   `CreateFlowProvider`, `AuthModalProvider`, list-heavy views. Measure
   render counts before/after with React DevTools profiler.
3. **Flip React Compiler from `annotation` to `all`** once the bail list is
   green and a critical mass of containers are annotated. Remove
   hand-written `useMemo`/`useCallback` the compiler subsumes.
4. **Audit `<Suspense fallback={null}>` UX on (app)/(admin) routes.** If
   blank-nav flash becomes noticeable on slow connections, replace the
   `null` fallback with a static placeholder that doesn't read `usePathname`
   (e.g. a `min-h` div sized to the nav).
