"use client";

import SectionHeader from "./SectionHeader";
import RuleCard from "./RuleCard";
import Image from "next/image";

const RuleStack = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full bg-transparent py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] flex flex-col gap-[var(--spacing-scale-024)] ${className}`}
    >
      <SectionHeader
        title="Popular templates"
        subtitle="These are popular patterns for making decisions in mutual aid and open source communities. You can use them as they are or as a starting place for customizing your own CommunityRule."
        variant="small"
      />
      <div className="flex flex-col gap-[18px]">
        <RuleCard
          title="Consensus clusters"
          description="Units called Circles have the ability to decide and act on matters in their domains, which their members agree on through a Council."
          icon={
            <Image
              src="/assets/Icon_Sociocracy.svg"
              alt="Sociocracy"
              width={40}
              height={40}
            />
          }
          backgroundColor="bg-[var(--color-community-kiwi-200)]"
        />
        <RuleCard
          title="Consensus"
          description="Decisions that affect the group collectively should involve participation of all participants."
          icon={
            <Image
              src="/assets/Icon_Consensus.svg"
              alt="Consensus"
              width={40}
              height={40}
            />
          }
          backgroundColor="bg-[var(--color-community-red-200)]"
        />
        <RuleCard
          title="Elected Board"
          description="An elected board determines policies and organizes their implementation."
          icon={
            <Image
              src="/assets/Icon_ElectedBoard.svg"
              alt="Elected Board"
              width={40}
              height={40}
            />
          }
          backgroundColor="bg-[var(--color-surface-default-brand-accent)]"
        />
        <RuleCard
          title="Petition"
          description="All participants can propose and vote on proposals for the group."
          icon={
            <Image
              src="/assets/Icon_Petition.svg"
              alt="Petition"
              width={40}
              height={40}
            />
          }
          backgroundColor="bg-[var(--color-community-blue-300)]"
        />
      </div>
    </div>
  );
};

export default RuleStack;
