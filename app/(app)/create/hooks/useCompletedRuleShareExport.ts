"use client";

import { useCallback } from "react";
import { useTranslation } from "../../../contexts/MessagesContext";
import { readLastPublishedRule } from "../../../../lib/create/lastPublishedRule";
import {
  buildMailtoShareHref,
  buildSlackWebShareUrl,
  DISCORD_NATIVE_DM_HUB_URL,
  DISCORD_WEB_DM_HUB_URL,
  scheduleNativeSchemeThenFallback,
  SLACK_NATIVE_OPEN_URL,
  type NativeFallbackTimers,
  type NativeNavigateDeps,
} from "../../../../lib/create/shareChannels";
import {
  buildPublicRuleUrl,
  downloadStoredRuleAsPdf,
  downloadTextFile,
  exportFilenameBase,
  exportStoredRuleAsCsv,
  exportStoredRuleAsMarkdown,
} from "../../../../lib/create/ruleExport";

export type CompletedFlowActionBanner = {
  key: string;
  status: "positive" | "danger";
  title: string;
  description?: string;
};

function browserNativeShareNavigateDeps(win: Window): NativeNavigateDeps {
  return {
    assignLocationHref: (url: string): void => {
      // Transient <a>: same-tab custom-protocol handshake as location.href without replacing the SPA.
      const anchor = win.document.createElement("a");
      anchor.href = url;
      anchor.rel = "noreferrer noopener";
      anchor.style.position = "absolute";
      anchor.style.left = "-9999px";
      win.document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    },
    getVisibilityState: (): Document["visibilityState"] =>
      win.document.visibilityState,
    onVisibilityChange: (listener: () => void): void => {
      win.document.addEventListener("visibilitychange", listener);
    },
    offVisibilityChange: (listener: () => void): void => {
      win.document.removeEventListener("visibilitychange", listener);
    },
  };
}

function browserNativeTimers(win: Window): NativeFallbackTimers {
  return {
    setTimeout: (cb: () => void, ms: number): unknown => win.setTimeout(cb, ms),
    clearTimeout: (handle: unknown): void =>
      win.clearTimeout(
        handle as ReturnType<typeof win.setTimeout>,
      ),
  };
}

/**
 * After native app handoff, the page can stay `visibilityState === "visible"` while
 * focus moves to the other app. Skip clipboard fallbacks in that case to avoid
 * `NotAllowedError` noise when Slack/compose already succeeded.
 */
function shouldSkipShareClipboardFallback(win: Window): boolean {
  return (
    win.document.visibilityState === "hidden" || !win.document.hasFocus()
  );
}

function resolvePublishedRuleShareContext(windowObj: Window): {
  url: string;
  title: string;
  text: string;
} | null {
  const rule = readLastPublishedRule();
  if (!rule) return null;
  const url = buildPublicRuleUrl(windowObj.location.origin, rule.id);
  const summary =
    typeof rule.summary === "string" ? rule.summary.trim() : "";
  const text = summary.length > 0 ? summary : rule.title;
  return { url, title: rule.title, text };
}

/**
 * Share / export handlers for the completed step (`readLastPublishedRule`).
 */
