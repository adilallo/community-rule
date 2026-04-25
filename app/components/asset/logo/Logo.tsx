import { memo } from "react";
import Link from "next/link";
import { getAssetPath, ASSETS } from "../../../../lib/assetUtils";

interface LogoProps {
  size?:
    | "default"
    | "footer"
    | "createFlow"
    | "topNavFolderTop"
    | "topNavHeader";
  /**
   * Visual style: default (dark on light) or inverse (e.g. black/white on teal).
   * @default "default"
   */
  palette?: "default" | "inverse";
  /**
   * Whether to show the "CommunityRule" wordmark.
   * @default true
   */
  wordmark?: boolean;
}

interface SizeConfig {
  containerHeight: string;
  gap: string;
  textSize: string;
  lineHeight: string;
  iconSize: string;
}

const Logo = memo<LogoProps>(
  ({ size = "default", palette = "default", wordmark = true }) => {
    // Size configurations
    const sizes: Record<string, SizeConfig> = {
      default: {
        containerHeight: "h-[41px]",
        gap: "gap-[8.28px]",
        textSize: "text-[21.97px]",
        lineHeight: "leading-[27.05px]",
        iconSize: "w-[27.05px] h-[27.05px]",
      },
      footer: {
        containerHeight:
          "h-[41px] md:h-[calc(40px*1.37)] lg:h-[calc(40px*2.05)]",
        gap: "gap-[8.28px] md:gap-[calc(8px*1.37)] lg:gap-[calc(8px*2.05)]",
        textSize:
          "text-[21.97px] md:text-[calc(21.97px*1.37)] lg:text-[calc(21.97px*2.05)]",
        lineHeight:
          "leading-[27.05px] md:leading-[calc(27.05px*1.37)] lg:leading-[calc(27.05px*2.05)]",
        iconSize:
          "w-[27.05px] h-[27.05px] md:w-[calc(27.05px*1.37)] md:h-[calc(27.05px*1.37)] lg:w-[calc(27.05px*2.05)] lg:h-[calc(27.05px*2.05)]",
      },
      createFlow: {
        containerHeight: "h-[30px] md:h-[41px]",
        gap: "gap-[6px] md:gap-[8.28px]",
        textSize: "text-[16.48px] md:text-[21.97px]",
        lineHeight: "leading-[20.28px] md:leading-[27.05px]",
        iconSize: "w-[20.28px] h-[20.28px] md:w-[27.05px] md:h-[27.05px]",
      },
      topNavFolderTop: {
        containerHeight:
          "h-[14.11px] sm:h-[21.06px] md:h-[32.24px] lg:h-[28px] xl:h-[36px]",
        gap: "gap-0 sm:gap-[3.19px] md:gap-[4.89px] lg:gap-[6.55px] xl:gap-[8.64px]",
        textSize:
          "text-[11.57px] sm:text-[11.69px] md:text-[17.89px] lg:text-[21.97px] xl:text-[29.01px]",
        lineHeight:
          "leading-[14.24px] sm:leading-[14.39px] md:leading-[22.02px] lg:leading-[27.05px] xl:leading-[35.7px]",
        iconSize:
          "w-[14.11px] h-[14.11px] sm:w-[14.39px] sm:h-[14.39px] md:w-[22.02px] md:h-[22.02px] lg:w-[27.05px] lg:h-[27.05px] xl:w-[35.7px] xl:h-[35.7px]",
      },
      topNavHeader: {
        containerHeight:
          "h-[20.85px] sm:h-[20.85px] md:h-[17.91px] lg:h-[28px] xl:h-[34px]",
        gap: "gap-0 sm:gap-[4.21px] md:gap-[6.51px] lg:gap-[6.55px] xl:gap-[8.19px]",
        textSize:
          "text-[11.57px] sm:text-[11.57px] md:text-[17.89px] lg:text-[21.97px] xl:text-[27.47px]",
        lineHeight:
          "leading-[14.24px] sm:leading-[14.24px] md:leading-[22.02px] lg:leading-[27.05px] xl:leading-[33.81px]",
        iconSize:
          "w-[14.24px] h-[14.24px] sm:w-[14.24px] sm:h-[14.24px] md:w-[22.02px] md:h-[22.02px] lg:w-[27.05px] lg:h-[27.05px] xl:w-[33.81px] xl:h-[33.81px]",
      },
    };

    const config = sizes[size || "default"] || sizes.default;
    const isInverse = palette === "inverse";
    const textColorClass = isInverse
      ? "text-[var(--color-content-invert-primary)]"
      : "text-[var(--color-content-default-primary)]";
    const wordmarkVisibilityClass =
      size === "topNavFolderTop" || size === "topNavHeader"
        ? wordmark
          ? "hidden sm:block"
          : "hidden"
        : wordmark
          ? ""
          : "hidden";

    return (
      <Link href="/" className="block" aria-label="CommunityRule Logo">
        <div
          className={`flex items-center ${config.containerHeight} ${
            wordmark ? config.gap : ""
          } transition-all duration-200 ease-in-out hover:scale-[1.02] cursor-pointer`}
        >
          {/* Logo Text - responsive visibility for topNav sizes */}
          <div
            className={`font-bricolage-grotesque ${textColorClass} ${config.textSize} ${config.lineHeight} font-normal tracking-[0px] transition-colors duration-200 ${wordmarkVisibilityClass}`}
            aria-label="CommunityRule"
          >
            CommunityRule
          </div>

          {/* Vector Icon */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getAssetPath(ASSETS.LOGO)}
            alt="CommunityRule Logo Icon"
            width={27.05}
            height={27.05}
            className={`flex-shrink-0 ${config.iconSize} transition-all duration-200 ${
              isInverse ? "brightness-0" : ""
            }`}
            aria-hidden="true"
          />
        </div>
      </Link>
    );
  },
);

Logo.displayName = "Logo";

export default Logo;
