import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { CreateFlowState } from "../../../app/(app)/create/types";
import { useCreateFlowFinalize } from "../../../app/(app)/create/hooks/useCreateFlowFinalize";
import { publishRule, updatePublishedRule } from "../../../lib/create/api";
import { writeLastPublishedRule } from "../../../lib/create/lastPublishedRule";
import {
  CREATE_FLOW_COMPLETED_CELEBRATE_QUERY,
  CREATE_FLOW_COMPLETED_CELEBRATE_VALUE,
} from "../../../app/(app)/create/utils/flowSteps";

vi.mock("../../../lib/create/buildPublishPayload", () => ({
  buildPublishPayload: vi.fn(() => ({
    ok: true as const,
    title: "Published title",
    summary: "Published summary",
    document: {},
  })),
}));

vi.mock("../../../lib/create/api", () => ({
  publishRule: vi.fn(),
  updatePublishedRule: vi.fn(),
}));

vi.mock("../../../lib/create/lastPublishedRule", () => ({
  writeLastPublishedRule: vi.fn(),
}));

const emptyState = {} as CreateFlowState;

describe("useCreateFlowFinalize", () => {
  const router = { push: vi.fn() };
  const updateState = vi.fn();
  const openLogin = vi.fn();

  beforeEach(() => {
    vi.mocked(publishRule).mockReset();
    vi.mocked(updatePublishedRule).mockReset();
    vi.mocked(writeLastPublishedRule).mockReset();
    router.push.mockReset();
    updateState.mockReset();
    openLogin.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("routes with celebrate query after initial POST publish", async () => {
    vi.mocked(publishRule).mockResolvedValue({
      ok: true,
      id: "new-rule-id",
      title: "Published title",
    });

    const { result } = renderHook(() =>
      useCreateFlowFinalize({
        state: emptyState,
        router,
        openLogin,
        updateState,
        loginReturnPath: "/create/final-review",
      }),
    );

    await act(async () => {
      await result.current.finalize();
    });

    expect(router.push).toHaveBeenCalledWith(
      `/create/completed?${CREATE_FLOW_COMPLETED_CELEBRATE_QUERY}=${CREATE_FLOW_COMPLETED_CELEBRATE_VALUE}`,
    );
    expect(updatePublishedRule).not.toHaveBeenCalled();
    expect(writeLastPublishedRule).toHaveBeenCalledWith({
      id: "new-rule-id",
      title: "Published title",
      summary: "Published summary",
      document: {},
    });
  });

  it("routes to /create/completed without celebrate after PATCH update", async () => {
    vi.mocked(updatePublishedRule).mockResolvedValue({ ok: true });

    const { result } = renderHook(() =>
      useCreateFlowFinalize({
        state: {
          ...emptyState,
          editingPublishedRuleId: "  existing-id  ",
        },
        router,
        openLogin,
        updateState,
        loginReturnPath: "/create/edit-rule",
      }),
    );

    await act(async () => {
      await result.current.finalize();
    });

    expect(router.push).toHaveBeenCalledWith("/create/completed");
    expect(publishRule).not.toHaveBeenCalled();
    expect(updatePublishedRule).toHaveBeenCalledWith(
      "existing-id",
      expect.objectContaining({
        title: "Published title",
        summary: "Published summary",
        document: {},
      }),
    );
    expect(writeLastPublishedRule).toHaveBeenCalledWith({
      id: "existing-id",
      title: "Published title",
      summary: "Published summary",
      document: {},
    });
    expect(updateState).toHaveBeenCalledWith({
      editingPublishedRuleId: undefined,
    });
  });
});
