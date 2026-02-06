import IconCard from "../../app/components/cards/IconCard";
import { getAssetPath } from "../../lib/assetUtils";

export default {
  title: "Components/Cards/IconCard",
  component: IconCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An interactive card component that displays an icon, title, and description. Features hover states, keyboard navigation, and accessibility support. Use Tab key to test focus indicators and Enter/Space to activate.",
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: "The icon element to display at the top of the card",
    },
    title: {
      control: { type: "text" },
      description: "The main title of the card",
    },
    description: {
      control: { type: "text" },
      description: "The description text displayed in uppercase",
    },
    onClick: { action: "clicked" },
  },
  tags: ["autodocs"],
};

// Worker's Coop icon
const WorkerCoopIcon = () => (
  <img
    src={getAssetPath("assets/Vector_WorkerCoop.svg")}
    alt=""
    className="w-[36px] h-[36px]"
    width="36"
    height="36"
  />
);

export const Default = {
  args: {
    icon: <WorkerCoopIcon />,
    title: "Worker's cooperatives",
    description:
      "Employee-owned businesses often need to clarify how power is shared, decisions are made, and how processes operate within their organizations.",
  },
};

export const WithLongTitle = {
  args: {
    icon: <WorkerCoopIcon />,
    title: "This is a very long title that might wrap to multiple lines",
    description:
      "Employee-owned businesses often need to clarify how power is shared.",
  },
};

export const WithShortDescription = {
  args: {
    icon: <WorkerCoopIcon />,
    title: "Worker's cooperatives",
    description: "Short description",
  },
};

export const Interactive = {
  args: {
    icon: <WorkerCoopIcon />,
    title: "Clickable Card",
    description: "This card has an onClick handler",
    onClick: () => {
      console.log("Card clicked!");
    },
  },
};
