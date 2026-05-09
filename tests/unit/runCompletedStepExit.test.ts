import { describe, it, expect, vi } from "vitest";
import { runCompletedStepExit } from "../../app/(app)/create/utils/runCompletedStepExit";

describe("runCompletedStepExit", () => {
  it("clears client draft mirrors and navigates home without implying server DELETE", () => {
    const clearState = vi.fn();
    const clearAnonymousCreateFlowStorage = vi.fn();
    const router = { push: vi.fn() };

    runCompletedStepExit({
      clearState,
      clearAnonymousCreateFlowStorage,
      router,
    });

    expect(clearState).toHaveBeenCalledTimes(1);
    expect(clearAnonymousCreateFlowStorage).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith("/");
  });
});
