"use client";

import Logo from "../../asset/Logo";
import Button from "../../buttons/Button";
import ListItem from "../../layout/ListItem";
import Popover from "../../modals/Popover";
import { useTranslation } from "../../../contexts/MessagesContext";
import type { CreateFlowTopNavViewProps } from "./CreateFlowTopNav.types";

const outlineButtonClass =
  "md:!text-[12px] md:!leading-[14px] !text-[10px] !leading-[12px] !px-[var(--spacing-scale-006,6px)] md:!px-[var(--spacing-scale-008,8px)] !py-[6px] md:!py-[8px] !border md:!border-[1.5px]";

const exitButtonFigmaClass =
  "!rounded-[var(--radius-measures-radius-full,9999px)] !border-[1.25px] !px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!text-[12px] md:!leading-[14px]";

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
  duplicateLabel,
  duplicateAriaLabel,
  buttonPalette = "default",
  className = "",
  exitButtonText,
  useKebabMenu,
  exportMenuOpen,
  setExportMenuOpen,
  actionsMenuOpen,
  setActionsMenuOpen,
  exportWrapRef,
  actionsWrapRef,
  exportMenuId,
  actionsMenuId,
  actionMenuItems,
  exportPopoverMenuAriaLabel,
  exportPopoverPdfLabel,
  exportPopoverCsvLabel,
  exportPopoverMarkdownLabel,
  moreOptionsAriaLabel,
  actionsMenuAriaLabel,
}: CreateFlowTopNavViewProps) {
  const t = useTranslation("create.topNav");

  const hasSecondaryActions =
    hasShare ||
    hasExport ||
    hasEdit ||
    hasDuplicate ||
    hasManageStakeholders;

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
