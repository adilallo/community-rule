"use client";

const LogoWall = ({ logos = [] }) => {
  // Default logos if none provided - ordered to match the screenshot
  const defaultLogos = [
    {
      src: "assets/Section/Logo_FoodNotBombs.png",
      alt: "Food Not Bombs",
      size: "h-11",
    },
    {
      src: "assets/Section/Logo_StartCOOP.png",
      alt: "Start COOP",
      size: "h-11",
    },
    { src: "assets/Section/Logo_Metagov.png", alt: "Metagov", size: "h-7" },
    {
      src: "assets/Section/Logo_OpenCivics.png",
      alt: "Open Civics",
      size: "h-7",
    },
    {
      src: "assets/Section/Logo_MutualAidCO.png",
      alt: "Mutual Aid CO",
      size: "h-11",
    },
    {
      src: "assets/Section/Logo_CUBoulder.png",
      alt: "CU Boulder",
      size: "h-11",
    },
  ];

  const displayLogos = logos.length > 0 ? logos : defaultLogos;

  return (
    <section className="p-[var(--spacing-scale-032)]">
      <div className="flex flex-col gap-[var(--spacing-scale-032)]">
        {/* Label */}
        <p className="font-inter font-medium text-[10px] leading-[12px] uppercase text-[var(--color-content-default-secondary)] text-center">
          Trusted by leading cooperators
        </p>

        {/* Logo Grid Container */}
        <div className="opacity-60">
          <div className="grid grid-cols-2 grid-rows-3 gap-[var(--spacing-scale-032)]">
            {displayLogos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`${logo.size || "h-8"} w-auto object-contain`}
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
