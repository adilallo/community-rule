import { CreateFlowTextFieldScreen } from "../../app/(app)/create/screens/text/CreateFlowTextFieldScreen";

export default {
  title: "Pages/Create/CommunityName",
  component: CreateFlowTextFieldScreen,
  parameters: { layout: "fullscreen" },
};

export const Default = {
  args: {
    messageNamespace: "create.community.communityName",
    stateField: "title",
    maxLength: 48,
  },
};
