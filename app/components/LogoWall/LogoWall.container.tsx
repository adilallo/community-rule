"use client";

import { memo, useState, useEffect, useMemo } from "react";
import LogoWallView from "./LogoWall.view";
import type { LogoWallProps } from "./LogoWall.types";

const defaultLogos = [
  {
    src: "/assets/Section/Logo_FoodNotBombs.png",
    alt: "Food Not Bombs",
    size: "h-11 lg:h-14 xl:h-[70px]",
    order: "order-1 sm:order-4", // Mobile: row 1 col 1, SM: row 2 col 1 (bottom left)
  },
  {
    src: "/assets/Section/Logo_StartCOOP.png",
    alt: "Start COOP",
    size: "h-[42px] lg:h-[53px] xl:h-[66px]",
    order: "order-2 sm:order-2", // Mobile: row 1 col 2, SM: row 1 col 2 (top middle)
  },
  {
    src: "/assets/Section/Logo_Metagov.png",
    alt: "Metagov",
    size: "h-6 lg:h-8 xl:h-[41px]",
    order: "order-3 sm:order-1", // Mobile: row 2 col 1, SM: row 1 col 1 (top left)
  },
  {
    src: "/assets/Section/Logo_OpenCivics.png",
    alt: "Open Civics",
    size: "h-8 lg:h-10 xl:h-[50px]",
    order: "order-4 sm:order-5 md:order-6", // Mobile: row 2 col 2, SM: row 2 col 2, MD: swapped with Mutual Aid CO
  },
  {
    src: "/assets/Section/Logo_MutualAidCO.png",
    alt: "Mutual Aid CO",
    size: "h-11 lg:h-14 xl:h-[70px]",
    order: "order-5 sm:order-6 md:order-5", // Mobile: row 3 col 1, SM: row 2 col 3, MD: swapped with OpenCivics
  },
  {
    src: "/assets/Section/Logo_CUBoulder.png",
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
