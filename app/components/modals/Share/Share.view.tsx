"use client";

import Image from "next/image";
import { memo } from "react";
import ContentLockup from "../../type/ContentLockup";
import Button from "../../buttons/Button";
import ModalHeader from "../ModalHeader";
import ModalFooter from "../ModalFooter";
import { CreateModalFrameView } from "../Create/CreateModalFrame.view";
import type { ShareChannelTileProps, ShareViewProps } from "./Share.types";

/** Decorative glyphs in `public/assets/Share/` — sizes match prior inline SVGs within the 60×60 circles. */
function ShareAssetIcon(props: {
  src:
    | "/assets/Share/Discord.svg"
    | "/assets/Share/Link.svg"
    | "/assets/Share/Mail.svg"
    | "/assets/Share/Signal.svg"
    | "/assets/Share/Slack.svg";
  width: number;
  height: number;
}) {
  const { src, width, height } = props;
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      className="shrink-0"
      unoptimized
      aria-hidden
    />
  );
}

function ShareChannelTile({ label, onClick, circleClassName, icon }: ShareChannelTileProps) {
  return (
    <button
      type="button"
      onClick={() => void onClick()}
      className="flex w-16 shrink-0 flex-col items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-default-primary)]"
    >
      <div
        className={`flex h-[60px] w-[60px] items-center justify-center rounded-full border border-solid ${circleClassName}`}
      >
        {icon}
      </div>
      <span className="max-w-[4.5rem] text-center font-inter text-[12px] font-medium leading-4 text-[var(--color-content-default-tertiary)]">
        {label}
      </span>
    </button>
  );
}

export const ShareView = memo(function ShareView({
  isOpen,
  onClose,
  onCopyLink,
  onEmailShare,
  onSignalShare,
  onSlackShare,
  onDiscordShare,
  className = "",
  backdropVariant = "default",
  dialogRef,
  overlayRef,
  titleId,
  title,
  description,
  copyLinkLabel,
  signalLabel,
  slackLabel,
  discordLabel,
  emailLabel,
  doneLabel,
  closeDialogAriaLabel,
  moreOptionsAriaLabel,
}: ShareViewProps) {
  return (
    <CreateModalFrameView
      isOpen={isOpen}
      onOverlayClick={onClose}
      backdropVariant={backdropVariant}
      className={`max-h-[90vh] w-[min(546px,calc(100vw-32px))] max-w-[546px] min-h-0 ${className}`}
      ariaLabel={title}
      ariaLabelledBy={titleId}
      overlayRef={overlayRef}
      dialogRef={dialogRef}
    >
      <ModalHeader
        onClose={onClose}
        onMoreOptions={onClose}
        closeButtonAriaLabel={closeDialogAriaLabel}
        moreOptionsAriaLabel={moreOptionsAriaLabel}
      />

      <div className="shrink-0 bg-[var(--color-surface-default-primary)] px-[24px] py-[12px]">
        <ContentLockup
          title={title}
          description={description}
          variant="modal"
          alignment="left"
          titleId={titleId}
        />
      </div>

      <div className="scrollbar-design flex min-h-0 flex-1 flex-col overflow-x-clip overflow-y-auto px-[24px] pb-6 pt-0">
        <div className="flex flex-wrap gap-4">
          <ShareChannelTile
            label={copyLinkLabel}
            onClick={onCopyLink}
            circleClassName="border-[#444444] bg-[#333333]"
            icon={<ShareAssetIcon src="/assets/Share/Link.svg" width={24} height={24} />}
          />
          <ShareChannelTile
            label={signalLabel}
            onClick={onSignalShare}
            circleClassName="border-[#3a76f0] bg-[#3a76f0]"
            icon={<ShareAssetIcon src="/assets/Share/Signal.svg" width={26} height={26} />}
          />
          <ShareChannelTile
            label={slackLabel}
            onClick={onSlackShare}
            circleClassName="border-[#4a154b] bg-[#4a154b]"
            icon={<ShareAssetIcon src="/assets/Share/Slack.svg" width={26} height={26} />}
          />
          <ShareChannelTile
            label={discordLabel}
            onClick={onDiscordShare}
            circleClassName="border-[#5865f2] bg-[#5865f2]"
            icon={<ShareAssetIcon src="/assets/Share/Discord.svg" width={30} height={30} />}
          />
          <ShareChannelTile
            label={emailLabel}
            onClick={onEmailShare}
            circleClassName="border-[var(--color-surface-default-brand-kiwi)] bg-[var(--color-surface-default-brand-kiwi)]"
            icon={<ShareAssetIcon src="/assets/Share/Mail.svg" width={24} height={24} />}
          />
        </div>
      </div>

      <ModalFooter
        showBackButton={false}
        showNextButton={false}
        stepper={false}
        footerContent={
          <div className="absolute right-[16px] top-[12px] flex max-w-[calc(100%-32px)] flex-wrap items-center justify-end gap-3">
            <Button
              buttonType="filled"
              palette="default"
              size="medium"
              type="button"
              onClick={onClose}
            >
              {doneLabel}
            </Button>
          </div>
        }
      />
    </CreateModalFrameView>
  );
});

ShareView.displayName = "ShareView";
