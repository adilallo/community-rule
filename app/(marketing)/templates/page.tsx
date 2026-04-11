"use client";

import { useRouter } from "next/navigation";
import HeaderLockup from "../../components/type/HeaderLockup";
import { GovernanceTemplateGrid } from "../../components/sections/GovernanceTemplateGrid";
import { GOVERNANCE_TEMPLATE_CATALOG } from "../../../lib/templates/governanceTemplateCatalog";
import { useTranslation } from "../../contexts/MessagesContext";

/**
 * Full templates index — Figma 22142-898446 (title, intro, 2-col card grid).
 */
export default function TemplatesPage() {
  const router = useRouter();
  const t = useTranslation("pages.templates");

  return (
    <div className="w-full bg-black text-[var(--color-content-default-primary,white)]">
      <div
        className="
        mx-auto w-full max-w-[1280px]
        px-[20px] py-[32px]
        min-[640px]:px-[32px] min-[640px]:py-[40px]
        min-[1024px]:px-[64px] min-[1024px]:py-[48px]
      "
      >
        <div className="flex w-full flex-col gap-2 py-3">
          <HeaderLockup
            title={t("title")}
            description={t("subtitle")}
            justification="left"
            size="L"
          />
        </div>
        <div className="mt-6 min-[1024px]:mt-8">
          <GovernanceTemplateGrid
            entries={GOVERNANCE_TEMPLATE_CATALOG}
            onTemplateClick={(slug) => {
              router.push(
                `/create/review-template/${encodeURIComponent(slug)}`,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
