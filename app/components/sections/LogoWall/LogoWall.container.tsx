"use client";

import { memo, useState, useEffect, useMemo } from "react";
import { getAssetPath, partnerLogoPath } from "../../../../lib/assetUtils";
import LogoWallView from "./LogoWall.view";
import type { LogoWallProps } from "./LogoWall.types";

const defaultLogos = [
  {
    src: getAssetPath(partnerLogoPath("food-not-bombs")),
    alt: "Food Not Bombs",
    size: "h-11 lg:h-14 xl:h-[70px]",
    order: "order-1 sm:order-4", // Mobile: row 1 col 1, SM: row 2 col 1 (bottom left)
  },
  {
    src: getAssetPath(partnerLogoPath("start-coop")),
    alt: "Start COOP",
    size: "h-[42px] lg:h-[53px] xl:h-[66px]",
    order: "order-2 sm:order-2", // Mobile: row 1 col 2, SM: row 1 col 2 (top middle)
  },
  {
    src: getAssetPath(partnerLogoPath("metagov")),
    alt: "Metagov",
    size: "h-6 lg:h-8 xl:h-[41px]",
    order: "order-3 sm:order-1", // Mobile: row 2 col 1, SM: row 1 col 1 (top left)
  },
  {
    src: getAssetPath(partnerLogoPath("open-civics")),
    alt: "Open Civics",
    size: "h-8 lg:h-10 xl:h-[50px]",
    order: "order-4 sm:order-5 md:order-6", // Mobile: row 2 col 2, SM: row 2 col 2, MD: swapped with Mutual Aid CO
  },
  {
    src: getAssetPath(partnerLogoPath("mutual-aid-co")),
    alt: "Mutual Aid CO",
    size: "h-11 lg:h-14 xl:h-[70px]",
    order: "order-5 sm:order-6 md:order-5", // Mobile: row 3 col 1, SM: row 2 col 3, MD: swapped with OpenCivics
  },
  {
    src: getAssetPath(partnerLogoPath("cu-boulder")),
    alt: "CU Boulder",
    size: "h-10 lg:h-12 xl:h-[60px]",
    order: "order-6 sm:order-3", // Mobile: row 3 col 2, SM: row 1 col 3 (top right)
  },
];

const LogoWallContainer = memo<LogoWallProps>(({ logos, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const displayLogos = useMemo(
    () => (logos && logos.length > 0 ? logos : defaultLogos),
    [logos],
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
