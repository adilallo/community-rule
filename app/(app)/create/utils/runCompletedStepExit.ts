import { CREATE_ROUTES } from "./createFlowPaths";

export type CompletedStepExitRouter = { push: (_href: string) => void };

/**
 * Leaving `/create/completed` (post-publish shell or managing a rule from profile).
 *
 * Clears wizard client state only. Does **not** `DELETE /api/drafts/me` — the stored
 * draft may be unrelated in-progress work for another rule (one `RuleDraft`
 * row per authenticated user).
 */
export function runCompletedStepExit(opts: {
  clearState: () => void;
  clearAnonymousCreateFlowStorage: () => void;
  router: CompletedStepExitRouter;
}): void {
  opts.clearState();
  opts.clearAnonymousCreateFlowStorage();
  opts.router.push(CREATE_ROUTES.root);
}
