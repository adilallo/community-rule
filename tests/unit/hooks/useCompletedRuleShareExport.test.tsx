import React from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MessagesProvider } from "../../../app/contexts/MessagesContext";
import messages from "../../../messages/en/index";
import { useCompletedRuleShareExport } from "../../../app/(app)/create/hooks/useCompletedRuleShareExport";
import { readLastPublishedRule } from "../../../lib/create/lastPublishedRule";
import {
  DISCORD_WEB_DM_HUB_URL,
  DISCORD_NATIVE_DM_HUB_URL,
  NATIVE_SHARE_FALLBACK_DELAY_MS,
  SLACK_NATIVE_OPEN_URL,
} from "../../../lib/create/shareChannels";

vi.mock("../../../lib/create/lastPublishedRule", () => ({
  readLastPublishedRule: vi.fn(),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  return <MessagesProvider messages={messages}>{children}</MessagesProvider>;
}

describe("useCompletedRuleShareExport", () => {
  const mockRule = {
    id: "rule-1",
    title: "Garden norms",
    summary: "Be kind.",
    document: {},
  };

  beforeEach(() => {
    vi.mocked(readLastPublishedRule).mockReturnValue(mockRule);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shareViaSlack opens Slack web share URL when window.open succeeds", async () => {
    vi.useFakeTimers();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const openSpy = vi.spyOn(window, "open").mockReturnValue({} as Window);
    const setBanner = vi.fn();

    const { result } = renderHook(
      () =>
        useCompletedRuleShareExport({
          setActionBanner: setBanner,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.sharePublishedRuleViaSlack();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(NATIVE_SHARE_FALLBACK_DELAY_MS + 25);
    });

    expect(clickSpy).toHaveBeenCalled();
    const anchorUnknown = clickSpy.mock.instances.at(-1) as unknown;
    expect(anchorUnknown).toBeInstanceOf(HTMLAnchorElement);
    const anchorEl = anchorUnknown as HTMLAnchorElement;
    expect(anchorEl.getAttribute("href")).toBe(SLACK_NATIVE_OPEN_URL);

    const expectedUrl = `https://slack.com/share?url=${encodeURIComponent(`${window.location.origin}/rules/rule-1`)}`;
    expect(openSpy).toHaveBeenCalledWith(
      expectedUrl,
      "_blank",
      "noopener,noreferrer",
    );
    expect(setBanner).not.toHaveBeenCalledWith(
      expect.objectContaining({
        key: "completedShareCopyFailed",
        status: "danger",
      }),
    );
    clickSpy.mockRestore();
    openSpy.mockRestore();
  });

  it("shareViaSlack does not show copy-failed banner when fallback is skipped after handoff (no focus)", async () => {
    vi.useFakeTimers();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    vi.spyOn(window, "open").mockReturnValue(null);
    const hasFocusSpy = vi.spyOn(document, "hasFocus").mockReturnValue(false);
    const writeText = vi.fn().mockRejectedValue(new Error("NotAllowedError"));
    vi.stubGlobal("navigator", {
      ...navigator,
      share: undefined,
      canShare: undefined,
      clipboard: { writeText },
    });

    const setBanner = vi.fn();
    const { result } = renderHook(
      () =>
        useCompletedRuleShareExport({
          setActionBanner: setBanner,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.sharePublishedRuleViaSlack();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(NATIVE_SHARE_FALLBACK_DELAY_MS + 25);
    });

    expect(writeText).not.toHaveBeenCalled();
    expect(setBanner).not.toHaveBeenCalledWith(
      expect.objectContaining({ key: "completedShareCopyFailed" }),
    );
    hasFocusSpy.mockRestore();
  });

  it("shareViaSlack suppresses copy-failed banner when clipboard denies after focus loss", async () => {
    vi.useFakeTimers();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    vi.spyOn(window, "open").mockReturnValue(null);
    let hasFocusCalls = 0;
    const hasFocusSpy = vi.spyOn(document, "hasFocus").mockImplementation(() => {
      hasFocusCalls += 1;
      return hasFocusCalls <= 2;
    });
    const writeText = vi.fn().mockImplementation(async () => {
      throw new Error("NotAllowedError");
    });
    vi.stubGlobal("navigator", {
      ...navigator,
      share: undefined,
      canShare: undefined,
      clipboard: { writeText },
    });

    const setBanner = vi.fn();
    const { result } = renderHook(
      () =>
        useCompletedRuleShareExport({
          setActionBanner: setBanner,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.sharePublishedRuleViaSlack();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(NATIVE_SHARE_FALLBACK_DELAY_MS + 25);
    });

    expect(writeText).toHaveBeenCalled();
    expect(setBanner).not.toHaveBeenCalledWith(
      expect.objectContaining({ key: "completedShareCopyFailed" }),
    );
    hasFocusSpy.mockRestore();
  });

  it("shareViaSlack falls back to clipboard when popup blocked and Web Share cannot run", async () => {
    vi.useFakeTimers();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    vi.spyOn(window, "open").mockReturnValue(null);
    vi.spyOn(document, "hasFocus").mockReturnValue(true);
    const share = vi.fn();
    vi.stubGlobal("navigator", {
      ...navigator,
      share: share,
      canShare: vi.fn().mockReturnValue(false),
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const setBanner = vi.fn();
    const { result } = renderHook(
      () =>
        useCompletedRuleShareExport({
          setActionBanner: setBanner,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.sharePublishedRuleViaSlack();
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(NATIVE_SHARE_FALLBACK_DELAY_MS + 25);
    });

    expect(share).not.toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/rules/rule-1`,
    );
    expect(setBanner).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "completedShareSlackFallback",
        status: "positive",
      }),
    );
  });

  it("shareViaSignal uses navigator.share when canShare allows URL-only data", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      ...navigator,
      share: share,
      canShare: vi.fn().mockImplementation((data: ShareData) => data.url != null),
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const setBanner = vi.fn();
    const { result } = renderHook(
      () =>
        useCompletedRuleShareExport({
          setActionBanner: setBanner,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.sharePublishedRuleViaSignal();
    });

    expect(share).toHaveBeenCalledWith({
      url: `${window.location.origin}/rules/rule-1`,
    });
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    expect(setBanner).not.toHaveBeenCalled();
  });

  it("shareViaDiscord opens Discord hub and copies link when share unavailable", async () => {
    vi.useFakeTimers();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const openSpy = vi.spyOn(window, "open").mockReturnValue(null);
    vi.stubGlobal("navigator", {
      ...navigator,
      share: undefined,
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    const setBanner = vi.fn();
    const { result } = renderHook(
      () =>
        useCompletedRuleShareExport({
          setActionBanner: setBanner,
        }),
      { wrapper },
    );

    await act(async () => {
      await result.current.sharePublishedRuleViaDiscord();
    });

    expect(clickSpy).toHaveBeenCalled();
    const anchorUnknown = clickSpy.mock.instances.at(-1) as unknown;
    expect(anchorUnknown).toBeInstanceOf(HTMLAnchorElement);
    expect((anchorUnknown as HTMLAnchorElement).getAttribute("href")).toBe(
      DISCORD_NATIVE_DM_HUB_URL,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(NATIVE_SHARE_FALLBACK_DELAY_MS + 25);
    });

    expect(openSpy).toHaveBeenCalledWith(
      DISCORD_WEB_DM_HUB_URL,
      "_blank",
      "noopener,noreferrer",
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/rules/rule-1`,
    );
    expect(setBanner).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "completedShareDiscordPaste",
        status: "positive",
      }),
    );
    clickSpy.mockRestore();
    openSpy.mockRestore();
  });

  it("onSelectExportFormat pdf triggers download with community-rule pdf filename", () => {
    vi.mocked(readLastPublishedRule).mockReturnValue({
      ...mockRule,
      document: {
        sections: [
          { categoryName: "Values", entries: [{ title: "Norm", body: "Text." }] },
        ],
      },
    });

    const createObjectURL = vi.fn().mockReturnValue("blob:unit-test");
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      value: createObjectURL,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: revokeObjectURL,
      writable: true,
      configurable: true,
    });

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    const setBanner = vi.fn();

    try {
      const { result } = renderHook(
        () =>
          useCompletedRuleShareExport({
            setActionBanner: setBanner,
          }),
        { wrapper },
      );

      act(() => {
        result.current.onSelectExportFormat("pdf");
      });

      expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      const blob = createObjectURL.mock.calls[0][0] as Blob;
      expect(blob.type).toBe("application/pdf");

      const anchorUnknown = clickSpy.mock.instances.at(-1) as unknown;
      expect(anchorUnknown).toBeInstanceOf(HTMLAnchorElement);
      const anchorEl = anchorUnknown as HTMLAnchorElement;
      expect(anchorEl.getAttribute("download")).toBe(
        "garden-norms-community-rule.pdf",
      );
      expect(anchorEl.getAttribute("href")).toBe("blob:unit-test");
      expect(setBanner).not.toHaveBeenCalled();
    } finally {
      Reflect.deleteProperty(URL, "createObjectURL");
      Reflect.deleteProperty(URL, "revokeObjectURL");
      clickSpy.mockRestore();
    }
  });
});
