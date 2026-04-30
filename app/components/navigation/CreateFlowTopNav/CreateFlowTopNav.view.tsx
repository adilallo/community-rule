"use client";

import { useEffect, useId, useRef, useState } from "react";
import Logo from "../../asset/Logo";
import Button from "../../buttons/Button";
import ListItem from "../../layout/ListItem";
import Popover from "../../modals/Popover";
import { useTranslation } from "../../../contexts/MessagesContext";
import type { CreateFlowTopNavViewProps } from "./CreateFlowTopNav.types";

const exitButtonFigmaClass =
  "!rounded-[var(--radius-measures-radius-full,9999px)] !border-[1.25px] !px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!text-[12px] md:!leading-[14px]";

export function CreateFlowTopNavView({
  hasShare = false,
  hasExport = false,
  hasEdit = false,
  saveDraftOnExit = false,
  onShare,
  onSelectExportFormat,
  onEdit,
  onExit,
  buttonPalette = "default",
  className = "",
  exportPopoverMenuAriaLabel,
  exportPopoverPdfLabel,
  exportPopoverCsvLabel,
  exportPopoverMarkdownLabel,
}: CreateFlowTopNavViewProps) {
  const t = useTranslation("create.topNav");
  const exitButtonText = saveDraftOnExit ? t("saveAndExit") : t("exit");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportWrapRef = useRef<HTMLDivElement>(null);
  const exportMenuId = useId();

  useEffect(() => {
    if (!exportMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (
        exportWrapRef.current &&
        !exportWrapRef.current.contains(e.target as Node)
      ) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [exportMenuOpen]);

  useEffect(() => {
    if (!exportMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExportMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exportMenuOpen]);

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

          {hasExport && onSelectExportFormat ? (
            <div className="relative" ref={exportWrapRef}>
              <Button
                buttonType="outline"
                palette={buttonPalette}
                size="xsmall"
                type="button"
                ariaLabel={t("exportAriaLabel")}
                aria-haspopup="menu"
                aria-expanded={exportMenuOpen}
                aria-controls={exportMenuId}
                onClick={() => setExportMenuOpen((o) => !o)}
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
              {exportMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+var(--spacing-measures-spacing-200,8px))] z-[300]">
                  <Popover
                    id={exportMenuId}
                    menuAriaLabel={exportPopoverMenuAriaLabel}
                  >
                    <ListItem
                      showDivider
                      leadingIcon="picture_as_pdf"
                      label={exportPopoverPdfLabel}
                      onClick={() => {
                        onSelectExportFormat("pdf");
                        setExportMenuOpen(false);
                      }}
                    />
                    <ListItem
                      showDivider
                      leadingIcon="csv"
                      label={exportPopoverCsvLabel}
                      onClick={() => {
                        onSelectExportFormat("csv");
                        setExportMenuOpen(false);
                      }}
                    />
                    <ListItem
                      showDivider={false}
                      leadingIcon="markdown_copy"
                      label={exportPopoverMarkdownLabel}
                      onClick={() => {
                        onSelectExportFormat("markdown");
                        setExportMenuOpen(false);
                      }}
                    />
                  </Popover>
                </div>
              ) : null}
            </div>
          ) : null}

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

CreateFlowTopNavView.displayName = "CreateFlowTopNavView";
