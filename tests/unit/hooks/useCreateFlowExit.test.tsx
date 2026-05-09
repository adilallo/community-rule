import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { CreateFlowState } from "../../../app/(app)/create/types";

const deleteServerDraft = vi.fn();
const saveDraftToServer = vi.fn();
const updatePublishedRule = vi.fn();

vi.mock("../../../lib/create/buildPublishPayload", () => ({
  buildPublishPayload: vi.fn(() => ({
    ok: true as const,
    title: "T",
    summary: "S",
    document: {},
  })),
}));

vi.mock("../../../lib/create/api", () => ({
  deleteServerDraft: (...args: unknown[]) => deleteServerDraft(...args),
  saveDraftToServer: (...args: unknown[]) => saveDraftToServer(...args),
  updatePublishedRule: (...args: unknown[]) => updatePublishedRule(...args),
}));

vi.mock("../../../lib/create/lastPublishedRule", () => ({
  writeLastPublishedRule: vi.fn(),
}));

async function loadExitHook() {
  return import("../../../app/(app)/create/hooks/useCreateFlowExit");
}

describe("useCreateFlowExit", () => {
  const router = { push: vi.fn() };
  const clearState = vi.fn();
  const user = { id: "u1", email: "a@b.c" };

  beforeEach(async () => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_ENABLE_BACKEND_SYNC", "true");
    deleteServerDraft.mockReset();
    saveDraftToServer.mockReset();
    updatePublishedRule.mockReset();
    router.push.mockReset();
    clearState.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not delete the server draft after updating a published rule (preserves other in-progress work)", async () => {
    updatePublishedRule.mockResolvedValue({ ok: true as const });

    const { useCreateFlowExit } = await loadExitHook();

    const state: CreateFlowState = {
      editingPublishedRuleId: "rule-1",
    };

    const { result } = renderHook(() =>
      useCreateFlowExit({
        state,
        currentStep: "edit-rule",
        clearState,
        router,
        user,
      }),
    );

    await act(async () => {
      await result.current({ saveDraft: true });
    });

    expect(updatePublishedRule).toHaveBeenCalledWith(
      "rule-1",
      expect.objectContaining({ title: "T" }),
    );
    expect(deleteServerDraft).not.toHaveBeenCalled();
    expect(router.push).toHaveBeenCalledWith("/");
  });
});
