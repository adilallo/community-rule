import Logo from "../app/components/Logo";

export default {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: [
        "default",
        "homeHeaderXsmall",
        "homeHeaderSm",
        "homeHeaderMd",
        "homeHeaderLg",
        "homeHeaderXl",
        "header",
        "headerMd",
        "headerLg",
        "headerXl",
        "footer",
        "footerLg",
      ],
    },
    showText: {
      control: { type: "boolean" },
    },
  },
  args: {
    size: "default",
    showText: true,
  },
};

export const Default = {
  args: {},
};

export const IconOnly = {
  args: {
    showText: false,
  },
};

export const HomeHeaderSizes = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">XSmall:</span>
        <Logo size="homeHeaderXsmall" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">Small:</span>
        <Logo size="homeHeaderSm" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">Medium:</span>
        <Logo size="homeHeaderMd" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">Large:</span>
        <Logo size="homeHeaderLg" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">XLarge:</span>
        <Logo size="homeHeaderXl" />
      </div>
    </div>
  ),
};

export const HeaderSizes = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">Default:</span>
        <Logo size="header" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">Medium:</span>
        <Logo size="headerMd" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">Large:</span>
        <Logo size="headerLg" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">XLarge:</span>
        <Logo size="headerXl" />
      </div>
    </div>
  ),
};

export const FooterSizes = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">Default:</span>
        <Logo size="footer" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium w-24">Large:</span>
        <Logo size="footerLg" />
      </div>
    </div>
  ),
};
