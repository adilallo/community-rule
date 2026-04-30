"use client";

/**
 * Figma: Community Rule System — "Modal / Share"
 * https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22073-30884
 */
import { memo, useId, useRef } from "react";
import { useTranslation } from "../../../contexts/MessagesContext";
import { useCreateModalA11y } from "../Create/useCreateModalA11y";
import { ShareView } from "./Share.view";
import type { ShareProps } from "./Share.types";

const ShareContainer = memo<ShareProps>((props) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const t = useTranslation("modals.share");

  useCreateModalA11y(props.isOpen, props.onClose, dialogRef);

  return (
    <ShareView
      {...props}
      dialogRef={dialogRef}
      overlayRef={overlayRef}
      titleId={titleId}
      title={t("title")}
      description={t("description")}
      copyLinkLabel={t("copyLink")}
      signalLabel={t("signal")}
      slackLabel={t("slack")}
      discordLabel={t("discord")}
      emailLabel={t("email")}
      doneLabel={t("done")}
      closeDialogAriaLabel={t("closeDialogAriaLabel")}
      moreOptionsAriaLabel={t("moreOptionsAriaLabel")}
    />
  );
});

ShareContainer.displayName = "Share";

export default ShareContainer;
