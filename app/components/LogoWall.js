"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const LogoWall = ({ logos = [] }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Default logos if none provided - ordered for mobile (3 rows × 2 columns)
  const defaultLogos = [
    {
      src: "assets/Section/Logo_FoodNotBombs.png",
      alt: "Food Not Bombs",
      size: "h-11 lg:h-14 xl:h-[70px]",
      order: "order-1 sm:order-4", // Mobile: row 1 col 1, SM: row 2 col 1 (bottom left)
    },
    {
      src: "assets/Section/Logo_StartCOOP.png",
      alt: "Start COOP",
      size: "h-[42px] lg:h-[53px] xl:h-[66px]",
      order: "order-2 sm:order-2", // Mobile: row 1 col 2, SM: row 1 col 2 (top middle)
    },
    {
      src: "assets/Section/Logo_Metagov.png",
      alt: "Metagov",
      size: "h-6 lg:h-8 xl:h-[41px]",
      order: "order-3 sm:order-1", // Mobile: row 2 col 1, SM: row 1 col 1 (top left)
    },
    {
      src: "assets/Section/Logo_OpenCivics.png",
      alt: "Open Civics",
      size: "h-8 lg:h-10 xl:h-[50px]",
      order: "order-4 sm:order-5 md:order-6", // Mobile: row 2 col 2, SM: row 2 col 2, MD: swapped with Mutual Aid CO
    },
    {
      src: "assets/Section/Logo_MutualAidCO.png",
      alt: "Mutual Aid CO",
      size: "h-11 lg:h-14 xl:h-[70px]",
      order: "order-5 sm:order-6 md:order-5", // Mobile: row 3 col 1, SM: row 2 col 3, MD: swapped with OpenCivics
    },
    {
      src: "assets/Section/Logo_CUBoulder.png",
      alt: "CU Boulder",
      size: "h-10 lg:h-12 xl:h-[60px]",
      order: "order-6 sm:order-3", // Mobile: row 3 col 2, SM: row 1 col 3 (top right)
    },
  ];

  const displayLogos = logos.length > 0 ? logos : defaultLogos;

  // Simple fade-in effect after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="p-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-024)] md:py-[var(--spacing-scale-032)] lg:px-[var(--spacing-scale-064)] lg:py-[var(--spacing-scale-048)] xl:px-[160px] xl:py-[var(--spacing-scale-064)]">
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
};

export default LogoWall;
