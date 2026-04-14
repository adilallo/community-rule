import { CreateFlowTextFieldScreen } from "../../app/create/screens/text/CreateFlowTextFieldScreen";

export default {
  title: "Pages/Create/CommunityName",
  component: CreateFlowTextFieldScreen,
  parameters: { layout: "fullscreen" },
};

export const Default = {
  args: {
    messageNamespace: "create.communityName",
    stateField: "title",
    maxLength: 48,
  },
};
