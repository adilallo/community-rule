"use client";

import { useState } from "react";
import RuleCard from "../components/RuleCard";
import Image from "next/image";
import { getAssetPath } from "../../lib/assetUtils";

export default function ComponentsPreview() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const sampleCategories = [
    {
      name: "Values",
      items: ["Consciousness", "Ecology", "Abundance", "Art", "Decisiveness"],
      createUrl: "/create/value",
    },
    {
      name: "Communication",
      items: ["Signal"],
      createUrl: "/create/communication",
    },
    {
      name: "Membership",
      items: ["Open Admission"],
      createUrl: "/create/membership",
    },
    {
      name: "Decision-making",
      items: ["Lazy Consensus", "Modified Consensus"],
      createUrl: "/create/decision-making",
    },
    {
      name: "Conflict management",
      items: ["Code of Conduct", "Restorative Justice"],
      createUrl: "/create/conflict-management",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-[var(--spacing-scale-032)]">
      <div className="max-w-[1200px] mx-auto space-y-[var(--spacing-scale-064)]">
        <header className="space-y-[var(--spacing-scale-008)]">
          <h1 className="font-bricolage-grotesque text-[48px] leading-[56px] font-bold text-[var(--color-content-default-primary)]">
            Component Preview
          </h1>
          <p className="font-inter text-[18px] leading-[24px] text-[var(--color-content-default-secondary)]">
            RuleCard component examples - collapsed/expanded states, size variants, and interactions
          </p>
        </header>

        {/* Collapsed State - Large */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Collapsed State - Large (L)
          </h2>
          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <RuleCard
              title="Mutual Aid Mondays"
              description="Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness."
              backgroundColor="bg-[#b7d9d5]"
              expanded={false}
              size="L"
              className="w-[525px]"
              logoUrl="http://localhost:3845/assets/d2513a6ab56f2b2927e8a7c442c06326e7a29541.png"
              logoAlt="Mutual Aid Mondays"
              onClick={() => console.log("Card clicked: Mutual Aid Mondays")}
            />
          </div>
        </section>

        {/* Collapsed State - Medium */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Collapsed State - Medium (M)
          </h2>
          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <RuleCard
              title="Mutual Aid Mondays"
              description="Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness."
              backgroundColor="bg-[#b7d9d5]"
              expanded={false}
              size="M"
              className="w-[289px]"
              logoUrl="http://localhost:3845/assets/d2513a6ab56f2b2927e8a7c442c06326e7a29541.png"
              logoAlt="Mutual Aid Mondays"
              onClick={() => console.log("Card clicked: Mutual Aid Mondays")}
            />
          </div>
        </section>

        {/* Expanded State - Large */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Expanded State - Large (L)
          </h2>
          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <RuleCard
              title="Mutual Aid Mondays"
              description="Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness."
              backgroundColor="bg-[#b7d9d5]"
              expanded={true}
              size="L"
              className="w-[568px]"
              logoUrl="http://localhost:3845/assets/d2513a6ab56f2b2927e8a7c442c06326e7a29541.png"
              logoAlt="Mutual Aid Mondays"
              categories={sampleCategories}
              onPillClick={(category, item) => {
                console.log(`Pill clicked: ${category} - ${item}`);
              }}
              onCreateClick={(category) => {
                console.log(`Create clicked: ${category}`);
              }}
              onClick={() => console.log("Card clicked: Mutual Aid Mondays")}
            />
          </div>
        </section>

        {/* Expanded State - Medium */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Expanded State - Medium (M)
          </h2>
          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <RuleCard
              title="Mutual Aid Mondays"
              description="Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness."
              backgroundColor="bg-[#b7d9d5]"
              expanded={true}
              size="M"
              className="w-[398px]"
              logoUrl="http://localhost:3845/assets/d2513a6ab56f2b2927e8a7c442c06326e7a29541.png"
              logoAlt="Mutual Aid Mondays"
              categories={sampleCategories}
              onPillClick={(category, item) => {
                console.log(`Pill clicked: ${category} - ${item}`);
              }}
              onCreateClick={(category) => {
                console.log(`Create clicked: ${category}`);
              }}
              onClick={() => console.log("Card clicked: Mutual Aid Mondays")}
            />
          </div>
        </section>

        {/* Different Background Colors */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Different Background Colors
          </h2>
          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-scale-024)]">
              <RuleCard
                title="Consensus clusters"
                description="Units called Circles have the ability to decide and act on matters in their domains."
                backgroundColor="bg-[var(--color-surface-default-brand-lime)]"
                expanded={false}
                size="L"
                className="w-[525px]"
                icon={
                  <Image
                    src={getAssetPath("assets/Icon_Sociocracy.svg")}
                    alt="Sociocracy"
                    width={103}
                    height={103}
                  />
                }
                onClick={() => console.log("Consensus clusters selected")}
              />
              <RuleCard
                title="Consensus"
                description="Decisions that affect the group collectively should involve participation of all participants."
                backgroundColor="bg-[var(--color-surface-default-brand-rust)]"
                expanded={false}
                size="L"
                className="w-[525px]"
                icon={
                  <Image
                    src={getAssetPath("assets/Icon_Consensus.svg")}
                    alt="Consensus"
                    width={103}
                    height={103}
                  />
                }
                onClick={() => console.log("Consensus selected")}
              />
            </div>
          </div>
        </section>

        {/* Logo Fallback */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Logo Fallback (Community Initials)
          </h2>
          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <RuleCard
              title="Community Example"
              description="This card shows the logo fallback with community initials when no logo is provided."
              backgroundColor="bg-[var(--color-surface-default-brand-teal)]"
              expanded={false}
              size="L"
              className="w-[525px]"
              communityInitials="CE"
              onClick={() => console.log("Community Example selected")}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
