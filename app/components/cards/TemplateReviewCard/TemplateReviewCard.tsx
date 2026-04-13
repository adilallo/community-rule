"use client";

import Image from "next/image";
import RuleCard from "../RuleCard";
import type { RuleCardProps } from "../RuleCard/RuleCard.types";
import { getAssetPath } from "../../../../lib/assetUtils";
import type { RuleTemplateDto } from "../../../../lib/create/fetchTemplates";
import {
  templateBodyToCategories,
  templateSummaryFromBody,
} from "../../../../lib/create/templateReviewMapping";
import {
  getGovernanceTemplateCatalogEntry,
} from "../../../../lib/templates/governanceTemplateCatalog";
import { TEMPLATE_GRID_FALLBACK_PRESENTATION } from "../../../../lib/templates/templateGridPresentation";

export interface TemplateReviewCardProps {
  template: RuleTemplateDto;
  /** Merged onto RuleCard `className` (e.g. final-review desktop vs mobile radius/padding). */
  ruleCardClassName?: string;
  /** RuleCard size; create-flow passes `L` at/above `md`, `M` below (640px). */
  size?: RuleCardProps["size"];
}

/**
 * Expanded RuleCard for template review: surfaces + icon from Figma catalog (21764-16435);
 * tag rows from API `body`.
 */
export function TemplateReviewCard({
  template,
  ruleCardClassName = "",
  size = "L",
}: TemplateReviewCardProps) {
  const catalog = getGovernanceTemplateCatalogEntry(template.slug);
  const pres = catalog ?? TEMPLATE_GRID_FALLBACK_PRESENTATION;
  const categories = templateBodyToCategories(template.body);
  const summary = templateSummaryFromBody(template.description, template.body);

  return (
    <RuleCard
      title={template.title}
      description={summary}
      expanded
      size={size}
      categories={categories}
      backgroundColor={pres.backgroundColor}
      className={ruleCardClassName}
      onClick={() => {}}
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
  );
}
