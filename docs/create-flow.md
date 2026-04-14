# Create rule flow (custom wizard) — canonical reference

Product/engineering reference for the **custom** “Create rule” experience: URL order, persistence, and entry points. **Implementation work** to align code with this doc (progress bar, resume redirects, etc.) is tracked in Linear **[CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo)** and [docs/backend-linear-tickets.md](backend-linear-tickets.md) **Ticket 17**.

---

## Product stages (Figma)

The Figma **Create Community** sequence is the **source of truth** for the first segment of the wizard (eight frames). After **`review`**, the flow continues with **Create Custom CommunityRule** and **Review and complete** stages. The shipped URL sequence in [`FLOW_STEP_ORDER`](../app/create/utils/flowSteps.ts) **follows that trajectory**; stages are a **product** slice of that linear order, not separate routers today.

| Stage (Figma) | Purpose (summary) | `CreateFlowStep` values (in order) |
| --- | --- | --- |
| **Create Community** | Intro, naming, structure, context, size, upload, save progress (email), then community review. | `informational` → `community-name` → `community-structure` → `community-context` → `community-size` → `community-upload` → `community-save` → `review` |
| **Create Custom CommunityRule** | Author the CommunityRule content and structure. | `cards` → `right-rail` |
| **Review and complete** | Stakeholders, final card, publish, success. | `confirm-stakeholders` → `final-review` → `completed` |

Treat these stages as the **canonical product sections** when adding chrome (e.g. stage headers, progress copy), breaking work across teams, or reusing flows in other surfaces. **Layout kind** is **not** encoded in the URL; it lives in [`CREATE_FLOW_SCREEN_REGISTRY`](../app/create/utils/createFlowScreenRegistry.ts) (Figma node id + `layoutKind` per step). Figma defines eight layout kinds: **informational**, **text**, **select**, **upload**, **review**, **card**, **right-rail**, **completed** — `CreateFlowLayoutKind` and [`app/create/screens/`](../app/create/screens/) mirror that list (one folder per kind; multiple steps may share a kind, e.g. several **select** screens).

**Create from template (future):** A full **template-driven** create path is **not** finalized; it will likely live on **additional route(s)** (and may reuse these stages where it overlaps the custom trajectory). Today, **`/create/review-template/[slug]`** is only an auxiliary **preview** in the create shell; it is **not** a Figma stage and not the final template-create entry. See **Out of scope** in [CR-89](https://linear.app/community-rule/issue/CR-89/product-canon-custom-create-rule-wizard-routes-resume-progress-repo).

---

## Step order and URLs

Order is defined in code by [`FLOW_STEP_ORDER`](../app/create/utils/flowSteps.ts) and the [`CreateFlowStep`](../app/create/types.ts) type. Wizard steps use a **single dynamic route**: [`app/create/[screenId]/page.tsx`](../app/create/[screenId]/page.tsx), which validates `screenId` and renders [`CreateFlowScreenView`](../app/create/screens/CreateFlowScreenView.tsx). Implementation files are grouped under [`app/create/screens/`](../app/create/screens/) by Figma **layout kind** (subfolders: informational, text, select, upload, review, card, right-rail, completed). **`/create`** redirects to the first step.

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
| 9 | Create Custom CommunityRule | `cards` | `/create/cards` |
| 10 | Create Custom CommunityRule | `right-rail` | `/create/right-rail` |
| 11 | Review and complete | `confirm-stakeholders` | `/create/confirm-stakeholders` |
| 12 | Review and complete | `final-review` | `/create/final-review` |
| 13 | Review and complete | `completed` | `/create/completed` |

**Primary entry:** marketing header “Create rule” navigates to **`/create`**, which redirects to **`/create/informational`** (see [`TopNav.container.tsx`](../app/components/navigation/TopNav/TopNav.container.tsx)).

Active step for chrome and navigation is resolved from the pathname via [`parseCreateFlowScreenFromPathname`](../app/create/utils/flowSteps.ts) inside [`useCreateFlowNavigation`](../app/create/hooks/useCreateFlowNavigation.ts).

---

## Auxiliary route (not a wizard step or Figma stage)

| Path | Purpose |
| --- | --- |
| `/create/review-template/[slug]` | Template preview in the create shell; uses the same layout/footer chrome as other create pages but **is not** part of `FLOW_STEP_ORDER` **or** the three Figma stages above. |

From that page, **Customize** currently navigates to `/create/informational?template=<slug>`. The **`template` query parameter is reserved**; the informational step **does not** yet read it to prefill `CreateFlowState`. **Starting the wizard from a template at `final-review` or any mid-flow step** is **out of scope** until a dedicated product ticket ships. A **full create-from-template** experience will **likely use separate route(s)** when product and eng define it (may still align conceptually with the same three stages where behavior overlaps the custom path).

---

## Persistence and exit

| Mode | Where progress lives | Save & Exit / server draft |
| --- | --- | --- |
| **Anonymous** | `localStorage` key **`create-flow-anonymous`** | **Exit** opens save-progress magic link; after verify, optional **PUT** `/api/drafts/me` when `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=true` (see Tickets 4–5 in [backend-linear-tickets.md](backend-linear-tickets.md)). |
| **Signed-in** | In-memory React state in **`CreateFlowContext`** | **Save & Exit** from the **`community-structure`** step onward (step index ≥ `community-structure`) may **PUT** `/api/drafts/me` when sync is on. **Sign out** is on profile, not in the create top nav. |

Details and edge cases (conflict confirm, banners, `?syncDraft=1`) match **Ticket 4**, **Ticket 5**, and [`docs/backend-roadmap.md`](backend-roadmap.md) §12.

---

## Known implementation gaps (tracked on CR-89)

- **URL vs `currentStep` in saved draft:** hydration may merge server JSON without redirecting to `state.currentStep`; confirm product behavior and fix or document.
- **Inner “text/select shells”:** deferred until Create Community is stable; screens use **`CreateFlowStepShell`** only for Stage 1.

---

## Related docs

- [docs/backend-roadmap.md](backend-roadmap.md) §12 — Frontend hook-up  
- [docs/backend-linear-tickets.md](backend-linear-tickets.md) — Tickets 4, 5, 6, 17  
