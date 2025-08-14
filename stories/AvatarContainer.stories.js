import AvatarContainer from "../app/components/AvatarContainer";
import Avatar from "../app/components/Avatar";

export default {
  title: "Components/AvatarContainer",
  component: AvatarContainer,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A container component that groups multiple avatars together with overlapping spacing. Useful for displaying multiple users or team members in a compact format.",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large", "xlarge"],
      description: "The size of the avatar container and its children",
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
    size: "medium",
  },
  render: (args) => (
    <AvatarContainer {...args}>
      <Avatar size={args.size} src="/assets/Avatar_1.png" alt="User 1" />
      <Avatar size={args.size} src="/assets/Avatar_2.png" alt="User 2" />
      <Avatar size={args.size} src="/assets/Avatar_3.png" alt="User 3" />
    </AvatarContainer>
  ),
};

export const Sizes = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Small Size</h3>
        <AvatarContainer size="small">
          <Avatar size="small" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="small" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="small" src="/assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Medium Size</h3>
        <AvatarContainer size="medium">
          <Avatar size="medium" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="medium" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="medium" src="/assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Large Size</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="large" src="/assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">XLarge Size</h3>
        <AvatarContainer size="xlarge">
          <Avatar size="xlarge" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="xlarge" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="xlarge" src="/assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Different size variants of the avatar container with overlapping spacing.",
      },
    },
  },
};

export const DifferentGroupSizes = {
  args: {},
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">2 Users</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="/assets/Avatar_2.png" alt="User 2" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">3 Users</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="large" src="/assets/Avatar_3.png" alt="User 3" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">4 Users</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="large" src="/assets/Avatar_3.png" alt="User 3" />
          <Avatar size="large" src="/assets/Avatar_1.png" alt="User 4" />
        </AvatarContainer>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">5 Users</h3>
        <AvatarContainer size="large">
          <Avatar size="large" src="/assets/Avatar_1.png" alt="User 1" />
          <Avatar size="large" src="/assets/Avatar_2.png" alt="User 2" />
          <Avatar size="large" src="/assets/Avatar_3.png" alt="User 3" />
          <Avatar size="large" src="/assets/Avatar_1.png" alt="User 4" />
          <Avatar size="large" src="/assets/Avatar_2.png" alt="User 5" />
        </AvatarContainer>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Avatar containers with different numbers of users to show the overlapping effect.",
      },
    },
  },
};

export const InContext = {
  args: {},
  render: () => (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white font-semibold mb-6">
          Avatar Container in Context
        </h2>

        <div className="space-y-8">
          <div className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Team Members</h3>
            <div className="flex items-center space-x-4">
              <AvatarContainer size="medium">
                <Avatar size="medium" src="/assets/Avatar_1.png" alt="User 1" />
                <Avatar size="medium" src="/assets/Avatar_2.png" alt="User 2" />
                <Avatar size="medium" src="/assets/Avatar_3.png" alt="User 3" />
              </AvatarContainer>
              <span className="text-white">3 team members</span>
            </div>
          </div>

          <div className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">
              Project Contributors
            </h3>
            <div className="flex items-center space-x-4">
              <AvatarContainer size="large">
                <Avatar size="large" src="/assets/Avatar_1.png" alt="User 1" />
                <Avatar size="large" src="/assets/Avatar_2.png" alt="User 2" />
                <Avatar size="large" src="/assets/Avatar_3.png" alt="User 3" />
                <Avatar size="large" src="/assets/Avatar_1.png" alt="User 4" />
              </AvatarContainer>
              <span className="text-white">4 contributors</span>
            </div>
          </div>

          <div className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Small Team</h3>
            <div className="flex items-center space-x-4">
              <AvatarContainer size="small">
                <Avatar size="small" src="/assets/Avatar_1.png" alt="User 1" />
                <Avatar size="small" src="/assets/Avatar_2.png" alt="User 2" />
              </AvatarContainer>
              <span className="text-white">2 members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Avatar containers used in realistic contexts to show how they integrate with other UI elements.",
      },
    },
  },
};
