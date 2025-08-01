import Logo from "./Logo";
import NavigationItem from "./NavigationItem";
import Button from "./Button";
import AvatarContainer from "./AvatarContainer";
import Avatar from "./Avatar";

export default function Header() {
  return (
    <header className="bg-[var(--color-surface-default-primary)] w-full border-b border-[var(--border-color-default-tertiary)]">
      <div
        className="flex items-center justify-between mx-auto max-w-[1920px]
          h-[40px]
          px-[var(--spacing-measures-spacing-016)]
          py-[var(--spacing-measures-spacing-008)]
          sm:px-[var(--spacing-measures-spacing-032)]
          sm:py-[var(--spacing-measures-spacing-012)]
          lg:px-[var(--spacing-measures-spacing-120,120px)]
          lg:py-[var(--spacing-measures-spacing-016,16px)]"
      >
        {/* Logo */}
        <div>
          <div className="block sm:hidden">
            <Logo size="header" showText={false} />
          </div>
          <div className="hidden sm:block lg:hidden">
            <Logo size="header" showText={false} />
          </div>
          <div className="hidden lg:block">
            <Logo size="headerLg" showText={false} />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center">
          <nav className="flex items-center space-x-[var(--spacing-scale-002)]">
            <NavigationItem href="#" size="xsmall">
              Use cases
            </NavigationItem>
            <NavigationItem href="#" size="xsmall">
              Learn
            </NavigationItem>
            <NavigationItem href="#" size="xsmall">
              About
            </NavigationItem>
            <NavigationItem href="#" size="xsmall">
              Log in
            </NavigationItem>
          </nav>

          <Button size="xsmall" className="ml-[var(--spacing-scale-006)]">
            {/* Avatar Container */}
            <AvatarContainer size="small">
              <Avatar src="/assets/Avatar_1.png" alt="Avatar 1" size="small" />
              <Avatar src="/assets/Avatar_2.png" alt="Avatar 2" size="small" />
              <Avatar src="/assets/Avatar_3.png" alt="Avatar 3" size="small" />
            </AvatarContainer>
            <span>Create rule</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
