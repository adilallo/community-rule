import type { ReactNode, RefObject } from "react";
import type { CreateModalBackdropVariant } from "../Create/CreateModalFrame.view";

export type ShareProps = {
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: () => void | Promise<void>;
  onEmailShare: () => void;
  onSignalShare: () => void | Promise<void>;
  onSlackShare: () => void | Promise<void>;
  onDiscordShare: () => void | Promise<void>;
  className?: string;
  backdropVariant?: CreateModalBackdropVariant;
};

export type ShareViewProps = ShareProps & {
  dialogRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
  titleId: string;
  title: string;
  description: string;
  copyLinkLabel: string;
  signalLabel: string;
  slackLabel: string;
  discordLabel: string;
  emailLabel: string;
  doneLabel: string;
  closeDialogAriaLabel: string;
  moreOptionsAriaLabel: string;
};

export type ShareChannelTileProps = {
  label: string;
  onClick: () => void | Promise<void>;
  circleClassName: string;
  icon: ReactNode;
};
