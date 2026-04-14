"use client";

import Upload from "../../../components/controls/Upload";
import { useTranslation } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";

/** Create Community — frame 6 (Figma 20094-41524). */
export function CommunityUploadScreen() {
  const { markCreateFlowInteraction } = useCreateFlow();
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation("create.communityUpload");

  const handleUploadClick = () => {
    markCreateFlowInteraction();
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
