import React, { useState } from "react";
import Alert from "../../app/components/modals/Alert";

export default {
  title: "Components/Modals/Alert",
  component: Alert,
  argTypes: {
    status: {
      control: { type: "select" },
      options: ["default", "positive", "warning", "danger"],
    },
    type: {
      control: { type: "select" },
      options: ["toast", "banner"],
    },
    title: {
      control: { type: "text" },
    },
    description: {
      control: { type: "text" },
    },
  },
};

const Template = (args) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return <div>Alert closed</div>;
  return (
    <div className="p-8 max-w-[600px]">
      <Alert {...args} onClose={() => setIsVisible(false)} />
    </div>
  );
};

export const ToastDefault = Template.bind({});
ToastDefault.args = {
  title: "Short alert toast message goes here",
  description:
    "Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse.",
  status: "default",
  type: "toast",
};

export const ToastPositive = Template.bind({});
ToastPositive.args = {
  title: "Short alert toast message goes here",
  description:
    "Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse.",
  status: "positive",
  type: "toast",
};

export const ToastWarning = Template.bind({});
ToastWarning.args = {
  title: "Short alert toast message goes here",
  description:
    "Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse.",
  status: "warning",
  type: "toast",
};

export const ToastDanger = Template.bind({});
ToastDanger.args = {
  title: "Short alert toast message goes here",
  description:
    "Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse.",
  status: "danger",
  type: "toast",
};

export const Banner = Template.bind({});
Banner.args = {
  title: "Short alert banner message goes here",
  description:
    "Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse.",
  status: "default",
  type: "banner",
};

export const BannerPositive = Template.bind({});
BannerPositive.args = {
  title: "Short alert banner message goes here",
  description:
    "Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse.",
  status: "positive",
  type: "banner",
};

export const BannerWarning = Template.bind({});
BannerWarning.args = {
  title: "Short alert banner message goes here",
  description:
    "Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse.",
  status: "warning",
  type: "banner",
};

export const BannerDanger = Template.bind({});
BannerDanger.args = {
  title: "Short alert banner message goes here",
  description:
    "Nascetur ipsum a nisi tempor cras nam neque volutpat. Aliquam id est faucibus nunc quis. Eleifend suspendisse.",
  status: "danger",
  type: "banner",
};

export const TitleOnly = Template.bind({});
TitleOnly.args = {
  title: "Short alert banner message goes here",
  status: "default",
  type: "toast",
};

export const AllStatuses = () => {
  const [visible, setVisible] = useState({
    default: true,
    positive: true,
    warning: true,
    danger: true,
  });

  return (
    <div className="p-8 space-y-4 max-w-[600px]">
      {visible.default && (
        <Alert
          title="Default alert"
          description="This is a default alert message"
          status="default"
          type="toast"
          onClose={() => setVisible({ ...visible, default: false })}
        />
      )}
      {visible.positive && (
        <Alert
          title="Positive alert"
          description="This is a positive alert message"
          status="positive"
          type="toast"
          onClose={() => setVisible({ ...visible, positive: false })}
        />
      )}
      {visible.warning && (
        <Alert
          title="Warning alert"
          description="This is a warning alert message"
          status="warning"
          type="toast"
          onClose={() => setVisible({ ...visible, warning: false })}
        />
      )}
      {visible.danger && (
        <Alert
          title="Danger alert"
          description="This is a danger alert message"
          status="danger"
          type="toast"
          onClose={() => setVisible({ ...visible, danger: false })}
        />
      )}
    </div>
  );
};
