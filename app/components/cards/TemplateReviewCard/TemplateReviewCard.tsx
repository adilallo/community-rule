"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Rule from "../Rule";
import type { Category, RuleProps } from "../Rule";
import { getAssetPath } from "../../../../lib/assetUtils";
import type { RuleTemplateDto } from "../../../../lib/create/fetchTemplates";
import {
  templateBodyToReviewData,
  templateSummaryFromBody,
} from "../../../../lib/create/templateReviewMapping";
import {
  getGovernanceTemplateCatalogEntry,
} from "../../../../lib/templates/governanceTemplateCatalog";
import { TEMPLATE_GRID_FALLBACK_PRESENTATION } from "../../../../lib/templates/templateGridPresentation";
import { TemplateChipDetailModal } from "./TemplateChipDetailModal";

export interface TemplateReviewCardProps {
  template: RuleTemplateDto;
  /** Merged onto Rule `className` (e.g. final-review desktop vs mobile radius/padding). */
  ruleCardClassName?: string;
  /** Rule size; create-flow passes `L` at/above `md`, `M` below (640px). */
  size?: RuleProps["size"];
}

/**
 * Expanded Rule for template review: surfaces + icon from Figma catalog (21764-16435);
 * tag rows from API `body`. Chip clicks open a read-only detail modal per
 * facet group (values / communication / membership / decision-making / conflict
 * management) so reviewers can see what each chip means without editing.
 */
export function TemplateReviewCard({
  template,
  ruleCardClassName = "",
  size = "L",
}: TemplateReviewCardProps) {
  const catalog = getGovernanceTemplateCatalogEntry(template.slug);
  const pres = catalog ?? TEMPLATE_GRID_FALLBACK_PRESENTATION;
  const { categories: rawCategories, chipDetailsByChipId } = useMemo(
    () => templateBodyToReviewData(template.body),
    [template.body],
  );
  const summary = templateSummaryFromBody(template.description, template.body);

  const [activeChipId, setActiveChipId] = useState<string | null>(null);

  const categories = useMemo<Category[]>(
    () =>
      rawCategories.map((category) => ({
        ...category,
        onChipClick: (_categoryName, chipId) => {
          setActiveChipId(chipId);
        },
      })),
    [rawCategories, setActiveChipId],
  );

  const activeDetail =
    activeChipId !== null ? chipDetailsByChipId[activeChipId] ?? null : null;

  return (
    <>
      <Rule
        title={template.title}
        description={summary}
        expanded
        size={size}
        categories={categories}
        backgroundColor={pres.backgroundColor}
        className={ruleCardClassName}
        onClick={() => {}}
        hideCategoryAddButton
        icon={
          <Image
            src={getAssetPath(pres.iconPath)}
            alt={template.title}
            width={90}
            height={90}
            className="
                    max-[639px]:w-[40px] max-[639px]:h-[40px]
                    min-[640px]:max-[1023px]:w-[56px] min-[640px]:max-[1023px]:h-[56px]
                    min-[1024px]:max-[1439px]:w-[56px] min-[1024px]:max-[1439px]:h-[56px]
                    min-[1440px]:w-[90px] min-[1440px]:h-[90px]
                  "
          />
        }
      />
      <TemplateChipDetailModal
        isOpen={activeChipId !== null}
        onClose={() => setActiveChipId(null)}
        detail={activeDetail}
      />
    </>
  );
}
