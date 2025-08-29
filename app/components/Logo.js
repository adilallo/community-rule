export default function Logo({ size = "default", showText = true }) {
  // Size configurations
  const sizes = {
    default: {
      containerHeight: "h-[41px]",
      gap: "gap-[8.28px]",
      textSize: "text-[21.97px]",
      lineHeight: "leading-[27.05px]",
      iconSize: "w-[27.05px] h-[27.05px]",
    },
    homeHeaderXsmall: {
      containerHeight: "h-[14.11px]",
      gap: "gap-[4.21px]",
      textSize: "text-[11.57px]",
      lineHeight: "leading-[14.24px]",
      iconSize: "w-[14.11px] h-[14.11px]",
    },
    homeHeaderSm: {
      containerHeight: "h-[21.06px]",
      gap: "gap-[3.19px]",
      textSize: "text-[11.69px]",
      lineHeight: "leading-[14.39px]",
      iconSize: "w-[14.39px] h-[14.39px]",
    },
    homeHeaderMd: {
      containerHeight: "h-[32.24px]",
      gap: "gap-[4.89px]",
      textSize: "text-[17.89px]",
      lineHeight: "leading-[22.02px]",
      iconSize: "w-[22.02px] h-[22.02px]",
    },
    homeHeaderLg: {
      containerHeight: "h-[28px]",
      gap: "gap-[6.55px]",
      textSize: "text-[21.97px]",
      lineHeight: "leading-[27.05px]",
      iconSize: "w-[27.05px] h-[27.05px]",
    },
    homeHeaderXl: {
      containerHeight: "h-[36px]",
      gap: "gap-[8.64px]",
      textSize: "text-[29.01px]",
      lineHeight: "leading-[35.7px]",
      iconSize: "w-[35.7px] h-[35.7px]",
    },
    header: {
      containerHeight: "h-[20.85px]",
      gap: "gap-[4.21px]",
      textSize: "text-[11.57px]",
      lineHeight: "leading-[14.24px]",
      iconSize: "w-[14.24px] h-[14.24px]",
    },
    headerMd: {
      containerHeight: "h-[17.91px]",
      gap: "gap-[6.51px]",
      textSize: "text-[17.89px]",
      lineHeight: "leading-[22.02px]",
      iconSize: "w-[22.02px] h-[22.02px]",
    },
    headerLg: {
      containerHeight: "h-[28px]",
      gap: "gap-[6.55px]",
      textSize: "text-[21.97px]",
      lineHeight: "leading-[27.05px]",
      iconSize: "w-[27.05px] h-[27.05px]",
    },
    headerXl: {
      containerHeight: "h-[34px]",
      gap: "gap-[8.19px]",
      textSize: "text-[27.47px]",
      lineHeight: "leading-[33.81px]",
      iconSize: "w-[33.81px] h-[33.81px]",
    },
    footer: {
      containerHeight: "h-[calc(40px*1.37)]",
      gap: "gap-[calc(8px*1.37)]",
      textSize: "text-[calc(21.97px*1.37)]",
      lineHeight: "leading-[calc(27.05px*1.37)]",
      iconSize: "w-[calc(27.05px*1.37)] h-[calc(27.05px*1.37)]",
    },
    footerLg: {
      containerHeight: "h-[calc(40px*2.05)]",
      gap: "gap-[calc(8px*2.05)]",
      textSize: "text-[calc(21.97px*2.05)]",
      lineHeight: "leading-[calc(27.05px*2.05)]",
      iconSize: "w-[calc(27.05px*2.05)] h-[calc(27.05px*2.05)]",
    },
  };

  const config =
    size === "homeHeaderXsmall"
      ? sizes.homeHeaderXsmall
      : size === "homeHeaderSm"
      ? sizes.homeHeaderSm
      : size === "homeHeaderMd"
      ? sizes.homeHeaderMd
      : size === "homeHeaderLg"
      ? sizes.homeHeaderLg
      : size === "homeHeaderXl"
      ? sizes.homeHeaderXl
      : size === "header"
      ? sizes.header
      : size === "headerMd"
      ? sizes.headerMd
      : size === "headerLg"
      ? sizes.headerLg
      : size === "headerXl"
      ? sizes.headerXl
      : size === "footer"
      ? sizes.footer
      : size === "footerLg"
      ? sizes.footerLg
      : sizes.default;

  return (
    <div
      className={`flex items-center ${config.containerHeight} ${
        showText ? config.gap : ""
      } transition-all duration-200 ease-in-out hover:scale-[1.02] cursor-pointer`}
      role="link"
      aria-label="CommunityRule Logo"
    >
      {/* Logo Text - only show if showText is true */}
      {showText && (
        <div
          className={`font-bricolage-grotesque ${
            size === "homeHeaderXsmall" ||
            size === "homeHeaderSm" ||
            size === "homeHeaderMd" ||
            size === "homeHeaderLg" ||
            size === "homeHeaderXl"
              ? "text-[var(--color-content-inverse-primary)]"
              : "text-[var(--color-content-default-primary)]"
          } ${config.textSize} ${
            config.lineHeight
          } font-normal tracking-[0px] transition-colors duration-200`}
          aria-label="CommunityRule"
        >
          CommunityRule
        </div>
      )}

      {/* Vector Icon */}
      <img
        src="assets/Logo.svg"
        alt="CommunityRule Logo Icon"
        width={27.05}
        height={27.05}
        className={`flex-shrink-0 ${
          config.iconSize
        } transition-all duration-200 ${
          size === "homeHeaderXsmall" ||
          size === "homeHeaderSm" ||
          size === "homeHeaderMd" ||
          size === "homeHeaderLg" ||
          size === "homeHeaderXl"
            ? "filter brightness-0"
            : ""
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
