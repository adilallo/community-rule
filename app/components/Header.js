import Logo from "./Logo";
import MenuBar from "./MenuBar";
import MenuBarItem from "./MenuBarItem";
import Button from "./Button";
import AvatarContainer from "./AvatarContainer";
import Avatar from "./Avatar";

export default function Header() {
  const navigationItems = [
    { href: "#", text: "Use cases", extraPadding: true },
    { href: "#", text: "Learn" },
    { href: "#", text: "About" },
  ];

  const avatarImages = [
    { src: "/assets/Avatar_1.png", alt: "Avatar 1" },
    { src: "/assets/Avatar_2.png", alt: "Avatar 2" },
    { src: "/assets/Avatar_3.png", alt: "Avatar 3" },
  ];

  const logoConfig = [
    { breakpoint: "block sm:hidden", size: "header", showText: false },
    { breakpoint: "hidden sm:block md:hidden", size: "header", showText: true },
    {
      breakpoint: "hidden md:block lg:hidden",
      size: "headerMd",
      showText: true,
    },
    { breakpoint: "hidden lg:block", size: "headerLg", showText: true },
  ];

  const renderNavigationItems = (size) => {
    return navigationItems.map((item, index) => (
      <MenuBarItem
        key={index}
        href={item.href}
        size={item.extraPadding && size === "xsmall" ? "xsmallUseCases" : size}
      >
        {item.text}
      </MenuBarItem>
    ));
  };

  const renderAvatarGroup = (containerSize, avatarSize) => {
    return (
      <AvatarContainer size={containerSize}>
        {avatarImages.map((avatar, index) => (
          <Avatar
            key={index}
            src={avatar.src}
            alt={avatar.alt}
            size={avatarSize}
          />
        ))}
      </AvatarContainer>
    );
  };

  const renderLoginButton = (size, marginRight) => {
    return (
      <MenuBarItem href="#" size={size} className={marginRight}>
        Log in
      </MenuBarItem>
    );
  };

  const renderCreateRuleButton = (
    buttonSize,
    containerSize,
    avatarSize,
    marginLeft
  ) => {
    return (
      <Button size={buttonSize} className={marginLeft}>
        {renderAvatarGroup(containerSize, avatarSize)}
        <span>Create rule</span>
      </Button>
    );
  };

  const renderLogo = (size, showText) => {
    return <Logo size={size} showText={showText} />;
  };

  return (
    <header className="bg-[var(--color-surface-default-primary)] w-full border-b border-[var(--border-color-default-tertiary)]">
      <div className="flex items-center justify-between mx-auto max-w-[1920px] h-[40px] lg:h-[84px] px-[var(--spacing-measures-spacing-016)] py-[var(--spacing-measures-spacing-008)] lg:px-[var(--spacing-measures-spacing-64,64px)] lg:py-[var(--spacing-measures-spacing-016,16px)]">
        <div>
          {logoConfig.map((config, index) => (
            <div key={index} className={config.breakpoint}>
              {renderLogo(config.size, config.showText)}
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <div className="block sm:hidden">
            <MenuBar className="gap-[var(--spacing-scale-001)]">
              {renderNavigationItems("xsmall")}
              {renderLoginButton("xsmall")}
            </MenuBar>
          </div>

          <div className="hidden sm:block md:hidden absolute left-1/2 transform -translate-x-1/2">
            <MenuBar className="gap-[var(--spacing-scale-001)]">
              {renderNavigationItems("xsmall")}
              {renderLoginButton("xsmall")}
            </MenuBar>
          </div>

          <div className="hidden md:block lg:hidden absolute left-1/2 transform -translate-x-1/2 ml-[var(--spacing-scale-024)]">
            <MenuBar className="gap-[var(--spacing-scale-001)]">
              {renderNavigationItems("xsmall")}
            </MenuBar>
          </div>

          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 -ml-[var(--spacing-scale-024)]">
            <MenuBar size="large">{renderNavigationItems("large")}</MenuBar>
          </div>

          <div className="hidden md:block lg:hidden absolute right-[var(--spacing-measures-spacing-016)]">
            <div className="flex items-center">
              {renderLoginButton("xsmall", "mr-[var(--spacing-scale-010)]")}
              {renderCreateRuleButton("xsmall", "medium", "medium")}
            </div>
          </div>

          <div className="hidden lg:flex items-center">
            {renderLoginButton("large", "mr-[var(--spacing-scale-012)]")}
            {renderCreateRuleButton("large", "xlarge", "xlarge")}
          </div>

          <div className="block md:hidden">
            {renderCreateRuleButton("xsmall", "small", "small")}
          </div>
        </div>
      </div>
    </header>
  );
}
