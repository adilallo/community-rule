"use client";

import Upload from "../../../components/controls/Upload";
import { useMessages } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import { CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS } from "../../components/createFlowLayoutTokens";

/** Create Community — Figma Flow — Upload `20094:41524`. */
export function CommunityUploadScreen() {
  const m = useMessages();
  const u = m.create.communityUpload;
  const { markCreateFlowInteraction } = useCreateFlow();

  const handleUploadClick = () => {
    markCreateFlowInteraction();
  };

  return (
    <CreateFlowStepShell
      variant="centeredNarrow"
      contentTopBelowMd="space-1400"
    >
      <div
        className={`flex flex-col items-center gap-[18px] ${CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}`}
      >
        <div className="w-full">
          <CreateFlowHeaderLockup
            title={u.title}
            description={u.description}
            justification="center"
          />
        </div>
        <div className="w-full">
          <Upload
            active={true}
            showHelpIcon={false}
            hintText={u.hintText}
            onClick={handleUploadClick}
          />
        </div>
      </div>
    </CreateFlowStepShell>
  );
}
