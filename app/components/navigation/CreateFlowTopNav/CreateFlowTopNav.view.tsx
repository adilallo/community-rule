"use client";

import Logo from "../../asset/Logo";
import Button from "../../buttons/Button";
import { useTranslation } from "../../../contexts/MessagesContext";
import type { CreateFlowTopNavProps } from "./CreateFlowTopNav.types";

const exitButtonFigmaClass =
  "!rounded-[var(--radius-measures-radius-full,9999px)] !border-[1.25px] !px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!text-[12px] md:!leading-[14px]";

export function CreateFlowTopNavView({
  hasShare = false,
  hasExport = false,
  hasEdit = false,
  saveDraftOnExit = false,
  onShare,
  onExport,
  onEdit,
  onExit,
  buttonPalette = "default",
  className = "",
}: CreateFlowTopNavProps) {
  const t = useTranslation("create.topNav");
  const exitButtonText = saveDraftOnExit ? t("saveAndExit") : t("exit");

  return (
    <header
      className={`bg-black w-full ${className}`}
      role="banner"
      aria-label={t("bannerAriaLabel")}
    >
      <nav
        className="flex items-center justify-between mx-auto max-w-[639px] md:max-w-[1920px] px-[var(--spacing-measures-spacing-500,20px)] md:px-[48px] py-[var(--spacing-measures-spacing-300,12px)] md:py-[var(--spacing-measures-spacing-016,16px)]"
        role="navigation"
        aria-label={t("navAriaLabel")}
      >
        <Logo size="createFlow" wordmark palette={buttonPalette} />

        <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-scale-012,12px)]">
          {hasShare && (
            <Button
              buttonType="outline"
              palette={buttonPalette}
              size="xsmall"
              onClick={onShare}
              ariaLabel={t("shareAriaLabel")}
              className="md:!text-[12px] md:!leading-[14px] !text-[10px] !leading-[12px] !px-[var(--spacing-scale-006,6px)] md:!px-[var(--spacing-scale-008,8px)] !py-[6px] md:!py-[8px] !border md:!border-[1.5px]"
            >
              {t("share")}
            </Button>
          )}

          {hasExport && (
            <Button
              buttonType="outline"
              palette={buttonPalette}
              size="xsmall"
              onClick={onExport}
              ariaLabel={t("exportAriaLabel")}
              className="justify-center gap-[var(--spacing-scale-002,2px)] !pl-[var(--spacing-scale-012,12px)] !pr-[var(--spacing-scale-006,6px)] md:!pr-[var(--spacing-scale-006,6px)] !text-[10px] md:!text-[12px] !leading-[12px] md:!leading-[14px] !py-[6px] md:!py-[8px] !border md:!border-[1.5px]"
            >
              <span>{t("export")}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 md:w-[14px] md:h-[14px]"
                aria-hidden="true"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </Button>
          )}

          {hasEdit && (
            <Button
              buttonType="outline"
              palette={buttonPalette}
              size="xsmall"
              onClick={onEdit}
              ariaLabel={t("editAriaLabel")}
              className="md:!text-[12px] md:!leading-[14px] !text-[10px] !leading-[12px] !px-[var(--spacing-scale-006,6px)] md:!px-[var(--spacing-scale-008,8px)] !py-[6px] md:!py-[8px] !border md:!border-[1.5px]"
            >
              {t("edit")}
            </Button>
          )}

          <Button
            buttonType="outline"
            palette={buttonPalette}
            size="xsmall"
            type="button"
            onClick={() => void onExit?.({ saveDraft: saveDraftOnExit })}
            ariaLabel={exitButtonText}
            className={`md:!text-[12px] md:!leading-[14px] !text-[10px] !leading-[12px] !py-[6px] md:!py-[8px] shrink-0 ${exitButtonFigmaClass}`}
          >
            {exitButtonText}
          </Button>
        </div>
      </nav>
    </header>
  );
}
