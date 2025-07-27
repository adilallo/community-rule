import Logo from "./Logo";
import Separator from "./Separator";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-default-primary)] w-full">
      <div
        className="flex flex-col items-start mx-auto max-w-[1920px]
          px-[var(--spacing-measures-spacing-016)]
          py-[var(--spacing-measures-spacing-040)]
          gap-[var(--spacing-measures-spacing-040)]
          md:px-[var(--spacing-measures-spacing-032)]
          md:py-[var(--spacing-measures-spacing-024)]
          md:gap-[var(--spacing-measures-spacing-024)]
          lg:px-[var(--spacing-measures-spacing-120,120px)]
          lg:py-[var(--spacing-measures-spacing-096,96px)]
          lg:gap-[var(--spacing-measures-spacing-060,60px)]"
      >
        {/* Logo*/}
        <div className="block md:hidden">
          <Logo />
        </div>
        <div className="hidden md:block lg:hidden">
          <Logo size="footer" />
        </div>
        <div className="hidden lg:block">
          <Logo size="footerLg" />
        </div>

        {/* Content section */}
        <div className="flex flex-col items-start w-full gap-[var(--spacing-measures-spacing-048,48px)] md:flex-row md:justify-between md:gap-0">
          {/* Social media links */}
          <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)] order-2 md:order-1">
            <div className="flex items-center gap-[var(--spacing-measures-spacing-06,6px)]">
              <img
                src="/assets/Bluesky_Logo.svg"
                alt="Bluesky"
                width={24}
                height={22}
                className="flex-shrink-0"
              />
              <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                medlabboulder
              </div>
            </div>
            <div className="flex items-center gap-[var(--spacing-measures-spacing-06,6px)]">
              <img
                src="/assets/GitLab_Icon.png"
                alt="GitLab"
                width={22}
                height={22}
                className="flex-shrink-0 grayscale"
              />
              <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                medlabboulder
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-032,32px)] order-1 md:order-2 md:items-end">
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
              Use cases
            </div>
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
              Learn
            </div>
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
              About
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom section */}
        <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-032,32px)] md:flex-row md:justify-between md:items-center w-full">
          <div className="text-[var(--color-content-default-secondary)] font-['Inter'] text-sm leading-5 font-medium md:text-xs md:leading-4 lg:text-sm lg:leading-5 lg:font-normal">
            © All right reserved
          </div>
          <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-040,40px)] md:flex-row md:gap-[var(--spacing-measures-spacing-040,40px)]">
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-sm leading-5 font-medium underline md:text-xs md:leading-4 md:no-underline lg:text-sm lg:leading-5 lg:font-normal">
              Privacy Policy
            </div>
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-sm leading-5 font-medium underline md:text-xs md:leading-4 md:no-underline lg:text-sm lg:leading-5 lg:font-normal">
              Terms of Service
            </div>
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-sm leading-5 font-medium underline md:text-xs md:leading-4 md:no-underline lg:text-sm lg:leading-5 lg:font-normal">
              Cookies Settings
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