export function useCompletedRuleShareExport({
  setActionBanner,
}: {
  setActionBanner: (_: CompletedFlowActionBanner | null) => void;
}): {
  copyPublishedRuleLink: () => Promise<void>;
  mailtoPublishedRule: () => void;
  sharePublishedRuleViaSignal: () => Promise<void>;
  sharePublishedRuleViaSlack: () => Promise<void>;
  sharePublishedRuleViaDiscord: () => Promise<void>;
  onSelectExportFormat: (_format: "pdf" | "csv" | "markdown") => void;
} {
  const t = useTranslation("create.reviewAndComplete.completed");

  const bannerNoRule = useCallback(() => {
    setActionBanner({
      key: "completedShareNoRule",
      status: "danger",
      title: t("shareNoRuleTitle"),
      description: t("shareNoRuleDescription"),
    });
  }, [setActionBanner, t]);

  const bannerCopied = useCallback(() => {
    setActionBanner({
      key: "completedShareCopied",
      status: "positive",
      title: t("shareLinkCopiedTitle"),
      description: t("shareLinkCopiedDescription"),
    });
  }, [setActionBanner, t]);

  const bannerCopyFailed = useCallback(() => {
    setActionBanner({
      key: "completedShareCopyFailed",
      status: "danger",
      title: t("shareCopyFailedTitle"),
      description: t("shareCopyFailedDescription"),
    });
  }, [setActionBanner, t]);

  const copyUrlToClipboard = useCallback(
    async (
      url: string,
      banner?: () => void,
      options?: { suppressFailureWhenDocumentNotFocused?: boolean },
    ) => {
      try {
        await navigator.clipboard.writeText(url);
        (banner ?? bannerCopied)();
      } catch {
        if (
          options?.suppressFailureWhenDocumentNotFocused === true &&
          typeof window !== "undefined" &&
          shouldSkipShareClipboardFallback(window)
        ) {
          return;
        }
        bannerCopyFailed();
      }
    },
    [bannerCopied, bannerCopyFailed],
  );

  const copyPublishedRuleLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    const ctx = resolvePublishedRuleShareContext(window);
    if (!ctx) {
      bannerNoRule();
      return;
    }
    await copyUrlToClipboard(ctx.url);
  }, [bannerNoRule, copyUrlToClipboard]);

  const mailtoPublishedRule = useCallback(() => {
    if (typeof window === "undefined") return;
    const ctx = resolvePublishedRuleShareContext(window);
    if (!ctx) {
      bannerNoRule();
      return;
    }

    const body = `${ctx.text}\n\n${ctx.url}`;
    window.location.href = buildMailtoShareHref({
      subject: ctx.title,
      body,
    });
  }, [bannerNoRule]);

  const tryNavigatorShareAbortOk = useCallback(
    async (data: ShareData): Promise<boolean> => {
      if (typeof navigator.share !== "function") return false;
      const can =
        typeof navigator.canShare !== "function" || navigator.canShare(data);
      if (!can) return false;
      try {
        await navigator.share(data);
        return true;
      } catch (e) {
        const err = e as { name?: string };
        if (err?.name === "AbortError") return true;
        return false;
      }
    },
    [],
  );

  /** Prefer URL-only share data when the platform allows it (common on mobile). */
  const shareViaWebShareApiOrFalse = useCallback(
    async (ctx: { url: string; title: string; text: string }) => {
      const urlOnly: ShareData = { url: ctx.url };
      if (await tryNavigatorShareAbortOk(urlOnly)) return true;
      const full: ShareData = {
        title: ctx.title,
        text: ctx.text,
        url: ctx.url,
      };
      return tryNavigatorShareAbortOk(full);
    },
    [tryNavigatorShareAbortOk],
  );

  const sharePublishedRuleViaSignal = useCallback(async () => {
    if (typeof window === "undefined") return;
    const ctx = resolvePublishedRuleShareContext(window);
    if (!ctx) {
      bannerNoRule();
      return;
    }
    if (await shareViaWebShareApiOrFalse(ctx)) return;
    await copyUrlToClipboard(ctx.url);
  }, [bannerNoRule, copyUrlToClipboard, shareViaWebShareApiOrFalse]);

  const sharePublishedRuleViaSlack = useCallback(async () => {
    if (typeof window === "undefined") return;
    const ctx = resolvePublishedRuleShareContext(window);
    if (!ctx) {
      bannerNoRule();
      return;
    }

    const runSlackWebComposeFallback = async (): Promise<void> => {
      const slackUrl = buildSlackWebShareUrl(ctx.url);
      const popup = window.open(
        slackUrl,
        "_blank",
        "noopener,noreferrer",
      );
      if (popup) return;

      if (shouldSkipShareClipboardFallback(window)) return;

      if (await shareViaWebShareApiOrFalse(ctx)) return;

      if (shouldSkipShareClipboardFallback(window)) return;

      await copyUrlToClipboard(
        ctx.url,
        () =>
          setActionBanner({
            key: "completedShareSlackFallback",
            status: "positive",
            title: t("shareSlackFallbackTitle"),
            description: t("shareSlackFallbackDescription"),
          }),
        { suppressFailureWhenDocumentNotFocused: true },
      );
    };

    scheduleNativeSchemeThenFallback(
      SLACK_NATIVE_OPEN_URL,
      () => void runSlackWebComposeFallback(),
      browserNativeShareNavigateDeps(window),
      browserNativeTimers(window),
    );
  }, [
    bannerNoRule,
    copyUrlToClipboard,
    shareViaWebShareApiOrFalse,
    setActionBanner,
    t,
  ]);

  const sharePublishedRuleViaDiscord = useCallback(async () => {
    if (typeof window === "undefined") return;
    const ctx = resolvePublishedRuleShareContext(window);
    if (!ctx) {
      bannerNoRule();
      return;
    }

    if (await shareViaWebShareApiOrFalse(ctx)) return;

    try {
      await navigator.clipboard.writeText(ctx.url);
      setActionBanner({
        key: "completedShareDiscordPaste",
        status: "positive",
        title: t("shareDiscordPasteTitle"),
        description: t("shareDiscordPasteDescription"),
      });
    } catch {
      bannerCopyFailed();
    }

    scheduleNativeSchemeThenFallback(
      DISCORD_NATIVE_DM_HUB_URL,
      () =>
        void window.open(
          DISCORD_WEB_DM_HUB_URL,
          "_blank",
          "noopener,noreferrer",
        ),
      browserNativeShareNavigateDeps(window),
      browserNativeTimers(window),
    );
  }, [
    bannerCopyFailed,
    bannerNoRule,
    shareViaWebShareApiOrFalse,
    setActionBanner,
    t,
  ]);

  const onSelectExportFormat = useCallback(
    (format: "pdf" | "csv" | "markdown") => {
      if (typeof window === "undefined") return;
      const rule = readLastPublishedRule();
      if (!rule) {
        setActionBanner({
          key: "completedExportNoRule",
          status: "danger",
          title: t("shareNoRuleTitle"),
          description: t("shareNoRuleDescription"),
        });
        return;
      }

      const base = exportFilenameBase(rule);
      try {
        if (format === "pdf") {
          downloadStoredRuleAsPdf(rule);
        } else if (format === "csv") {
          const csv = exportStoredRuleAsCsv(rule);
          downloadTextFile(
            `${base}-community-rule.csv`,
            csv,
            "text/csv;charset=utf-8",
          );
        } else {
          const md = exportStoredRuleAsMarkdown(rule);
          downloadTextFile(
            `${base}-community-rule.md`,
            md,
            "text/markdown;charset=utf-8",
          );
        }
      } catch (e) {
        const msg = e instanceof Error && e.message === "exportEmptyDocument";
        setActionBanner({
          key: "completedExportFailed",
          status: "danger",
          title: msg ? t("exportEmptyDocumentTitle") : t("exportFailedTitle"),
          description: msg
            ? t("exportEmptyDocumentDescription")
            : t("exportFailedDescription"),
        });
      }
    },
    [setActionBanner, t],
  );

  return {
    copyPublishedRuleLink,
    mailtoPublishedRule,
    sharePublishedRuleViaSignal,
    sharePublishedRuleViaSlack,
    sharePublishedRuleViaDiscord,
    onSelectExportFormat,
  };
}
