import Logo from "./Logo";
import Separator from "./Separator";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-default-primary)] w-full">
      <div
        className="flex flex-col items-start mx-auto max-w-[1920px]
          px-[var(--spacing-measures-spacing-032)]
          py-[var(--spacing-measures-spacing-024)]
          gap-[var(--spacing-measures-spacing-024)]
          lg:px-[var(--spacing-measures-spacing-120,120px)]
          lg:py-[var(--spacing-measures-spacing-096,96px)]
          lg:gap-[var(--spacing-measures-spacing-060,60px)]"
      >
        {/* Logo*/}
        <div className="block lg:hidden">
          <Logo size="footer" />
        </div>
        <div className="hidden lg:block">
          <Logo size="footerLg" />
        </div>

        {/* Content section - horizontal layout */}
        <div className="flex justify-between items-start w-full">
          {/* Left side - Contact info and social media */}
          <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-064,64px)]">
            {/* Contact info */}
            <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)]">
              <div className="text-[var(--color-content-default-secondary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                Media Economies Design Lab
              </div>
              <div className="text-[var(--color-content-default-secondary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                medlab@colorado.edu
              </div>
            </div>

            {/* Social media links */}
            <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)]">
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
          </div>

          {/* Right side navigation */}
          <div className="flex flex-col justify-start items-end gap-[var(--spacing-measures-spacing-032,32px)]">
            <div className="text-[var(--color-content-default-primary)] text-right font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
              Use cases
            </div>
            <div className="text-[var(--color-content-default-primary)] text-right font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
              Learn
            </div>
            <div className="text-[var(--color-content-default-primary)] text-right font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
              About
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom section */}
        <div className="flex justify-between items-start self-stretch">
          <div className="text-[var(--color-content-default-secondary)] font-['Inter'] text-xs leading-4 font-medium lg:text-sm lg:leading-5 lg:font-normal">
            © All right reserved
          </div>
          <div className="flex items-start gap-[var(--spacing-measures-spacing-040,40px)]">
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-xs leading-4 font-medium lg:text-sm lg:leading-5 lg:font-normal">
              Privacy Policy
            </div>
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-xs leading-4 font-medium lg:text-sm lg:leading-5 lg:font-normal">
              Terms of Service
            </div>
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-xs leading-4 font-medium lg:text-sm lg:leading-5 lg:font-normal">
              Cookies Settings
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
