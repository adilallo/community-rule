"use client";

import { memo } from "react";
import Image from "next/image";
import RuleCard from "./RuleCard";
import Button from "./Button";
import { getAssetPath } from "../../lib/assetUtils";

interface RuleStackProps {
  className?: string;
}

declare global {
  interface Window {
    gtag?: (
      _command: string,
      _eventName: string,
      _params?: Record<string, unknown>,
    ) => void;
    analytics?: {
      track: (_eventName: string, _params?: Record<string, unknown>) => void;
    };
  }
}

const RuleStack = memo<RuleStackProps>(({ className = "" }) => {
  const handleTemplateClick = (templateName: string) => {
    // Basic analytics tracking
    if (typeof window !== "undefined") {
      if (window.gtag) {
        window.gtag("event", "template_click", {
          template_name: templateName,
        });
      }
      if (window.analytics) {
        window.analytics.track("Template Clicked", {
          templateName: templateName,
        });
      }
    }
    console.log(`${templateName} template clicked`);
  };

  return (
    <section
      className={`w-full bg-transparent py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] md:py-[var(--spacing-scale-048)] md:px-[var(--spacing-scale-032)] xmd:py-[var(--spacing-scale-056)] xmd:px-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)] xl:py-[var(--spacing-scale-064)] xl:px-[var(--spacing-scale-096)] flex flex-col gap-[var(--spacing-scale-024)] xmd:gap-[var(--spacing-scale-032)] lg:gap-[var(--spacing-scale-040)] ${className}`}
    >
      <div className="flex flex-col gap-[18px] xmd:grid xmd:grid-cols-2 lg:gap-[var(--spacing-scale-024)]">
        <RuleCard
          title="Consensus clusters"
          description="Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council."
          icon={
            <Image
              src={getAssetPath("assets/Icon_Sociocracy.svg")}
              alt="Sociocracy"
              width={40}
              height={40}
              className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
            />
          }
          backgroundColor="bg-[var(--color-surface-default-brand-lime)]"
          onClick={() => handleTemplateClick("Consensus clusters")}
        />
        <RuleCard
          title="Consensus"
          description="Decisions that affect the group collectively should involve participation of all participants."
          icon={
            <Image
              src={getAssetPath("assets/Icon_Consensus.svg")}
              alt="Consensus"
              width={40}
              height={40}
              className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
            />
          }
          backgroundColor="bg-[var(--color-surface-default-brand-rust)]"
          onClick={() => handleTemplateClick("Consensus")}
        />
        <RuleCard
          title="Elected Board"
          description="An elected board determines policies and organizes their implementation."
          icon={
            <Image
              src={getAssetPath("assets/Icon_ElectedBoard.svg")}
              alt="Elected Board"
              width={40}
              height={40}
              className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
            />
          }
          backgroundColor="bg-[var(--color-surface-default-brand-red)]"
          onClick={() => handleTemplateClick("Elected Board")}
        />
        <RuleCard
          title="Petition"
          description="All participants can propose and vote on proposals for the group."
          icon={
            <Image
              src={getAssetPath("assets/Icon_Petition.svg")}
              alt="Petition"
              width={40}
              height={40}
              className="md:w-[56px] md:h-[56px] lg:w-[90px] lg:h-[90px]"
            />
          }
          backgroundColor="bg-[var(--color-surface-default-brand-teal)]"
          onClick={() => handleTemplateClick("Petition")}
        />
      </div>

      {/* See all templates button */}
      <div className="flex justify-center">
        <Button variant="outlined" size="large">
          See all templates
        </Button>
      </div>
    </section>
  );
});

RuleStack.displayName = "RuleStack";

export default RuleStack;
