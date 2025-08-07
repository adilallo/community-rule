import Logo from "./Logo";
import MenuBar from "./MenuBar";
import MenuBarItem from "./MenuBarItem";
import Button from "./Button";
import AvatarContainer from "./AvatarContainer";
import Avatar from "./Avatar";

export default function Header({ onToggle }) {
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
    {
      breakpoint: "hidden lg:block xl:hidden",
      size: "headerLg",
      showText: true,
    },
    { breakpoint: "hidden xl:block", size: "headerXl", showText: true },
  ];

  const renderNavigationItems = (size) => {
    return navigationItems.map((item, index) => (
      <MenuBarItem
        key={index}
        href={item.href}
        size={item.extraPadding && size === "xsmall" ? "xsmallUseCases" : size}
        onClick={onToggle}
        ariaLabel={`Navigate to ${item.text} page`}
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

  const renderLoginButton = (size) => {
    return (
      <MenuBarItem href="#" size={size} ariaLabel="Log in to your account">
        Log in
      </MenuBarItem>
    );
  };

  const renderCreateRuleButton = (buttonSize, containerSize, avatarSize) => {
    return (
      <Button
        size={buttonSize}
        ariaLabel="Create a new rule with avatar decoration"
      >
        {renderAvatarGroup(containerSize, avatarSize)}
        <span>Create rule</span>
      </Button>
    );
  };

  const renderLogo = (size, showText) => {
    return <Logo size={size} showText={showText} />;
  };

  return (
    <header
      className="bg-[var(--color-surface-default-primary)] w-full border-b border-[var(--border-color-default-tertiary)]"
      role="banner"
      aria-label="Main navigation header"
    >
      <nav
        className="flex items-center justify-between mx-auto max-w-[1920px] h-[40px] lg:h-[84px] xl:h-[88px] px-[var(--spacing-measures-spacing-016)] py-[var(--spacing-measures-spacing-008)] lg:px-[var(--spacing-measures-spacing-64,64px)] lg:py-[var(--spacing-measures-spacing-016,16px)]"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo - Consistent left positioning across all breakpoints */}
        <div className="flex items-center">
          {logoConfig.map((config, index) => (
            <div key={index} className={config.breakpoint}>
              {renderLogo(config.size, config.showText)}
            </div>
          ))}
        </div>

        {/* Navigation Links - Consistent center positioning */}
        <div className="flex items-center">
          <div className="block sm:hidden -me-[2px]">
            <MenuBar size="default">{renderNavigationItems("xsmall")}</MenuBar>
          </div>

          <div className="hidden sm:block md:hidden">
            <MenuBar size="default">{renderNavigationItems("xsmall")}</MenuBar>
          </div>

          <div className="hidden md:block lg:hidden">
            <MenuBar size="default">{renderNavigationItems("xsmall")}</MenuBar>
          </div>

          <div className="hidden lg:block xl:hidden">
            <MenuBar size="large">{renderNavigationItems("large")}</MenuBar>
          </div>

          <div className="hidden xl:block">
            <MenuBar size="large">{renderNavigationItems("xlarge")}</MenuBar>
          </div>
        </div>

        {/* Authentication Elements - Consistent right alignment across all breakpoints */}
        <div className="flex items-center">
          {/* XSmall and Small breakpoints */}
          <div className="block sm:hidden">
            <div className="flex items-center gap-[var(--spacing-scale-004)]">
              {renderLoginButton("xsmall")}
              {renderCreateRuleButton("xsmall", "small", "small")}
            </div>
          </div>

          <div className="hidden sm:block md:hidden">
            <div className="flex items-center gap-[var(--spacing-scale-004)]">
              {renderLoginButton("xsmall")}
              {renderCreateRuleButton("xsmall", "small", "small")}
            </div>
          </div>

          {/* Medium breakpoint */}
          <div className="hidden md:block lg:hidden">
            <div className="flex items-center gap-[var(--spacing-measures-spacing-010)]">
              {renderLoginButton("xsmall")}
              {renderCreateRuleButton("xsmall", "medium", "medium")}
            </div>
          </div>

          {/* Large breakpoint */}
          <div className="hidden lg:block xl:hidden">
            <div className="flex items-center gap-[var(--spacing-measures-spacing-004)]">
              {renderLoginButton("large")}
              {renderCreateRuleButton("large", "xlarge", "xlarge")}
            </div>
          </div>

          {/* XLarge breakpoint */}
          <div className="hidden xl:block">
            <div className="flex items-center gap-[var(--spacing-measures-spacing-004)]">
              {renderLoginButton("xlarge")}
              {renderCreateRuleButton("xlarge", "xlarge", "xlarge")}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
