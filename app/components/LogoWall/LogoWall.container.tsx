"use client";

import { memo, useState, useEffect, useMemo } from "react";
import LogoWallView from "./LogoWall.view";
import type { LogoWallProps } from "./LogoWall.types";

const defaultLogos = [
  {
    src: "/assets/logo-1.svg",
    alt: "Partner Logo 1",
    width: 120,
    height: 40,
  },
  {
    src: "/assets/logo-2.svg",
    alt: "Partner Logo 2",
    width: 120,
    height: 40,
  },
  {
    src: "/assets/logo-3.svg",
    alt: "Partner Logo 3",
    width: 120,
    height: 40,
  },
  {
    src: "/assets/logo-4.svg",
    alt: "Partner Logo 4",
    width: 120,
    height: 40,
  },
  {
    src: "/assets/logo-5.svg",
    alt: "Partner Logo 5",
    width: 120,
    height: 40,
  },
  {
    src: "/assets/logo-6.svg",
    alt: "Partner Logo 6",
    width: 120,
    height: 40,
  },
];

const LogoWallContainer = memo<LogoWallProps>(
  ({ logos, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);

    const displayLogos = useMemo(() => logos || defaultLogos, [logos]);

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
  },
);

LogoWallContainer.displayName = "LogoWall";

export default LogoWallContainer;
