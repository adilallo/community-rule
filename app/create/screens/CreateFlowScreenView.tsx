"use client";

import type { ReactNode } from "react";
import type { CreateFlowStep } from "../types";
import { InformationalScreen } from "./informational/InformationalScreen";
import { CreateFlowTextFieldScreen } from "./text/CreateFlowTextFieldScreen";
import { CommunitySizeSelectScreen } from "./select/CommunitySizeSelectScreen";
import { CommunityStructureSelectScreen } from "./select/CommunityStructureSelectScreen";
import { ConfirmStakeholdersScreen } from "./select/ConfirmStakeholdersScreen";
import { CommunityUploadScreen } from "./upload/CommunityUploadScreen";
import { CommunityReviewScreen } from "./review/CommunityReviewScreen";
import { FinalReviewScreen } from "./review/FinalReviewScreen";
import { CardsScreen } from "./card/CardsScreen";
import { RightRailScreen } from "./right-rail/RightRailScreen";
import { CompletedScreen } from "./completed/CompletedScreen";

/**
 * Renders the create-flow screen for a validated `screenId` (URL segment under /create/).
 */
export function CreateFlowScreenView({
  screenId,
}: {
  screenId: CreateFlowStep;
}): ReactNode {
  switch (screenId) {
    case "informational":
      return <InformationalScreen />;
    case "community-name":
      return (
        <CreateFlowTextFieldScreen
          messageNamespace="create.communityName"
          stateField="title"
          maxLength={48}
        />
      );
    case "community-structure":
      return <CommunityStructureSelectScreen />;
    case "community-context":
      return (
        <CreateFlowTextFieldScreen
          messageNamespace="create.communityContext"
          stateField="communityContext"
          maxLength={48}
          mainAlign="center"
        />
      );
    case "community-size":
      return <CommunitySizeSelectScreen />;
    case "community-upload":
      return <CommunityUploadScreen />;
    case "community-save":
      return (
        <CreateFlowTextFieldScreen
          messageNamespace="create.communitySave"
          stateField="communitySaveEmail"
          maxLength={254}
          mainAlign="center"
          inputType="email"
          showCharacterCount={false}
          headerJustification="center"
        />
      );
    case "review":
      return <CommunityReviewScreen />;
    case "cards":
      return <CardsScreen />;
    case "right-rail":
      return <RightRailScreen />;
    case "confirm-stakeholders":
      return <ConfirmStakeholdersScreen />;
    case "final-review":
      return <FinalReviewScreen />;
    case "completed":
      return <CompletedScreen />;
    default: {
      const _exhaustive: never = screenId;
      return _exhaustive;
    }
  }
}
