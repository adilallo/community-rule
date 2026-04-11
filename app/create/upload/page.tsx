"use client";

import Upload from "../../components/controls/Upload";
import { useTranslation } from "../../contexts/MessagesContext";
import { useCreateFlow } from "../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../components/CreateFlowStepShell";

/**
 * Upload page for the create flow
 *
 * Displays upload functionality using HeaderLockup and Upload components.
 * Responsive layout: centered at `md` and up, left-aligned below.
 * Lockup sizing via `CreateFlowHeaderLockup`.
 */
export default function UploadPage() {
  const { markCreateFlowInteraction } = useCreateFlow();
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation("create.upload");

  const handleUploadClick = () => {
    markCreateFlowInteraction();
    // TODO: Handle upload button click (e.g. open file picker)
  };

  return (
    <CreateFlowStepShell
      variant="centeredNarrow"
      contentTopBelowMd="space-1400"
    >
      <div className="flex w-full max-w-[640px] flex-col items-center gap-[18px]">
        <CreateFlowHeaderLockup
          title={t("title")}
          description={t("description")}
          justification={mdUp ? "center" : "left"}
        />
        <div className="w-full max-w-[474px]">
          <Upload
            active={true}
            showHelpIcon={true}
            onClick={handleUploadClick}
          />
        </div>
      </div>
    </CreateFlowStepShell>
  );
}
