import Separator from "../../app/components/utility/Separator";

export default {
  title: "Components/Utility/Separator",
  component: Separator,
  parameters: {
    layout: "padded",
  },
  argTypes: {},
};

export const Default = {
  render: () => (
    <div style={{ width: 320 }}>
      <Separator />
    </div>
  ),
};

export const InContext = {
  render: () => (
    <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 12 }}>
      <p>Above the separator</p>
      <Separator />
      <p>Below the separator</p>
    </div>
  ),
};
