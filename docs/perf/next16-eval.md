# Next 16 substrate evaluation (Phase 3)

Evaluation of `experimental.cacheComponents` (formerly `experimental.ppr`)
and React Compiler against this repo on Next.js 16.2.6. Performed as a
canary build pass without committing either flag to `main`.

## TL;DR

| Flag | Recommendation | Why |
| --- | --- | --- |
| `cacheComponents` (PPR successor) | **Defer** — requires a follow-up refactor before it can ship | Renamed from `ppr` in Next 16; now a boolean global toggle, no per-route `experimental_ppr` opt-in. Requires removing `force-dynamic` from `(app)` and `(admin)` layouts and re-expressing session-aware dynamism via Suspense + cache primitives. |
| React Compiler | **Defer** — config surface moved + missing dep | Moved out of `experimental` to the top-level `reactCompiler` key in Next 16. Requires installing `babel-plugin-react-compiler`. No blocking codebase incompatibilities found in the canary surface, but the install + eslint plugin setup is its own follow-up task. |

Neither flag was shippable as a pure config flip in this audit. The findings
below describe what changed in Next 16 and the work each would require.

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

## 3a. `cacheComponents` (PPR) — DEFER

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

### Estimated work to ship

1. Refactor [app/(app)/layout.tsx](../../app/(app)/layout.tsx) and
   [app/(admin)/layout.tsx](../../app/(admin)/layout.tsx) so the
   `ConditionalNavigation` session fetch sits inside a `<Suspense>` boundary
   with a fallback that matches the generic chrome.
2. Mark the session-reading components with `unstable_noStore()` (or the
   stable equivalent in Next 16) so they opt out of the static cache.
3. Verify the existing static routes (`/`, `/about`, `/blog`, etc.) still
   prerender; add `<Suspense>` boundaries around any future dynamic islands.
4. Confirm `(marketing)` routes still serve from CDN with the static shell
   while the personalized nav island streams.

This is the natural next step after Phase 4b made marketing static, but
it's not a config-only change. Ticket separately.

### Verification (when shipping)

- `(marketing)` routes still appear as `○ Static` in build output.
- `(app)`/`(admin)` routes' static shell prerenders; the personalized nav
  streams (visible in `curl` of the HTML — partial shell first, then nav).
- TTFB on `(marketing)` unchanged or improved.

## 3b. React Compiler — DEFER

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

### Estimated work to ship

1. `npm install --save-dev babel-plugin-react-compiler eslint-plugin-react-compiler`.
2. Add `reactCompiler: { compilationMode: "annotation" }` to `next.config.mjs`
   (top-level, not under `experimental`).
3. Enable `eslint-plugin-react-compiler` and run it against the repo to
   surface components that would bail (refs mutated during render, reads
   of non-reactive globals inline, etc.).
4. Incrementally add `"use memo"` directives to high-render-frequency
   containers (`CreateFlowProvider`, `AuthModalProvider`, list-heavy views).
5. Once stable, flip `compilationMode: "all"` and remove hand-written
   `useMemo`/`useCallback` where the compiler subsumes them.

### Why annotation mode first

We have many hand-rolled memoized containers. The risk of `compilationMode: "all"`
on day one is that the compiler bails on a critical component in a way that
changes render counts. Annotation mode lets us migrate one component at a
time with eslint enforcement.

### Verification (when shipping)

- Bundle size before/after `next build` with the runtime added.
- Test suite green (`npx vitest run` — 196 files / 1251 tests today).
- Component render counts unchanged or reduced on key surfaces (use the
  React DevTools profiler on `/create/informational` and `/`).

## Impact on Phase 4 (MessagesProvider)

If we later ship `cacheComponents`, the MessagesProvider refactor's win
shrinks meaningfully: the messages dictionary lives in the static shell of
every route, and only the dynamic island re-fetches. The static prerender
output is already cacheable at the CDN. So Phase 4 should be re-evaluated
**after** the `cacheComponents` work lands, not before.

If we don't ship `cacheComponents`, Phase 4's bundle-size measurement
(Phase 4a) is still the right gate — measure first, refactor only if the
data justifies it.

## What to do now

- Skip both flags for this performance follow-ups plan.
- File two follow-up tickets:
  1. "Enable `cacheComponents`: refactor `(app)`/`(admin)` layouts to
     Suspense + cache primitives, remove `force-dynamic` from route segments."
  2. "Adopt React Compiler in annotation mode: install plugin, enable
     eslint rule, migrate top containers."
- Proceed with Phase 4a (measure) and let the data drive Phase 4b.
