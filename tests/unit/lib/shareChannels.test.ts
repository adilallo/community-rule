import { describe, it, expect, vi, afterEach } from "vitest";
import {
  buildMailtoShareHref,
  buildSlackWebShareUrl,
  DISCORD_NATIVE_DM_HUB_URL,
  DISCORD_WEB_DM_HUB_URL,
  NATIVE_SHARE_FALLBACK_DELAY_MS,
  type NativeFallbackTimers,
  scheduleNativeSchemeThenFallback,
  SLACK_NATIVE_OPEN_URL,
} from "../../../lib/create/shareChannels";

describe("shareChannels", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("buildSlackWebShareUrl encodes the outgoing URL query value", () => {
    expect(buildSlackWebShareUrl("https://example.com/rules/r1")).toBe(
      "https://slack.com/share?url=https%3A%2F%2Fexample.com%2Frules%2Fr1",
    );
    expect(
      buildSlackWebShareUrl("https://example.com/rules/a?b=c&d=e"),
    ).toBe(
      "https://slack.com/share?url=https%3A%2F%2Fexample.com%2Frules%2Fa%3Fb%3Dc%26d%3De",
    );
  });

  it("buildMailtoShareHref percent-encodes subject and body including newlines", () => {
    expect(
      buildMailtoShareHref({
        subject: "Hello & welcome",
        body: "Line one\n\nhttps://x.com/y z",
      }),
    ).toBe(
      "mailto:?subject=Hello%20%26%20welcome&body=Line%20one%0A%0Ahttps%3A%2F%2Fx.com%2Fy%20z",
    );
  });

  it("buildMailtoShareHref handles unicode", () => {
    const href = buildMailtoShareHref({
      subject: "日本語",
      body: "café ☕",
    });
    expect(href.startsWith("mailto:?subject=")).toBe(true);
    expect(href).toContain(encodeURIComponent("日本語"));
    expect(href).toContain(encodeURIComponent("café ☕"));
  });

  it("exposes Discord native + web DM hub URL constants", () => {
    expect(DISCORD_WEB_DM_HUB_URL).toBe("https://discord.com/channels/@me");
    expect(DISCORD_NATIVE_DM_HUB_URL).toBe("discord://-/channels/@me");
  });

  it("scheduleNativeSchemeThenFallback skips native assign and invokes fallback synchronously when URL is not allowlisted", () => {
    const assign = vi.fn();
    const fb = vi.fn();
    const timers: NativeFallbackTimers = {
      setTimeout: (): unknown => 0,
      clearTimeout: vi.fn(),
    };

    scheduleNativeSchemeThenFallback(
      "javascript:alert(1)",
      fb,
      {
        assignLocationHref: assign,
        getVisibilityState: (): Document["visibilityState"] => "visible",
        onVisibilityChange: () => {},
        offVisibilityChange: () => {},
      },
      timers,
    );

    expect(assign).not.toHaveBeenCalled();
    expect(fb).toHaveBeenCalledTimes(1);
  });

  it("scheduleNativeSchemeThenFallback triggers fallback once after timeout when tab stays visible", () => {
    vi.useFakeTimers();

    const assign = vi.fn();
    const fb = vi.fn();

    scheduleNativeSchemeThenFallback(
      SLACK_NATIVE_OPEN_URL,
      fb,
      {
        assignLocationHref: assign,
        getVisibilityState: (): Document["visibilityState"] => "visible",
        onVisibilityChange: () => {},
        offVisibilityChange: () => {},
      },
      window as unknown as NativeFallbackTimers,
      NATIVE_SHARE_FALLBACK_DELAY_MS,
    );

    expect(assign).toHaveBeenCalledWith(SLACK_NATIVE_OPEN_URL);

    vi.advanceTimersByTime(NATIVE_SHARE_FALLBACK_DELAY_MS - 1);
    expect(fb).not.toHaveBeenCalled();

    vi.advanceTimersByTime(10);
    expect(fb).toHaveBeenCalledTimes(1);
  });

  it("scheduleNativeSchemeThenFallback cancels fallback when visibility becomes hidden before timeout", () => {
    vi.useFakeTimers();
    let vis: Document["visibilityState"] = "visible";
    const listeners: (() => void)[] = [];
    const fb = vi.fn();

    scheduleNativeSchemeThenFallback(
      DISCORD_NATIVE_DM_HUB_URL,
      fb,
      {
        assignLocationHref: vi.fn(),
        getVisibilityState: (): Document["visibilityState"] => vis,
        onVisibilityChange: (l: () => void): void => {
          listeners.push(l);
        },
        offVisibilityChange: (l: () => void): void => {
          const idx = listeners.indexOf(l);
          if (idx >= 0) listeners.splice(idx, 1);
        },
      },
      window as unknown as NativeFallbackTimers,
      NATIVE_SHARE_FALLBACK_DELAY_MS,
    );

    vis = "hidden";
    listeners.forEach((l) => l());

    vi.advanceTimersByTime(NATIVE_SHARE_FALLBACK_DELAY_MS + 200);
    expect(fb).not.toHaveBeenCalled();
  });
});
