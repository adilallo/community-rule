"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import Rule from "../../cards/Rule";
import { getAssetPath } from "../../../../lib/assetUtils";
import type { GovernanceTemplateCatalogEntry } from "../../../../lib/templates/governanceTemplateCatalog";

export interface GovernanceTemplateGridProps {
  entries: GovernanceTemplateCatalogEntry[];
  onTemplateClick: (_slug: string) => void;
  /**
   * When true, use project **`md`** (640px) for a 2-column grid (e.g. `/use-cases`).
   * Default keeps the template shell break at **768px**.
   */
  twoColumnsFromMd?: boolean;
}

export function GovernanceTemplateGrid({
  entries,
  onTemplateClick,
  twoColumnsFromMd = false,
}: GovernanceTemplateGridProps) {
  const [isMounted, setIsMounted] = useState(false);

  const isMax639 = useMediaQuery("(max-width: 639px)");
  const isMin640Max1023 = useMediaQuery(
    "(min-width: 640px) and (max-width: 1023px)",
  );
  const isMin1024Max1439 = useMediaQuery(
    "(min-width: 1024px) and (max-width: 1439px)",
  );
  const isMin1440 = useMediaQuery("(min-width: 1440px)");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- breakpoint sizing after mount (matches SSR default "M")
    setIsMounted(true);
  }, []);

  const cardSize = isMounted
    ? isMax639
      ? "XS"
      : isMin640Max1023
        ? "S"
        : isMin1024Max1439
          ? "M"
          : isMin1440
            ? "L"
            : "M"
    : "M";

  const gridLayoutClasses = twoColumnsFromMd
    ? `
        flex flex-col gap-[18px]
        md:grid md:grid-cols-2 md:gap-[18px]
        lg:gap-[24px]
      `
    : `
        flex flex-col gap-[18px]
        min-[768px]:grid min-[768px]:grid-cols-2 min-[768px]:gap-[18px]
        min-[1024px]:gap-[24px]
      `;

  return (
    <div
      className={gridLayoutClasses}
    >
      {entries.map((card) => (
        <Rule
          key={card.slug}
          title={card.title}
          description={card.description}
          recommended={card.recommended === true}
          templateGridFigmaShell
          size={cardSize}
          className={`
              select-none
              cursor-pointer
              max-[639px]:rounded-[var(--measures-radius-200,8px)]
              min-[640px]:max-[1023px]:rounded-[var(--measures-radius-300,12px)]
              min-[1024px]:rounded-[var(--radius-measures-radius-large)]
              max-[639px]:pb-[24px] max-[639px]:pt-[12px] max-[639px]:px-[12px]
              min-[640px]:max-[1023px]:p-[24px]
              min-[1024px]:max-[1439px]:p-[24px]
              min-[1440px]:p-[24px]
              max-[1023px]:gap-[18px]
              min-[1024px]:max-[1439px]:gap-[10px]
              min-[1440px]:gap-[10px]
            `}
          icon={
            <Image
              src={getAssetPath(card.iconPath)}
              alt=""
              width={90}
              height={90}
              draggable={false}
              className="
                  cursor-inherit
                  max-[639px]:w-[40px] max-[639px]:h-[40px]
                  min-[640px]:max-[1023px]:w-[56px] min-[640px]:max-[1023px]:h-[56px]
                  min-[1024px]:max-[1439px]:w-[90px] min-[1024px]:max-[1439px]:h-[90px]
                  min-[1440px]:w-[90px] min-[1440px]:h-[90px]
                "
            />
          }
          backgroundColor={card.backgroundColor}
          onClick={() => {
            onTemplateClick(card.slug);
          }}
        />
      ))}
    </div>
  );
}
