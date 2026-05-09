/**
 * Pure URL builders + a small navigator for cross-app share flows (mailto,
 * Slack compose, Discord DMs). Native schemes are allowlisted below.
 */

/** Slack: opens native client default workspace — no prefilled compose (Slack lacks team-agnostic native share URLs). docs: slack://open */
export const SLACK_NATIVE_OPEN_URL = "slack://open";

/**
 * Discord desktop/mobile client DM hub (@me). Mirrors https://discord.com/channels/@me
 * (widely referenced community/client pattern: discord://-/channels/@me).
 */
export const DISCORD_NATIVE_DM_HUB_URL = "discord://-/channels/@me";

const ALLOWLISTED_NATIVE_NAV_URL = new Set<string>([
  SLACK_NATIVE_OPEN_URL,
  DISCORD_NATIVE_DM_HUB_URL,
]);

/** Slack historically exposed a web share endpoint; still useful as primary web compose. */
export function buildSlackWebShareUrl(externalUrl: string): string {
  return `https://slack.com/share?url=${encodeURIComponent(externalUrl)}`;
}

/** Opens Discord in the browser / app; user pastes the rule URL manually. */
export const DISCORD_WEB_DM_HUB_URL = "https://discord.com/channels/@me";

/**
 * RFC 6068-style mailto href with percent-encoded subject and body.
 * Body may contain newlines; they are encoded as %0A.
 */
export function buildMailtoShareHref(parts: {
  subject: string;
  body: string;
}): string {
  const subject = encodeURIComponent(parts.subject);
  const body = encodeURIComponent(parts.body);
  return `mailto:?subject=${subject}&body=${body}`;
}

export const NATIVE_SHARE_FALLBACK_DELAY_MS = 550;

/** @internal Injectable timer surface for tests. */
export interface NativeFallbackTimers {
  setTimeout(cb: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
}

/** @internal Location assign / href navigation for tests. */
export interface NativeNavigateDeps {
  assignLocationHref: (_url: string) => void;
  getVisibilityState: () => Document["visibilityState"];
  onVisibilityChange: (_listener: () => void) => void;
  offVisibilityChange: (_listener: () => void) => void;
}

/**
 * Assigns an allowlisted `slack:` / `discord:` URL once, then invokes
 * `fallback` after `delayMs` if the tab never became hidden (blur / minimize).
 * Cancels fallback when visibility becomes `"hidden"` (tab backgrounded).
 *
 * Not a guarantee the native app opens; web cannot detect install reliably.
 */
export function scheduleNativeSchemeThenFallback(
  nativeUrl: string,
  fallback: () => void,
  deps: NativeNavigateDeps,
  timers: NativeFallbackTimers,
  delayMs = NATIVE_SHARE_FALLBACK_DELAY_MS,
): () => void {
  if (!ALLOWLISTED_NATIVE_NAV_URL.has(nativeUrl)) {
    fallback();
    return () => {};
  }

  let cancelledBecauseHidden = deps.getVisibilityState() === "hidden";

  const onHidden = (): void => {
    if (deps.getVisibilityState() === "hidden") {
      cancelledBecauseHidden = true;
    }
  };

  deps.onVisibilityChange(onHidden);

  try {
    deps.assignLocationHref(nativeUrl);
  } catch {
    deps.offVisibilityChange(onHidden);
    fallback();
    return () => {};
  }

  const id = timers.setTimeout(() => {
    deps.offVisibilityChange(onHidden);
    if (!cancelledBecauseHidden && deps.getVisibilityState() === "visible") {
      fallback();
    }
  }, delayMs);

  return () => {
    timers.clearTimeout(id);
    deps.offVisibilityChange(onHidden);
  };
}
