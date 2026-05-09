/**
 * Step → screen component map (Linear CR-92 §3). Keeps {@link CreateFlowScreenView}
 * thin; pair with {@link CREATE_FLOW_SCREEN_REGISTRY} metadata in tests/docs so
 * new steps do not drift.
 */

import type { ReactNode } from "react";
import type { CreateFlowStep } from "../types";
import { InformationalScreen } from "./informational/InformationalScreen";
import { CreateFlowTextFieldScreen } from "./text/CreateFlowTextFieldScreen";
import { CommunitySizeSelectScreen } from "./select/CommunitySizeSelectScreen";
import { CommunityStructureSelectScreen } from "./select/CommunityStructureSelectScreen";
import { CoreValuesSelectScreen } from "./select/CoreValuesSelectScreen";
import { ConfirmStakeholdersScreen } from "./select/ConfirmStakeholdersScreen";
import { CommunityUploadScreen } from "./upload/CommunityUploadScreen";
import { CommunityReviewScreen } from "./review/CommunityReviewScreen";
import { FinalReviewScreen } from "./review/FinalReviewScreen";
import { CommunicationMethodsScreen } from "./card/CommunicationMethodsScreen";
import { MembershipMethodsScreen } from "./card/MembershipMethodsScreen";
import { ConflictManagementScreen } from "./card/ConflictManagementScreen";
import { DecisionApproachesScreen } from "./right-rail/DecisionApproachesScreen";
import { CompletedScreen } from "./completed/CompletedScreen";

export function renderCreateFlowScreen(screenId: CreateFlowStep): ReactNode {
  switch (screenId) {
    case "informational":
      return <InformationalScreen />;
    case "community-name":
      return (
        <CreateFlowTextFieldScreen
          messageNamespace="create.community.communityName"
          stateField="title"
          maxLength={48}
        />
      );
    case "community-structure":
      return <CommunityStructureSelectScreen />;
    case "community-context":
      return (
        <CreateFlowTextFieldScreen
          messageNamespace="create.community.communityContext"
          stateField="communityContext"
          maxLength={200}
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
          messageNamespace="create.community.communitySave"
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
    case "core-values":
      return <CoreValuesSelectScreen />;
    case "communication-methods":
      return <CommunicationMethodsScreen />;
    case "membership-methods":
      return <MembershipMethodsScreen />;
    case "decision-approaches":
      return <DecisionApproachesScreen />;
    case "conflict-management":
      return <ConflictManagementScreen />;
    case "confirm-stakeholders":
      return <ConfirmStakeholdersScreen />;
    case "final-review":
      return <FinalReviewScreen />;
    case "edit-rule":
      return <FinalReviewScreen variant="editPublished" />;
    case "completed":
      return <CompletedScreen />;
    default: {
      const _exhaustive: never = screenId;
      return _exhaustive;
    }
  }
}
