import Separator from "../app/components/Separator";

export default {
  title: "Components/Separator",
  component: Separator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {},
};

export const WithContent = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="p-4 bg-gray-100 rounded">Content above</div>
      <Separator />
      <div className="p-4 bg-gray-100 rounded">Content below</div>
    </div>
  ),
};
