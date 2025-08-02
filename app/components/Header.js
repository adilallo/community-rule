import Logo from "./Logo";
import MenuBar from "./MenuBar";
import MenuBarItem from "./MenuBarItem";
import Button from "./Button";
import AvatarContainer from "./AvatarContainer";
import Avatar from "./Avatar";

export default function Header() {
  return (
    <header className="bg-[var(--color-surface-default-primary)] w-full border-b border-[var(--border-color-default-tertiary)]">
      <div className="flex items-center justify-between mx-auto max-w-[1920px] h-[40px] lg:h-[84px] px-[var(--spacing-measures-spacing-016)] py-[var(--spacing-measures-spacing-008)] lg:px-[var(--spacing-measures-spacing-64,64px)] lg:py-[var(--spacing-measures-spacing-016,16px)]">
        <div>
          <div className="block sm:hidden">
            <Logo size="header" showText={false} />
          </div>
          <div className="hidden sm:block md:hidden">
            <Logo size="header" showText={true} />
          </div>
          <div className="hidden md:block lg:hidden">
            <Logo size="headerMd" showText={true} />
          </div>
          <div className="hidden lg:block">
            <Logo size="headerLg" showText={true} />
          </div>
        </div>

        <div className="flex items-center">
          <div className="block md:hidden">
            <MenuBar className="gap-[var(--spacing-scale-001)]">
              <MenuBarItem
                href="#"
                size="xsmall"
                className="px-[var(--spacing-scale-002)] py-[var(--spacing-scale-002)]"
              >
                Use cases
              </MenuBarItem>
              <MenuBarItem href="#" size="xsmall">
                Learn
              </MenuBarItem>
              <MenuBarItem href="#" size="xsmall">
                About
              </MenuBarItem>
              <MenuBarItem href="#" size="xsmall">
                Log in
              </MenuBarItem>
            </MenuBar>
          </div>

          <div className="hidden md:block lg:hidden absolute left-1/2 transform -translate-x-1/2 ml-[var(--spacing-scale-024)]">
            <MenuBar className="gap-[var(--spacing-scale-001)]">
              <MenuBarItem
                href="#"
                size="xsmall"
                className="px-[var(--spacing-scale-002)] py-[var(--spacing-scale-002)]"
              >
                Use cases
              </MenuBarItem>
              <MenuBarItem href="#" size="xsmall">
                Learn
              </MenuBarItem>
              <MenuBarItem href="#" size="xsmall">
                About
              </MenuBarItem>
            </MenuBar>
          </div>

          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 -ml-[var(--spacing-scale-024)]">
            <MenuBar size="large">
              <MenuBarItem
                href="#"
                size="large"
                className="px-[var(--spacing-scale-002)] py-[var(--spacing-scale-002)]"
              >
                Use cases
              </MenuBarItem>
              <MenuBarItem href="#" size="large">
                Learn
              </MenuBarItem>
              <MenuBarItem href="#" size="large">
                About
              </MenuBarItem>
            </MenuBar>
          </div>

          <div className="hidden md:block lg:hidden">
            <MenuBarItem
              href="#"
              size="xsmall"
              className="mr-[var(--spacing-scale-010)]"
            >
              Log in
            </MenuBarItem>
            <Button size="xsmall">
              <AvatarContainer size="medium">
                <Avatar
                  src="/assets/Avatar_1.png"
                  alt="Avatar 1"
                  size="medium"
                />
                <Avatar
                  src="/assets/Avatar_2.png"
                  alt="Avatar 2"
                  size="medium"
                />
                <Avatar
                  src="/assets/Avatar_3.png"
                  alt="Avatar 3"
                  size="medium"
                />
              </AvatarContainer>
              <span>Create rule</span>
            </Button>
          </div>

          <div className="hidden lg:flex items-center">
            <MenuBarItem
              href="#"
              size="large"
              className="mr-[var(--spacing-scale-012)]"
            >
              Log in
            </MenuBarItem>
            <Button size="large">
              <AvatarContainer size="xlarge">
                <Avatar
                  src="/assets/Avatar_1.png"
                  alt="Avatar 1"
                  size="xlarge"
                />
                <Avatar
                  src="/assets/Avatar_2.png"
                  alt="Avatar 2"
                  size="xlarge"
                />
                <Avatar
                  src="/assets/Avatar_3.png"
                  alt="Avatar 3"
                  size="xlarge"
                />
              </AvatarContainer>
              <span>Create rule</span>
            </Button>
          </div>

          <div className="block md:hidden">
            <Button size="xsmall" className="ml-[var(--spacing-scale-006)]">
              <AvatarContainer size="small">
                <Avatar
                  src="/assets/Avatar_1.png"
                  alt="Avatar 1"
                  size="small"
                />
                <Avatar
                  src="/assets/Avatar_2.png"
                  alt="Avatar 2"
                  size="small"
                />
                <Avatar
                  src="/assets/Avatar_3.png"
                  alt="Avatar 3"
                  size="small"
                />
              </AvatarContainer>
              <span>Create rule</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
