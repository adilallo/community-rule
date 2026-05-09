"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "../../../contexts/MessagesContext";
import { CreateFlowTopNavView } from "./CreateFlowTopNav.view";
import type { CreateFlowTopNavProps } from "./CreateFlowTopNav.types";

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
    saveDraftOnExit = false,
    onShare,
    onSelectExportFormat,
    onEdit,
    onExit,
    buttonPalette,
    className = "",
  }) => {
    const router = useRouter();
    const tPopover = useTranslation("modals.popoverExport");

    const handleExit = (options?: { saveDraft?: boolean }) => {
      if (onExit) {
        onExit(options);
      } else {
        // Default behavior: navigate to home
        router.push("/");
      }
    };

    return (
      <CreateFlowTopNavView
        hasShare={hasShare}
        hasExport={hasExport}
        hasEdit={hasEdit}
        saveDraftOnExit={saveDraftOnExit}
        onShare={onShare}
        onSelectExportFormat={onSelectExportFormat}
        onEdit={onEdit}
        onExit={handleExit}
        buttonPalette={buttonPalette}
        className={className}
        exportPopoverMenuAriaLabel={tPopover("menuAriaLabel")}
        exportPopoverPdfLabel={tPopover("downloadPdf")}
        exportPopoverCsvLabel={tPopover("downloadCsv")}
        exportPopoverMarkdownLabel={tPopover("downloadMarkdown")}
      />
    );
  },
);

CreateFlowTopNavContainer.displayName = "CreateFlowTopNav";

export default CreateFlowTopNavContainer;
