"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { IconName } from "../../asset/icon";
import Logo from "../../asset/Logo";
import Button from "../../buttons/Button";
import ListItem from "../../layout/ListItem";
import Popover from "../../modals/Popover";
import { useCreateFlowSm2Up } from "../../../(app)/create/hooks/useCreateFlowSm2Up";
import { useTranslation } from "../../../contexts/MessagesContext";
import type { CreateFlowTopNavViewProps } from "./CreateFlowTopNav.types";

const outlineButtonClass =
  "md:!text-[12px] md:!leading-[14px] !text-[10px] !leading-[12px] !px-[var(--spacing-scale-006,6px)] md:!px-[var(--spacing-scale-008,8px)] !py-[6px] md:!py-[8px] !border md:!border-[1.5px]";

const exitButtonFigmaClass =
  "!rounded-[var(--radius-measures-radius-full,9999px)] !border-[1.25px] !px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!text-[12px] md:!leading-[14px]";

type ActionMenuItem = {
  id: string;
  label: string;
  leadingIcon: IconName;
  onClick: () => void;
};

function KebabIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 md:h-[14px] md:w-[14px] ${className}`}
      aria-hidden="true"
    >
      <circle cx="4" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function CreateFlowTopNavView({
  hasShare = false,
  hasExport = false,
  hasEdit = false,
  hasDuplicate = false,
  hasManageStakeholders = false,
  saveDraftOnExit = false,
  onShare,
  onSelectExportFormat,
  onEdit,
  onDuplicate,
  onManageStakeholders,
  onExit,
  exitLabel,
  duplicateLabel,
  duplicateAriaLabel,
  buttonPalette = "default",
  className = "",
  exportPopoverMenuAriaLabel,
  exportPopoverPdfLabel,
  exportPopoverCsvLabel,
  exportPopoverMarkdownLabel,
  moreOptionsAriaLabel,
  actionsMenuAriaLabel,
}: CreateFlowTopNavViewProps) {
  const t = useTranslation("create.topNav");
  const sm2Up = useCreateFlowSm2Up();
  const exitButtonText =
    exitLabel ?? (saveDraftOnExit ? t("saveAndExit") : t("exit"));
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const exportWrapRef = useRef<HTMLDivElement>(null);
  const actionsWrapRef = useRef<HTMLDivElement>(null);
  const exportMenuId = useId();
  const actionsMenuId = useId();

  const hasSecondaryActions =
    hasShare ||
    hasExport ||
    hasEdit ||
    hasDuplicate ||
    hasManageStakeholders;
  const useKebabMenu = hasSecondaryActions && !sm2Up;

  const actionMenuItems = useMemo((): ActionMenuItem[] => {
    const items: ActionMenuItem[] = [];

    if (hasShare && onShare) {
      items.push({
        id: "share",
        label: t("share"),
        leadingIcon: "mail",
        onClick: onShare,
      });
    }

    if (hasExport && onSelectExportFormat) {
      items.push(
        {
          id: "export-pdf",
          label: exportPopoverPdfLabel,
          leadingIcon: "picture_as_pdf",
          onClick: () => onSelectExportFormat("pdf"),
        },
        {
          id: "export-csv",
          label: exportPopoverCsvLabel,
          leadingIcon: "csv",
          onClick: () => onSelectExportFormat("csv"),
        },
        {
          id: "export-markdown",
          label: exportPopoverMarkdownLabel,
          leadingIcon: "markdown_copy",
          onClick: () => onSelectExportFormat("markdown"),
        },
      );
    }

    if (hasDuplicate && onDuplicate) {
      items.push({
        id: "duplicate",
        label: duplicateLabel ?? t("edit"),
        leadingIcon: "content_copy",
        onClick: onDuplicate,
      });
    } else if (hasEdit && onEdit) {
      items.push({
        id: "edit",
        label: t("edit"),
        leadingIcon: "edit",
        onClick: onEdit,
      });
    }

    if (hasManageStakeholders && onManageStakeholders) {
      items.push({
        id: "manage-stakeholders",
        label: t("manageStakeholders"),
        leadingIcon: "tags",
        onClick: onManageStakeholders,
      });
    }

    items.push({
      id: "exit",
      label: exitButtonText,
      leadingIcon: "log_out",
      onClick: () => void onExit?.({ saveDraft: saveDraftOnExit }),
    });

    return items;
  }, [
    duplicateLabel,
    exitButtonText,
    exportPopoverCsvLabel,
    exportPopoverMarkdownLabel,
    exportPopoverPdfLabel,
    hasDuplicate,
    hasEdit,
    hasExport,
    hasManageStakeholders,
    hasShare,
    onDuplicate,
    onEdit,
    onExit,
    onManageStakeholders,
    onSelectExportFormat,
    onShare,
    saveDraftOnExit,
    t,
  ]);

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
    if (!actionsMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (
        actionsWrapRef.current &&
        !actionsWrapRef.current.contains(e.target as Node)
      ) {
        setActionsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [actionsMenuOpen]);

  useEffect(() => {
    if (!exportMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExportMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exportMenuOpen]);

  useEffect(() => {
    if (!actionsMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActionsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actionsMenuOpen]);

  const inlineActions = (
    <>
      {hasShare && (
        <Button
          buttonType="outline"
          palette={buttonPalette}
          size="xsmall"
          onClick={onShare}
          ariaLabel={t("shareAriaLabel")}
          className={outlineButtonClass}
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
            className={`justify-center gap-[var(--spacing-scale-002,2px)] !pl-[var(--spacing-scale-012,12px)] !pr-[var(--spacing-scale-006,6px)] md:!pr-[var(--spacing-scale-006,6px)] ${outlineButtonClass}`}
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
              className="shrink-0 md:h-[14px] md:w-[14px]"
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

      {hasDuplicate && (
        <Button
          buttonType="outline"
          palette={buttonPalette}
          size="xsmall"
          onClick={onDuplicate}
          ariaLabel={
            duplicateAriaLabel ?? duplicateLabel ?? t("editAriaLabel")
          }
          className={outlineButtonClass}
        >
          {duplicateLabel ?? t("edit")}
        </Button>
      )}

      {hasEdit && !hasDuplicate && (
        <Button
          buttonType="outline"
          palette={buttonPalette}
          size="xsmall"
          onClick={onEdit}
          ariaLabel={t("editAriaLabel")}
          className={outlineButtonClass}
        >
          {t("edit")}
        </Button>
      )}

      {hasManageStakeholders && onManageStakeholders ? (
        <Button
          buttonType="outline"
          palette={buttonPalette}
          size="xsmall"
          type="button"
          onClick={onManageStakeholders}
          ariaLabel={t("manageStakeholdersAriaLabel")}
          className={outlineButtonClass}
        >
          {t("manageStakeholders")}
        </Button>
      ) : null}

      <Button
        buttonType="outline"
        palette={buttonPalette}
        size="xsmall"
        type="button"
        onClick={() => void onExit?.({ saveDraft: saveDraftOnExit })}
        ariaLabel={exitButtonText}
        className={`shrink-0 ${exitButtonFigmaClass} !text-[10px] !leading-[12px] !py-[6px] md:!py-[8px]`}
      >
        {exitButtonText}
      </Button>
    </>
  );

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
          {useKebabMenu ? (
            <div className="relative" ref={actionsWrapRef}>
              <Button
                buttonType="outline"
                palette={buttonPalette}
                size="xsmall"
                type="button"
                ariaLabel={moreOptionsAriaLabel}
                aria-haspopup="menu"
                aria-expanded={actionsMenuOpen}
                aria-controls={actionsMenuId}
                onClick={() => setActionsMenuOpen((open) => !open)}
                className={`!px-[var(--spacing-scale-010,10px)] ${outlineButtonClass}`}
              >
                <KebabIcon />
              </Button>
              {actionsMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+var(--spacing-measures-spacing-200,8px))] z-[300]">
                  <Popover id={actionsMenuId} menuAriaLabel={actionsMenuAriaLabel}>
                    {actionMenuItems.map((item, index) => (
                      <ListItem
                        key={item.id}
                        showDivider={index < actionMenuItems.length - 1}
                        leadingIcon={item.leadingIcon}
                        label={item.label}
                        onClick={() => {
                          item.onClick();
                          setActionsMenuOpen(false);
                        }}
                      />
                    ))}
                  </Popover>
                </div>
              ) : null}
            </div>
          ) : hasSecondaryActions ? (
            inlineActions
          ) : (
            <Button
              buttonType="outline"
              palette={buttonPalette}
              size="xsmall"
              type="button"
              onClick={() => void onExit?.({ saveDraft: saveDraftOnExit })}
              ariaLabel={exitButtonText}
              className={`shrink-0 ${exitButtonFigmaClass} !text-[10px] !leading-[12px] !py-[6px] md:!py-[8px]`}
            >
              {exitButtonText}
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}

CreateFlowTopNavView.displayName = "CreateFlowTopNavView";
