"use client";

import SectionHeader from "./SectionHeader";
import RuleCard from "./RuleCard";
import Button from "./Button";
import Image from "next/image";

const RuleStack = ({ children, className = "" }) => {
  const handleTemplateClick = (templateName) => {
    console.log(`Template selected: ${templateName}`);
    // This would typically navigate to template details or open a modal
    // For now, we'll just log the selection
  };

  return (
    <div
      className={`w-full bg-transparent py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] md:py-[var(--spacing-scale-048)] md:px-[var(--spacing-scale-032)] xmd:py-[var(--spacing-scale-056)] xmd:px-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)] xl:py-[var(--spacing-scale-064)] xl:px-[var(--spacing-scale-096)] flex flex-col gap-[var(--spacing-scale-024)] xmd:gap-[var(--spacing-scale-032)] lg:gap-[var(--spacing-scale-040)] ${className}`}
    >
      <SectionHeader
        title="Popular templates"
        subtitle="These are popular patterns for making decisions in mutual aid and open source communities. You can use them as they are or as a starting place for customizing your own CommunityRule."
        variant="multi-line"
      />
      <div className="flex flex-col gap-[18px] xmd:grid xmd:grid-cols-2 lg:gap-[var(--spacing-scale-024)]">
        <RuleCard
          title="Consensus clusters"
          description="Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council."
          icon={
            <Image
              src="assets/Icon_Sociocracy.svg"
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
              src="assets/Icon_Consensus.svg"
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
              src="assets/Icon_ElectedBoard.svg"
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
              src="assets/Icon_Petition.svg"
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
    </div>
  );
};

export default RuleStack;
