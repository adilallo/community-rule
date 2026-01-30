"use client";

import { memo } from "react";
import Image from "next/image";
import type { LogoWallViewProps } from "./LogoWall.types";

function LogoWallView({
  isVisible,
  displayLogos,
  className,
}: LogoWallViewProps) {
  return (
    <section
      className={`p-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-024)] md:py-[var(--spacing-scale-032)] lg:px-[var(--spacing-scale-064)] lg:py-[var(--spacing-scale-048)] xl:px-[160px] xl:py-[var(--spacing-scale-064)] ${className}`}
    >
      <div className="flex flex-col gap-[var(--spacing-scale-032)] md:gap-[var(--spacing-scale-024)] xl:gap-[var(--spacing-scale-032)]">
        {/* Label */}
        <p className="font-inter font-medium text-[10px] leading-[12px] xl:text-[14px] xl:leading-[12px] uppercase text-[var(--color-content-default-secondary)] text-center">
          Trusted by leading cooperators
        </p>

        {/* Logo Grid Container */}
        <div
          className={`transition-opacity duration-500 ${
            isVisible ? "opacity-60" : "opacity-0"
          }`}
        >
          <div className="grid grid-cols-2 grid-rows-3 sm:grid-cols-3 sm:grid-rows-2 md:flex md:justify-between md:items-center gap-x-[var(--spacing-scale-032)] gap-y-[var(--spacing-scale-032)] sm:gap-y-[var(--spacing-scale-048)]">
            {displayLogos.map((logo, index) => (
              <div
                key={index}
                className={`flex items-center justify-center transition-opacity duration-500 hover:opacity-100 ${
                  logo.order || ""
                }`}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  className={`${
                    logo.size || "h-8"
                  } w-auto object-contain transition-transform duration-500 hover:scale-105`}
                  priority={index < 2} // Prioritize first 2 logos for above-the-fold loading
                  unoptimized // Skip optimization for local images
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

LogoWallView.displayName = "LogoWallView";

export default memo(LogoWallView);
