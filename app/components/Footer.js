import Logo from "./Logo";
import Separator from "./Separator";

export default function Footer() {
  // Schema markup for organization information
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Media Economies Design Lab",
    email: "medlab@colorado.edu",
    url: "https://communityrule.com",
    sameAs: [
      "https://bsky.app/profile/medlabboulder",
      "https://gitlab.com/medlabboulder",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <footer className="bg-[var(--color-surface-default-primary)] w-full">
        <div
          className="flex flex-col items-start mx-auto max-w-[1920px]
          px-[var(--spacing-measures-spacing-016)]
          py-[var(--spacing-measures-spacing-040)]
          gap-[var(--spacing-measures-spacing-040)]
          sm:px-[var(--spacing-measures-spacing-032)]
          sm:py-[var(--spacing-measures-spacing-024)]
          sm:gap-[var(--spacing-measures-spacing-024)]
          lg:px-[var(--spacing-measures-spacing-120,120px)]
          lg:py-[var(--spacing-measures-spacing-096,96px)]
          lg:gap-[var(--spacing-measures-spacing-060,60px)]"
        >
          {/* Logo*/}
          <div className="block sm:hidden">
            <Logo />
          </div>
          <div className="hidden sm:block lg:hidden">
            <Logo size="footer" />
          </div>
          <div className="hidden lg:block">
            <Logo size="footerLg" />
          </div>

          {/* Content section */}
          <div className="flex flex-col items-start w-full gap-[var(--spacing-measures-spacing-048,48px)] sm:flex-row sm:justify-between sm:gap-0">
            {/* Branding Section */}
            <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-064,64px)] order-2 sm:order-1">
              {/* Contact info */}
              <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)]">
                <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                  Media Economies Design Lab
                </div>
                <a
                  href="mailto:medlab@colorado.edu"
                  className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
                >
                  medlab@colorado.edu
                </a>
              </div>

              {/* Social media links */}
              <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)]">
                <a
                  href="#"
                  className="flex items-center gap-[var(--spacing-measures-spacing-06,6px)] hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer group"
                  aria-label="Follow us on Bluesky"
                >
                  <img
                    src="/assets/Bluesky_Logo.svg"
                    alt="Bluesky"
                    width={24}
                    height={22}
                    className="flex-shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                    medlabboulder
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-[var(--spacing-measures-spacing-06,6px)] hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer group"
                  aria-label="Follow us on GitLab"
                >
                  <img
                    src="/assets/GitLab_Icon.png"
                    alt="GitLab"
                    width={22}
                    height={22}
                    className="flex-shrink-0 grayscale group-hover:scale-110 transition-transform"
                  />
                  <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal">
                    medlabboulder
                  </div>
                </a>
              </div>
            </div>

            {/* Navigation Section */}
            <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-032,32px)] order-1 sm:order-2 sm:items-end">
              <a
                href="#"
                className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
              >
                Use cases
              </a>
              <a
                href="#"
                className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
              >
                Learn
              </a>
              <a
                href="#"
                className="text-[var(--color-content-default-primary)] font-['Inter'] text-base leading-5 font-medium tracking-[0%] lg:text-2xl lg:leading-7 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
              >
                About
              </a>
            </div>
          </div>

          <Separator />

          {/* Bottom section */}
          <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-032,32px)] sm:flex-row sm:justify-between sm:items-center w-full">
            <div className="text-[var(--color-content-default-secondary)] font-['Inter'] text-sm leading-5 font-medium sm:text-xs sm:leading-4 lg:text-sm lg:leading-5 lg:font-normal">
              © All right reserved
            </div>
            <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-040,40px)] sm:flex-row sm:gap-[var(--spacing-measures-spacing-040,40px)]">
              <a
                href="#"
                className="text-[var(--color-content-default-secondary)] font-['Inter'] text-sm leading-5 font-medium underline sm:text-xs sm:leading-4 sm:no-underline lg:text-sm lg:leading-5 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-secondary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[var(--color-content-default-secondary)] font-['Inter'] text-sm leading-5 font-medium underline sm:text-xs sm:leading-4 sm:no-underline lg:text-sm lg:leading-5 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-secondary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-[var(--color-content-default-secondary)] font-['Inter'] text-sm leading-5 font-medium underline sm:text-xs sm:leading-4 sm:no-underline lg:text-sm lg:leading-5 lg:font-normal hover:opacity-80 active:opacity-60 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--color-content-default-secondary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface-default-primary)] transition-opacity p-2 -m-2 cursor-pointer"
              >
                Cookies Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
