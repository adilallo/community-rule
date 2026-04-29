# Create rule flow (custom wizard) — canonical reference

Product/engineering reference for the **custom** “Create rule” experience: URL order, persistence, and entry points. **Canon wizard** alignment (docs, `[screenId]` routing, footer progress) shipped under **[CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo)** (**Done**). **Draft resume vs profile**, server hydration, and “new rule” vs **continue draft** are tracked with **[CR-86](https://linear.app/community-rule/issue/CR-86/backend-profile-dashboard-account-figma-profile)** (profile dashboard). See also [docs/guides/backend-linear-tickets.md](guides/backend-linear-tickets.md) **Ticket 17**.

---

## Product stages (Figma)

The Figma **Create Community** sequence is the **source of truth** for the first segment of the wizard (eight frames). After **`review`**, the flow continues with **Create Custom CommunityRule** and **Review and complete** stages. The shipped URL sequence in [`FLOW_STEP_ORDER`](../app/(app)/create/utils/flowSteps.ts) **follows that trajectory**; stages are a **product** slice of that linear order, not separate routers today.

| Stage (Figma) | Purpose (summary) | `CreateFlowStep` values (in order) |
| --- | --- | --- |
| **Create Community** | Intro, naming, structure, context, size, upload, save progress (email), then community review. | `informational` → `community-name` → `community-structure` → `community-context` → `community-size` → `community-upload` → `community-save` → `review` |
| **Create Custom CommunityRule** | Author the CommunityRule content and structure (core values + four card-stack categories). | `core-values` → `communication-methods` → `membership-methods` → `decision-approaches` → `conflict-management` |
| **Review and complete** | Stakeholders, final card, publish, success. | `confirm-stakeholders` → `final-review` → `completed` |

Treat these stages as the **canonical product sections** when adding chrome (e.g. stage headers, progress copy), breaking work across teams, or reusing flows in other surfaces. **Layout kind** is **not** encoded in the URL; it lives in [`CREATE_FLOW_SCREEN_REGISTRY`](../app/(app)/create/utils/createFlowScreenRegistry.ts) (Figma node id + `layoutKind` per step). Figma defines eight layout kinds: **informational**, **text**, **select**, **upload**, **review**, **card**, **right-rail**, **completed** — `CreateFlowLayoutKind` and [`app/(app)/create/screens/`](../app/(app)/create/screens/) mirror that list (one folder per kind; multiple steps may share a kind, e.g. several **select** screens).

**Create from template (future):** A full **template-driven** create path is **not** finalized; it will likely live on **additional route(s)** (and may reuse these stages where it overlaps the custom trajectory). Today, **`/create/review-template/[slug]`** is only an auxiliary **preview** in the create shell; it is **not** a Figma stage and not the final template-create entry. See **Out of scope** in [CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo).

---

## Step order and URLs

Order is defined in code by [`FLOW_STEP_ORDER`](../app/(app)/create/utils/flowSteps.ts) and the [`CreateFlowStep`](../app/(app)/create/types.ts) type. Wizard steps use a **single dynamic route**: [`app/(app)/create/[screenId]/page.tsx`](../app/(app)/create/[screenId]/page.tsx), which validates `screenId` and renders [`CreateFlowScreenView`](../app/(app)/create/screens/CreateFlowScreenView.tsx). Implementation files are grouped under [`app/(app)/create/screens/`](../app/(app)/create/screens/) by Figma **layout kind** (subfolders: informational, text, select, upload, review, card, right-rail, completed). **`/create`** redirects to the first step.

| Order | Figma stage | Step ID (`screenId`) | Path |
| ----: | ----------- | -------------------- | ---- |
| 1 | Create Community | `informational` | `/create/informational` |
| 2 | Create Community | `community-name` | `/create/community-name` |
| 3 | Create Community | `community-structure` | `/create/community-structure` |
| 4 | Create Community | `community-context` | `/create/community-context` |
| 5 | Create Community | `community-size` | `/create/community-size` |
| 6 | Create Community | `community-upload` | `/create/community-upload` |
| 7 | Create Community | `community-save` | `/create/community-save` |
| 8 | Create Community (review frame) | `review` | `/create/review` |
| 9 | Create Custom CommunityRule | `core-values` | `/create/core-values` |
| 10 | Create Custom CommunityRule | `communication-methods` | `/create/communication-methods` |
| 11 | Create Custom CommunityRule | `membership-methods` | `/create/membership-methods` |
| 12 | Create Custom CommunityRule | `decision-approaches` | `/create/decision-approaches` |
| 13 | Create Custom CommunityRule | `conflict-management` | `/create/conflict-management` |
| 14 | Review and complete | `confirm-stakeholders` | `/create/confirm-stakeholders` |
| 15 | Review and complete | `final-review` | `/create/final-review` |
| 16 | Review and complete | `completed` | `/create/completed` |

**Primary entry:** marketing header **Create rule** and profile **Create new custom Rule** both run **`prepareFreshCreateFlowEntry`** then navigate to **`/create`**, which redirects to **`/create/informational`** (see [`Top.container.tsx`](../app/components/navigation/Top/Top.container.tsx) and [`ProfilePageClient.tsx`](../app/(app)/profile/ProfilePageClient.tsx)).

Active step for chrome and navigation is resolved from the pathname via [`parseCreateFlowScreenFromPathname`](../app/(app)/create/utils/flowSteps.ts) inside [`useCreateFlowNavigation`](../app/(app)/create/hooks/useCreateFlowNavigation.ts).

### Fresh start vs continue draft (signed-in + sync)

**Established pattern:** anonymous and signed-in users should see the **same** wizard when starting a **new** rule from marketing or profile: empty state at the first step, with no surprise reload of old work. Signed-in users additionally get **Save & Exit** and **publish**; their in-progress payload may also live on **`/api/drafts/me`** when `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true`.

- **New rule entry** (always a clean slate): call [`prepareFreshCreateFlowEntry`](../app/(app)/create/utils/prepareFreshCreateFlowEntry.ts) **before** `router.push` into `/create` or `/create/review-template/...`. It clears **`create-flow-anonymous`** and the core-value-details `localStorage` key; when sync is on, it **`DELETE`s `/api/drafts/me`** so [`SignedInDraftHydration`](../app/(app)/create/SignedInDraftHydration.tsx) does not rehydrate a stale server draft after local storage was wiped.
- **Continue saved draft** (profile): do **not** call `prepareFreshCreateFlowEntry`. Clear the same `localStorage` keys **only** (see [`ProfilePageClient`](../app/(app)/profile/ProfilePageClient.tsx) `handleContinueDraft`) so the client mirror is empty, then navigate to **`/create/{savedStep}`**. Hydration loads the server draft; the URL may be corrected to `currentStep` when it differs from the path.
- **Local-only wipe** without touching the server: [`clearCreateFlowPersistedDrafts`](../app/(app)/create/utils/clearCreateFlowPersistedDrafts.ts) (same two `localStorage` keys). Prefer **`prepareFreshCreateFlowEntry`** for any user-facing “start new rule” navigation so signed-in + sync stays aligned with anonymous.

Call sites for **`prepareFreshCreateFlowEntry`**: [`Top.container.tsx`](../app/components/navigation/Top/Top.container.tsx) (Create rule), profile **Create new custom Rule** ([`ProfilePageClient.tsx`](../app/(app)/profile/ProfilePageClient.tsx)), home **Popular templates** ([`RuleStack.container.tsx`](../app/components/sections/RuleStack/RuleStack.container.tsx)), and **direct** `/templates` template picks ([`TemplatesPageClient.tsx`](../app/(marketing)/templates/TemplatesPageClient.tsx)) when **`fromFlow` is absent**.

---

## Auxiliary route (not a wizard step or Figma stage)

| Path | Purpose |
| --- | --- |
| `/create/review-template/[slug]` | Template preview in the create shell; uses the same layout/footer chrome as other create pages but **is not** part of `FLOW_STEP_ORDER` **or** the three Figma stages above. |

From that page, **Customize** pre-fills the custom-rule selections on the current `CreateFlowState` (via [`buildTemplateCustomizePrefill`](../lib/create/applyTemplatePrefill.ts)) and routes to **`/create/core-values`** when the community name (`state.title`) is already set, otherwise to **`/create/informational`**. Name-only is the gate because other community-stage fields (e.g. `communityStructureChipSnapshots`) are sticky once the user lands on those screens; a non-empty title is also the minimum bar [`buildPublishPayload`](../lib/create/buildPublishPayload.ts) enforces, so the two checks stay aligned. No query-param plumbing: state persists via the usual anonymous/server-draft mirrors.

**Use without changes** writes the template's `body.sections` into `state.sections` (chip titles only; bodies are empty in seeded templates), resets any prior Customize chip selections so they don't bleed into `document.coreValues`, and routes to **`/create/confirm-stakeholders`**. It does **not** copy the template catalog `description` into `state.summary` — the published rule summary comes from **`communityContext` first**, then `summary`, when the user publishes. At publish, [`buildPublishPayload`](../lib/create/buildPublishPayload.ts) derives `methodSelections` from those section titles, merges preset copy into `document.sections`, and emits structured `methodSelections`. The user then exits via the normal **`final-review → handleFinalize → publishRule`** pipeline, which gates unauthenticated publishes with a **401 → `openLogin`** redirect back to `/create/final-review?syncDraft=1`.

**Entering a template before community stage is done.** When `state.title` is empty, both handlers apply their side effects eagerly (prefill for Customize; `sections` for Use without changes) *and* pin a `pendingTemplateAction: { slug, mode }` on `CreateFlowState` before routing to `/create/informational`. Once the user reaches `/create/review`, [`CommunityReviewScreen`](../app/(app)/create/screens/review/CommunityReviewScreen.tsx) reads the action on mount, clears it via `updateState`, and `router.replace`s past itself — to `/create/core-values` for `customize`, `/create/confirm-stakeholders` for `useWithoutChanges`. The user never sees the community-review page in that flow because their intent was already expressed at the template-review step. `replace` (not `push`) keeps `community-save` as the Back-button target from the destination. The action is cleared on the first fire so later direct visits to `/create/review` render normally.

**Direct entry vs in-flow template pick.** The same `/create/review-template/[slug]` URL is reached from two different origins. We disambiguate at the *click site*, not on the review-template page. **Direct** picks call [`prepareFreshCreateFlowEntry`](../app/(app)/create/utils/prepareFreshCreateFlowEntry.ts) **before** navigation (local + server draft when sync is on — see **Fresh start vs continue draft** above). **In-flow** picks skip that call so the user’s community-stage state survives the detour. Because `CreateFlowProvider` reads `localStorage` in its `useState` initializer, clearing **before** `push` means a direct entry mounts without stale anonymous keys; signed-in users also avoid a stale server draft overwriting the empty mirror.

| Origin | Click-site behavior | URL the user lands on |
| --- | --- | --- |
| Home marketing "Popular templates" ([`RuleStack.container.tsx`](../app/components/sections/RuleStack/RuleStack.container.tsx)) | always `await prepareFreshCreateFlowEntry()` then navigate | `/create/review-template/[slug]` |
| `/templates` index ([`TemplatesPageClient.tsx`](../app/(marketing)/templates/TemplatesPageClient.tsx)) visited directly / via pasted URL | `fromFlow` absent → `await prepareFreshCreateFlowEntry()` then navigate | `/create/review-template/[slug]` |
| In-flow: `/create/review` footer "Create from template" → `/templates?fromFlow=1` → template click | `fromFlow=1` → no fresh-entry prep | `/create/review-template/[slug]` |

Only one `?fromFlow=1` marker exists, on one hop (`/create/review` → `/templates`). It is not forwarded onto the review-template URL. The review-template handlers branch solely on `state.title` — they don't need to know the origin.

**Resume from profile** remains explicit-only: **Continue** clears local mirrors then opens `/create/{step}` so [`SignedInDraftHydration`](../app/(app)/create/SignedInDraftHydration.tsx) can load `/api/drafts/me` when the client buffer is empty. There is no automatic “pick template from marketing → silently merge server draft” path.

**Final-review Rule category chips** are derived from `CreateFlowState` via [`buildFinalReviewCategoriesFromState`](../lib/create/buildFinalReviewCategories.ts): for the Customize / plain custom-rule path it resolves `selected{Communication,Membership,DecisionApproach,ConflictManagement}MethodIds` against the curated method presets in `messages/en/create/customRule/*.json`, and `buildCoreValuesForDocument` supplies the `Values` row from `coreValuesChipsSnapshot` + `selectedCoreValueIds`. For the Use-without-changes path the template body lives in `state.sections`; the helper renders `categoryName` + entry titles directly. The demo chips shipped in `finalReview.json` remain the fallback only when nothing in state resolves to any chip (e.g. direct navigation for development).

**Starting the wizard from a template at `final-review` directly** is out of scope until a dedicated product ticket ships. A **full create-from-template** experience will **likely use separate route(s)** when product and eng define it (may still align conceptually with the same three stages where behavior overlaps the custom path).

---

## Persistence and exit

| Mode | Where progress lives | Save & Exit / server draft |
| --- | --- | --- |
| **Anonymous** | `localStorage` key **`create-flow-anonymous`** | **Exit** opens save-progress magic link; after verify, optional **PUT** `/api/drafts/me` when `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` (see Tickets 4–5 in [guides/backend-linear-tickets.md](guides/backend-linear-tickets.md)). |
| **Signed-in** | In-memory React state in **`CreateFlowContext`** | **Save & Exit** from the **`community-structure`** step onward (step index ≥ `community-structure`) may **PUT** `/api/drafts/me` when sync is on. **Sign out** is on profile, not in the create top nav. |

Details and edge cases (conflict confirm, banners, `?syncDraft=1`) match **Ticket 4**, **Ticket 5**, and [`docs/guides/backend-roadmap.md`](guides/backend-roadmap.md) §12.

---

## Known implementation gaps

- **Profile + drafts (CR-86):** The profile page lists the server draft. **Continue** clears anonymous `localStorage` (and core-value details) then deep-links to `/create/{currentStep}` so hydration loads the server draft. **Create new custom Rule** and marketing **Create rule** use **`prepareFreshCreateFlowEntry`** (local + `DELETE /api/drafts/me` when sync is on) before opening the wizard so signed-in behavior matches a fresh anonymous start. `SignedInDraftHydration` may `router.replace` to the saved step when it applies a server draft so the URL matches hydrated state. Remaining edge cases (e.g. template review routes) are handled when they surface in QA.
- **Inner “text/select shells”:** deferred until Create Community is stable; screens use **`CreateFlowStepShell`** only for Stage 1.

---

## Related docs

- [docs/guides/backend-roadmap.md](guides/backend-roadmap.md) §12 — Frontend hook-up
- [docs/guides/backend-linear-tickets.md](guides/backend-linear-tickets.md) — Tickets 4, 5, 6, 17; profile/drafts — Ticket 15 / **CR-86**
