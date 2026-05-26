"use client";

/**
 * Figma: "Sections / LogoWall" (see registry)
 */

import { memo, useState, useEffect, useMemo } from "react";
import { useTranslation } from "../../../contexts/MessagesContext";
import { getAssetPath, partnerLogoPath } from "../../../../lib/assetUtils";
import LogoWallView from "./LogoWall.view";
import type { LogoWallProps } from "./LogoWall.types";

const LogoWallContainer = memo<LogoWallProps>(({ logos, className = "" }) => {
  const t = useTranslation("logoWall");
  const [isVisible, setIsVisible] = useState(false);

  const defaultLogos = useMemo(
    () => [
      {
        src: getAssetPath(partnerLogoPath("food-not-bombs")),
        alt: t("partners.foodNotBombs"),
        size: "h-11 lg:h-14 xl:h-[70px]",
      },
      {
        src: getAssetPath(partnerLogoPath("start-coop")),
        alt: t("partners.startCoop"),
        size: "h-[42px] lg:h-[53px] xl:h-[66px]",
      },
      {
        src: getAssetPath(partnerLogoPath("metagov")),
        alt: t("partners.metagov"),
        size: "h-6 lg:h-8 xl:h-[41px]",
      },
      {
        src: getAssetPath(partnerLogoPath("open-civics")),
        alt: t("partners.openCivics"),
        size: "h-8 lg:h-10 xl:h-[50px]",
      },
      {
        src: getAssetPath(partnerLogoPath("mutual-aid-co")),
        alt: t("partners.mutualAidCo"),
        size: "h-11 lg:h-14 xl:h-[70px]",
      },
      {
        src: getAssetPath(partnerLogoPath("cu-boulder")),
        alt: t("partners.cuBoulder"),
        size: "h-10 lg:h-12 xl:h-[60px]",
      },
    ],
    [t],
  );

  const displayLogos = useMemo(
    () => (logos && logos.length > 0 ? logos : defaultLogos),
    [logos, defaultLogos],
  );

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LogoWallView
      isVisible={isVisible}
      displayLogos={displayLogos}
      className={className}
    />
  );
});

LogoWallContainer.displayName = "LogoWall";

export default LogoWallContainer;
