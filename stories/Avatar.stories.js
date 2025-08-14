import Avatar from "../app/components/Avatar";

export default {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A simple avatar component that displays user profile images with multiple size variants. Supports custom images and alt text for accessibility.",
      },
    },
  },
  argTypes: {
    src: {
      control: { type: "text" },
      description: "The source URL of the avatar image",
    },
    alt: {
      control: { type: "text" },
      description: "Alt text for accessibility",
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large", "xlarge"],
      description: "The size of the avatar",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
  tags: ["autodocs"],
};

export const Default = {
  args: {
    src: "/assets/Avatar_1.png",
    alt: "User Avatar",
    size: "medium",
  },
};

export const Sizes = {
  args: {
    src: "/assets/Avatar_1.png",
    alt: "User Avatar",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Avatar {...args} size="small" />
        <Avatar {...args} size="medium" />
        <Avatar {...args} size="large" />
        <Avatar {...args} size="xlarge" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different size variants available for the avatar component.",
      },
    },
  },
};

export const DifferentAvatars = {
  args: {
    size: "large",
  },
  render: (args) => (
    <div className="space-y-4">
      <div className="space-x-4">
        <Avatar {...args} src="/assets/Avatar_1.png" alt="User 1" />
        <Avatar {...args} src="/assets/Avatar_2.png" alt="User 2" />
        <Avatar {...args} src="/assets/Avatar_3.png" alt="User 3" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different avatar images available in the project.",
      },
    },
  },
};

export const AllSizesWithDifferentAvatars = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Small Size</h3>
        <div className="space-x-4">
          <Avatar size="small" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="small" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="small" src="/assets/Avatar_3.png" alt="User 3" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Medium Size</h3>
        <div className="space-x-4">
          <Avatar size="medium" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="medium" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="medium" src="/assets/Avatar_3.png" alt="User 3" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Large Size</h3>
        <div className="space-x-4">
          <Avatar size="large" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="large" src="/assets/Avatar_3.png" alt="User 3" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">XLarge Size</h3>
        <div className="space-x-4">
          <Avatar size="xlarge" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="xlarge" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="xlarge" src="/assets/Avatar_3.png" alt="User 3" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete overview of all avatar sizes with different user images.",
      },
    },
  },
};
