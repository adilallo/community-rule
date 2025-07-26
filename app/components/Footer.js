import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface-default-primary)] w-full">
      <div className="flex flex-col items-start mx-auto max-w-[1920px] px-[var(--spacing-measures-spacing-120,120px)] py-[var(--spacing-measures-spacing-096,96px)] gap-[var(--spacing-measures-spacing-060,60px)]">
        {/* Logo at the top - scaled larger for footer */}
        <div
          className="mb-[var(--spacing-measures-spacing-060,60px)]"
          style={{
            transform: "scale(2.05)",
            transformOrigin: "left top",
          }}
        >
          <Logo />
        </div>

        {/* Content section - horizontal layout */}
        <div className="flex justify-between items-start w-full">
          {/* Left side - Contact info and social media */}
          <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-064,64px)]">
            {/* Contact info */}
            <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)]">
              <div className="text-[var(--color-content-default-secondary)] font-['Inter'] text-[--spacing-measures-spacing-024] leading-[--spacing-measures-spacing-028] font-normal tracking-[0%]">
                Media Economies Design Lab
              </div>
              <div className="text-[var(--color-content-default-secondary)] font-['Inter'] text-[--spacing-measures-spacing-024] leading-[--spacing-measures-spacing-028] font-normal tracking-[0%]">
                medlab@colorado.edu
              </div>
            </div>

            {/* Social media links */}
            <div className="flex flex-col items-start gap-[var(--spacing-measures-spacing-016,16px)]">
              <div className="flex items-center gap-[var(--spacing-measures-spacing-06,6px)]">
                <svg
                  width={24}
                  height={22}
                  viewBox="0 0 24 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_18411_59624)">
                    <path
                      d="M5.42884 2.24436C8.08868 4.22236 10.9496 8.23292 12 10.3852C13.0505 8.23308 15.9113 4.22232 18.5712 2.24436C20.4904 0.817109 23.6 -0.287214 23.6 3.2268C23.6 3.9286 23.1938 9.12225 22.9556 9.96542C22.1275 12.8969 19.1098 13.6445 16.4256 13.192C21.1176 13.983 22.3112 16.6032 19.7335 19.2234C14.8379 24.1996 12.6971 17.9748 12.1483 16.3798C12.0477 16.0874 12.0007 15.9506 12 16.0669C11.9993 15.9506 11.9522 16.0874 11.8517 16.3798C11.3031 17.9748 9.16234 24.1997 4.26646 19.2234C1.6887 16.6032 2.88226 13.9829 7.57434 13.192C4.89002 13.6445 1.87234 12.8969 1.04434 9.96542C0.806094 9.12217 0.399902 3.92852 0.399902 3.2268C0.399902 -0.287214 3.50958 0.817109 5.4287 2.24436H5.42884Z"
                      fill="#949494"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_18411_59624">
                      <rect
                        width={24}
                        height={21}
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-[--spacing-measures-spacing-024] leading-[--spacing-measures-spacing-028] font-normal tracking-[0%]">
                  medlabboulder
                </div>
              </div>
              <div className="flex items-center gap-[var(--spacing-measures-spacing-06,6px)]">
                <img
                  src="/assets/GitLab_Icon.png"
                  alt="GitLab"
                  width={22}
                  height={22}
                  className="flex-shrink-0"
                  style={{ filter: "grayscale(100%)" }}
                />
                <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-[--spacing-measures-spacing-024] leading-[--spacing-measures-spacing-028] font-normal tracking-[0%]">
                  medlabboulder
                </div>
              </div>
            </div>
          </div>

          {/* Right side navigation */}
          <div className="flex flex-col justify-start items-end gap-[var(--spacing-measures-spacing-032,32px)]">
            <div className="text-[var(--color-content-default-primary)] text-right font-['Inter'] text-[--spacing-measures-spacing-024] leading-[--spacing-measures-spacing-028] font-normal tracking-[0%]">
              Use cases
            </div>
            <div className="text-[var(--color-content-default-primary)] text-right font-['Inter'] text-[--spacing-measures-spacing-024] leading-[--spacing-measures-spacing-028] font-normal tracking-[0%]">
              Learn
            </div>
            <div className="text-[var(--color-content-default-primary)] text-right font-['Inter'] text-[--spacing-measures-spacing-024] leading-[--spacing-measures-spacing-028] font-normal tracking-[0%]">
              About
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex flex-col items-center self-stretch">
          <div
            className="flex items-start self-stretch h-px"
            style={{
              backgroundColor:
                "var(--color-border-color-default-primary, #1f1f1f)",
            }}
          />
        </div>

        {/* Bottom section */}
        <div className="flex justify-between items-start self-stretch">
          <div className="text-[var(--color-content-default-secondary)] font-['Inter'] text-sm leading-5">
            © All right reserved
          </div>
          <div className="flex items-start gap-[var(--spacing-measures-spacing-040,40px)]">
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-sm leading-5">
              Privacy Policy
            </div>
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-sm leading-5">
              Terms of Service
            </div>
            <div className="text-[var(--color-content-default-primary)] font-['Inter'] text-sm leading-5">
              Cookies Settings
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
