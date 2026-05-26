import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FRESH_ENTRY_PENDING_KEY,
  hasFreshEntryPending,
  prepareFreshCreateFlowEntry,
  prepareFreshCreateFlowEntrySync,
} from "../../app/(app)/create/utils/prepareFreshCreateFlowEntry";
import { CREATE_FLOW_ANONYMOUS_KEY } from "../../app/(app)/create/utils/anonymousDraftStorage";

const deleteServerDraft = vi.fn();
const isBackendSyncEnabled = vi.fn();

vi.mock("../../lib/create/api", () => ({
  deleteServerDraft: (...args: unknown[]) => deleteServerDraft(...args),
}));

vi.mock("../../lib/create/backendSyncEnabled", () => ({
  isBackendSyncEnabled: () => isBackendSyncEnabled(),
}));

describe("prepareFreshCreateFlowEntrySync", () => {
  beforeEach(() => {
    deleteServerDraft.mockReset();
    deleteServerDraft.mockResolvedValue(undefined);
    isBackendSyncEnabled.mockReturnValue(true);
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("clears local draft storage for guests without calling deleteServerDraft", () => {
    window.localStorage.setItem(
      CREATE_FLOW_ANONYMOUS_KEY,
      JSON.stringify({ title: "Stale" }),
    );

    prepareFreshCreateFlowEntrySync();

    expect(window.localStorage.getItem(CREATE_FLOW_ANONYMOUS_KEY)).toBeNull();
    expect(deleteServerDraft).not.toHaveBeenCalled();
    expect(hasFreshEntryPending()).toBe(false);
  });

  it("clears local draft storage and deletes the server draft when signed in", async () => {
    prepareFreshCreateFlowEntrySync({ signedIn: true });

    expect(deleteServerDraft).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem(FRESH_ENTRY_PENDING_KEY)).toBe("1");

    await vi.waitFor(() => {
      expect(hasFreshEntryPending()).toBe(false);
    });
  });

  it("skips server draft delete when backend sync is disabled", () => {
    isBackendSyncEnabled.mockReturnValue(false);

    prepareFreshCreateFlowEntrySync({ signedIn: true });

    expect(deleteServerDraft).not.toHaveBeenCalled();
    expect(hasFreshEntryPending()).toBe(false);
  });
});

describe("prepareFreshCreateFlowEntry", () => {
  beforeEach(() => {
    deleteServerDraft.mockReset();
    deleteServerDraft.mockResolvedValue(undefined);
    isBackendSyncEnabled.mockReturnValue(true);
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it("awaits deleteServerDraft only when signed in", async () => {
    await prepareFreshCreateFlowEntry();
    expect(deleteServerDraft).not.toHaveBeenCalled();

    await prepareFreshCreateFlowEntry({ signedIn: true });
    expect(deleteServerDraft).toHaveBeenCalledTimes(1);
    expect(hasFreshEntryPending()).toBe(false);
  });
});
