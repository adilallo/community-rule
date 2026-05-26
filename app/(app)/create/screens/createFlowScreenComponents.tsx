/**
 * Step → screen component map (Linear CR-92 §3). Keeps {@link CreateFlowScreenView}
 * thin; pair with {@link CREATE_FLOW_SCREEN_REGISTRY} metadata in tests/docs so
 * new steps do not drift.
 *
 * `InformationalScreen` is statically imported because it is the entry step;
 * every other screen is lazy-loaded so visiting `/create/informational` does
 * not pull the rest of the wizard into the initial bundle.
 */

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { CreateFlowStep } from "../types";
import { InformationalScreen } from "./informational/InformationalScreen";

const CreateFlowTextFieldScreen = dynamic(
  () =>
    import("./text/CreateFlowTextFieldScreen").then((m) => ({
      default: m.CreateFlowTextFieldScreen,
    })),
  { loading: () => null },
);
const CommunitySizeSelectScreen = dynamic(
  () =>
    import("./select/CommunitySizeSelectScreen").then((m) => ({
      default: m.CommunitySizeSelectScreen,
    })),
  { loading: () => null },
);
const CommunityStructureSelectScreen = dynamic(
  () =>
    import("./select/CommunityStructureSelectScreen").then((m) => ({
      default: m.CommunityStructureSelectScreen,
    })),
  { loading: () => null },
);
const CoreValuesSelectScreen = dynamic(
  () =>
    import("./select/CoreValuesSelectScreen").then((m) => ({
      default: m.CoreValuesSelectScreen,
    })),
  { loading: () => null },
);
const ConfirmStakeholdersScreen = dynamic(
  () =>
    import("./select/ConfirmStakeholdersScreen").then((m) => ({
      default: m.ConfirmStakeholdersScreen,
    })),
  { loading: () => null },
);
const CommunityUploadScreen = dynamic(
  () =>
    import("./upload/CommunityUploadScreen").then((m) => ({
      default: m.CommunityUploadScreen,
    })),
  { loading: () => null },
);
const CommunityReviewScreen = dynamic(
  () =>
    import("./review/CommunityReviewScreen").then((m) => ({
      default: m.CommunityReviewScreen,
    })),
  { loading: () => null },
);
const FinalReviewScreen = dynamic(
  () =>
    import("./review/FinalReviewScreen").then((m) => ({
      default: m.FinalReviewScreen,
    })),
  { loading: () => null },
);
const CommunicationMethodsScreen = dynamic(
  () =>
    import("./card/CommunicationMethodsScreen").then((m) => ({
      default: m.CommunicationMethodsScreen,
    })),
  { loading: () => null },
);
const MembershipMethodsScreen = dynamic(
  () =>
    import("./card/MembershipMethodsScreen").then((m) => ({
      default: m.MembershipMethodsScreen,
    })),
  { loading: () => null },
);
const ConflictManagementScreen = dynamic(
  () =>
    import("./card/ConflictManagementScreen").then((m) => ({
      default: m.ConflictManagementScreen,
    })),
  { loading: () => null },
);
const DecisionApproachesScreen = dynamic(
  () =>
    import("./right-rail/DecisionApproachesScreen").then((m) => ({
      default: m.DecisionApproachesScreen,
    })),
  { loading: () => null },
);
const CompletedScreen = dynamic(
  () =>
    import("./completed/CompletedScreen").then((m) => ({
      default: m.CompletedScreen,
    })),
  { loading: () => null },
);

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
