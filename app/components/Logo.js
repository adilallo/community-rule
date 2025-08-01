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
    header: {
      containerHeight: "h-[20.85px]",
      gap: "gap-[2.11px]",
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
      containerHeight: "h-[36px]",
      gap: "gap-[7px]",
      textSize: "text-[20px]",
      lineHeight: "leading-[24px]",
      iconSize: "w-[24px] h-[24px]",
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
    size === "header"
      ? sizes.header
      : size === "headerLg"
      ? sizes.headerLg
      : size === "footer"
      ? sizes.footer
      : size === "footerLg"
      ? sizes.footerLg
      : sizes.default;

  return (
    <div
      className={`flex items-center ${config.containerHeight} ${
        showText ? config.gap : ""
      }`}
    >
      {/* Logo Text - only show if showText is true */}
      {showText && (
        <div
          className={`font-['Bricolage_Grotesque'] text-[var(--color-content-default-primary)] ${config.textSize} ${config.lineHeight} font-normal tracking-[0px]`}
        >
          CommunityRule
        </div>
      )}

      {/* Vector Icon */}
      <img
        src="/assets/Logo.svg"
        alt="CommunityRule Logo Icon"
        width={27.05}
        height={27.05}
        className={`flex-shrink-0 ${config.iconSize}`}
      />
    </div>
  );
}
