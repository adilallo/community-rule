import ModalHeader from "../../app/components/utility/ModalHeader";

export default {
  title: "Components/Utility/ModalHeader",
  component: ModalHeader,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    showCloseButton: {
      control: "boolean",
      description: "Whether to render the close button on the left",
    },
    showMoreOptionsButton: {
      control: "boolean",
      description: "Whether to render the more-options button on the right",
    },
    onClose: { action: "close-clicked" },
    onMoreOptions: { action: "more-options-clicked" },
  },
};

export const Default = {
  args: {
    showCloseButton: true,
    showMoreOptionsButton: true,
  },
};

export const CloseOnly = {
  args: {
    showCloseButton: true,
    showMoreOptionsButton: false,
  },
};

export const MoreOptionsOnly = {
  args: {
    showCloseButton: false,
    showMoreOptionsButton: true,
  },
};
