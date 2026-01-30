import { memo } from "react";
import Image from "next/image";
import type { LogoWallViewProps } from "./LogoWall.types";

function LogoWallView({ isVisible, displayLogos, className }: LogoWallViewProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-[var(--spacing-scale-032)] md:gap-[var(--spacing-scale-048)] transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {displayLogos.map((logo, index) => (
        <div
          key={`${logo.src}-${index}`}
          className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 120}
            height={logo.height || 40}
            className="object-contain"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

LogoWallView.displayName = "LogoWallView";

export default memo(LogoWallView);
