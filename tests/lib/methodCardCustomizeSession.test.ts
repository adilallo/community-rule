import type { CustomMethodCardFieldBlock } from "../../lib/create/customMethodCardFieldBlocks";
import { describe, expect, it, vi } from "vitest";
import {
  captureMethodCardCustomizeSnapshot,
  confirmDiscardMethodCardCustomizeSession,
  isMethodCardCustomizeSessionDirty,
} from "../../lib/create/methodCardCustomizeSession";

const HEADER_0 = { title: "", description: "" };

describe("methodCardCustomizeSession", () => {
  it("reports clean session when pendingDraft and blocks match snapshot", () => {
    const draft = { a: 1, b: [2] };
    const snap = captureMethodCardCustomizeSnapshot(draft, null, HEADER_0);
    expect(
      isMethodCardCustomizeSessionDirty(snap, { ...draft }, null, HEADER_0),
    ).toBe(false);
  });

  it("reports dirty when pendingDraft JSON differs", () => {
    const snap = captureMethodCardCustomizeSnapshot({ x: "one" }, null, HEADER_0);
    expect(
      isMethodCardCustomizeSessionDirty(snap, { x: "two" }, null, HEADER_0),
    ).toBe(true);
  });

  it("reports dirty when field blocks differ", () => {
    const before: CustomMethodCardFieldBlock[] = [
      { kind: "text", id: "b1", blockTitle: "t", placeholderText: "" },
    ];
    const snap = captureMethodCardCustomizeSnapshot({ ok: true }, before, HEADER_0);
    const after: CustomMethodCardFieldBlock[] = [
      {
        kind: "text",
        id: "b1",
        blockTitle: "t",
        placeholderText: "edited",
      },
    ];
    expect(
      isMethodCardCustomizeSessionDirty(snap, { ok: true }, after, HEADER_0),
    ).toBe(true);
  });

  it("reports dirty when header draft differs", () => {
    const snap = captureMethodCardCustomizeSnapshot({ ok: true }, null, {
      title: "A",
      description: "B",
    });
    expect(
      isMethodCardCustomizeSessionDirty(
        snap,
        { ok: true },
        null,
        { title: "A2", description: "B" },
      ),
    ).toBe(true);
  });

  it("confirmDiscard skips confirm when unlocked but snapshot missing", () => {
    const spy = vi.spyOn(window, "confirm");
    expect(
      confirmDiscardMethodCardCustomizeSession(
        true,
        null,
        { x: 1 },
        null,
        null,
        "msg",
      ),
    ).toBe(true);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("confirmDiscard runs confirm when dirty", () => {
    const spy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const draft = { n: 1 };
    const snap = captureMethodCardCustomizeSnapshot(draft, null, HEADER_0);
    expect(
      confirmDiscardMethodCardCustomizeSession(
        true,
        snap,
        { n: 2 },
        null,
        HEADER_0,
        "Discard?",
      ),
    ).toBe(false);
    expect(spy).toHaveBeenCalledWith("Discard?");
    spy.mockRestore();
  });
});
