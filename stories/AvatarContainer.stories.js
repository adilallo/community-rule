import AvatarContainer from "../app/components/AvatarContainer";
import Avatar from "../app/components/Avatar";

export default {
  title: "Components/AvatarContainer",
  component: AvatarContainer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large", "xlarge"],
    },
  },
  args: {
    size: "medium",
  },
};

export const Default = {
  render: (args) => (
    <AvatarContainer {...args}>
      <Avatar src="/assets/Avatar_1.png" alt="User 1" size={args.size} />
      <Avatar src="/assets/Avatar_2.png" alt="User 2" size={args.size} />
      <Avatar src="/assets/Avatar_3.png" alt="User 3" size={args.size} />
    </AvatarContainer>
  ),
};

export const Small = {
  render: (args) => (
    <AvatarContainer size="small">
      <Avatar src="/assets/Avatar_1.png" alt="User 1" size="small" />
      <Avatar src="/assets/Avatar_2.png" alt="User 2" size="small" />
      <Avatar src="/assets/Avatar_3.png" alt="User 3" size="small" />
    </AvatarContainer>
  ),
};

export const Large = {
  render: (args) => (
    <AvatarContainer size="large">
      <Avatar src="/assets/Avatar_1.png" alt="User 1" size="large" />
      <Avatar src="/assets/Avatar_2.png" alt="User 2" size="large" />
      <Avatar src="/assets/Avatar_3.png" alt="User 3" size="large" />
    </AvatarContainer>
  ),
};

export const XLarge = {
  render: (args) => (
    <AvatarContainer size="xlarge">
      <Avatar src="/assets/Avatar_1.png" alt="User 1" size="xlarge" />
      <Avatar src="/assets/Avatar_2.png" alt="User 2" size="xlarge" />
      <Avatar src="/assets/Avatar_3.png" alt="User 3" size="xlarge" />
    </AvatarContainer>
  ),
};
