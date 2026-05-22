"use client";

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateFlowSm2Up } from "../../../(app)/create/hooks/useCreateFlowSm2Up";
import { useTranslation } from "../../../contexts/MessagesContext";
import { CreateFlowTopNavView } from "./CreateFlowTopNav.view";
import type {
  CreateFlowTopNavActionMenuItem,
  CreateFlowTopNavProps,
} from "./CreateFlowTopNav.types";

/**
 * Figma: Utility / CreateFlowTopNav — wizard header (create-flow chrome).
 * Exit, optional share / export / edit; strings in `messages/en/create/topNav.json`.
 * Export menu: Community Rule System — node 21998:22612 (`messages/en/modals/popoverExport.json`).
 */
const CreateFlowTopNavContainer = memo<CreateFlowTopNavProps>(
  ({
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
    buttonPalette,
    className = "",
  }) => {
    const router = useRouter();
    const t = useTranslation("create.topNav");
    const tPopover = useTranslation("modals.popoverExport");
    const sm2Up = useCreateFlowSm2Up();
    const exitButtonText =
      exitLabel ?? (saveDraftOnExit ? t("saveAndExit") : t("exit"));
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
    const exportWrapRef = useRef<HTMLDivElement>(null);
    const actionsWrapRef = useRef<HTMLDivElement>(null);
    const exportMenuId = useId();
    const actionsMenuId = useId();

    const handleExit = useCallback(
      (options?: { saveDraft?: boolean }) => {
        if (onExit) {
          onExit(options);
        } else {
          // Default behavior: navigate to home
          router.push("/");
        }
      },
      [onExit, router],
    );

    const hasSecondaryActions =
      hasShare ||
      hasExport ||
      hasEdit ||
      hasDuplicate ||
      hasManageStakeholders;
    const useKebabMenu = hasSecondaryActions && !sm2Up;

    const actionMenuItems = useMemo((): CreateFlowTopNavActionMenuItem[] => {
      const items: CreateFlowTopNavActionMenuItem[] = [];

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
            label: tPopover("downloadPdf"),
            leadingIcon: "picture_as_pdf",
            onClick: () => onSelectExportFormat("pdf"),
          },
          {
            id: "export-csv",
            label: tPopover("downloadCsv"),
            leadingIcon: "csv",
            onClick: () => onSelectExportFormat("csv"),
          },
          {
            id: "export-markdown",
            label: tPopover("downloadMarkdown"),
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
        onClick: () => void handleExit({ saveDraft: saveDraftOnExit }),
      });

      return items;
    }, [
      duplicateLabel,
      exitButtonText,
      handleExit,
      hasDuplicate,
      hasEdit,
      hasExport,
      hasManageStakeholders,
      hasShare,
      onDuplicate,
      onEdit,
      onManageStakeholders,
      onSelectExportFormat,
      onShare,
      saveDraftOnExit,
      t,
      tPopover,
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

    return (
      <CreateFlowTopNavView
        hasShare={hasShare}
        hasExport={hasExport}
        hasEdit={hasEdit}
        hasDuplicate={hasDuplicate}
        hasManageStakeholders={hasManageStakeholders}
        saveDraftOnExit={saveDraftOnExit}
        onShare={onShare}
        onSelectExportFormat={onSelectExportFormat}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onManageStakeholders={onManageStakeholders}
        onExit={handleExit}
        exitLabel={exitLabel}
        duplicateLabel={duplicateLabel}
        duplicateAriaLabel={duplicateAriaLabel}
        buttonPalette={buttonPalette}
        className={className}
        exitButtonText={exitButtonText}
        useKebabMenu={useKebabMenu}
        exportMenuOpen={exportMenuOpen}
        setExportMenuOpen={setExportMenuOpen}
        actionsMenuOpen={actionsMenuOpen}
        setActionsMenuOpen={setActionsMenuOpen}
        exportWrapRef={exportWrapRef}
        actionsWrapRef={actionsWrapRef}
        exportMenuId={exportMenuId}
        actionsMenuId={actionsMenuId}
        actionMenuItems={actionMenuItems}
        exportPopoverMenuAriaLabel={tPopover("menuAriaLabel")}
        exportPopoverPdfLabel={tPopover("downloadPdf")}
        exportPopoverCsvLabel={tPopover("downloadCsv")}
        exportPopoverMarkdownLabel={tPopover("downloadMarkdown")}
        moreOptionsAriaLabel={t("moreOptionsAriaLabel")}
        actionsMenuAriaLabel={t("actionsMenuAriaLabel")}
      />
    );
  },
);

CreateFlowTopNavContainer.displayName = "CreateFlowTopNav";

export default CreateFlowTopNavContainer;
