export default function Logo({ size = "default" }) {
  // Size configurations
  const sizes = {
    default: {
      containerHeight: "h-10",
      gap: "gap-2",
      textSize: "text-[21.97px]",
      lineHeight: "leading-[27.05px]",
      iconSize: "w-[27.05px] h-[27.05px]",
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
    size === "footer"
      ? sizes.footer
      : size === "footerLg"
      ? sizes.footerLg
      : sizes.default;

  return (
    <div
      className={`flex items-center ${config.containerHeight} ${config.gap}`}
    >
      {/* Logo Text */}
      <div
        className={`font-['Bricolage_Grotesque'] text-[var(--color-content-default-primary)] ${config.textSize} ${config.lineHeight} font-normal tracking-[0px]`}
      >
        CommunityRule
      </div>

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
