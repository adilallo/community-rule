"use client";

import CommunityRule from "../../../../../components/type/CommunityRule";
import CreateFlowTopNav from "../../../../../components/navigation/CreateFlowTopNav";
import Share from "../../../../../components/modals/Share";
import Alert from "../../../../../components/modals/Alert";
import { CreateFlowHeaderLockup } from "../../../../../(app)/create/components/CreateFlowHeaderLockup";
import {
  CREATE_FLOW_MD_UP_GRID_CELL_CLASS,
  CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS,
} from "../../../../../(app)/create/components/createFlowLayoutTokens";
import type { UseCaseCompletedRuleViewProps } from "./UseCaseCompletedRule.types";

export function UseCaseCompletedRuleView({
  fixture,
  sections,
  mdUp,
  duplicateLabel,
  duplicateAriaLabel,
  exitLabel,
  shareModalOpen,
  onShareOpen,
  onShareClose,
  onCopyLink,
  onEmailShare,
  onDuplicate,
  onExit,
  actionBanner,
  onActionBannerClose,
}: UseCaseCompletedRuleViewProps) {
  const pageBg = fixture.pageBackground;

  return (
    <>
      {/*
        Mobile: grid scrolls (title sticky at top of scrollport).
        Desktop: viewport-tall columns; rule scrolls in the right column only.
      */}
      <div
        className="flex min-h-0 w-full flex-1 flex-col overflow-hidden md:h-full"
        style={{ background: pageBg }}
      >
        {actionBanner ? (
          <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center px-5 pt-3">
            <div className="pointer-events-auto w-full max-w-[639px]">
              <Alert
                type="banner"
                status={actionBanner.status}
                title={actionBanner.title}
                description={actionBanner.description}
                hasLeadingIcon
                hasBodyText={Boolean(actionBanner.description)}
                onClose={onActionBannerClose}
                className="w-full"
              />
            </div>
          </div>
        ) : null}
        <Share
          isOpen={shareModalOpen}
          onClose={onShareClose}
          onCopyLink={onCopyLink}
          onEmailShare={onEmailShare}
          onSignalShare={onCopyLink}
          onSlackShare={onCopyLink}
          onDiscordShare={onCopyLink}
        />
        <CreateFlowTopNav
          hasShare
          hasDuplicate
          duplicateLabel={duplicateLabel}
          duplicateAriaLabel={duplicateAriaLabel}
          exitLabel={exitLabel}
          buttonPalette="inverse"
          className="shrink-0 !bg-transparent"
          onShare={onShareOpen}
          onDuplicate={onDuplicate}
          onExit={onExit}
        />
        <div
          className={`mx-auto grid w-full min-h-0 flex-1 grid-cols-1 gap-4 px-5 max-md:max-w-[639px] max-md:gap-6 max-md:overflow-y-auto max-md:overscroll-y-contain max-md:pt-[var(--space-800)] max-md:pb-8 md:h-full md:flex-1 md:grid-cols-2 md:grid-rows-1 md:items-start md:justify-items-center md:gap-[var(--measures-spacing-1200,48px)] md:overflow-hidden md:px-12 md:py-0 ${CREATE_FLOW_TWO_COLUMN_MAX_WIDTH_CLASS}`}
        >
          <div
            className={`relative z-[1] flex flex-col justify-start max-md:sticky max-md:top-0 max-md:z-10 max-md:shrink-0 max-md:pb-4 md:sticky md:top-0 md:z-[1] md:flex md:h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-4rem)] md:flex-col md:justify-center md:self-start md:overflow-hidden md:pb-8 ${CREATE_FLOW_MD_UP_GRID_CELL_CLASS}`}
            style={{ background: pageBg }}
          >
            <CreateFlowHeaderLockup
              title={fixture.title}
              description={fixture.summary}
              justification="left"
              palette="inverse"
            />
          </div>
          <div
            className={`scrollbar-hide relative z-0 flex min-h-min flex-col overflow-x-hidden max-md:shrink-0 md:h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-4rem)] md:min-h-0 md:self-start md:overflow-y-auto ${CREATE_FLOW_MD_UP_GRID_CELL_CLASS}`}
          >
            <div
              className="pointer-events-none sticky top-0 z-10 hidden h-5 shrink-0 md:block"
              style={{
                backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${pageBg} 55%, transparent), color-mix(in srgb, ${pageBg} 20%, transparent) 50%, transparent)`,
              }}
              aria-hidden
            />
            <div className="w-full min-w-0 py-0 md:pb-8">
              <CommunityRule
                sections={sections}
                useCardStyle={!mdUp}
                cardAccentColor={pageBg}
                className={mdUp ? "min-w-0" : "w-full min-w-0 p-4"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
