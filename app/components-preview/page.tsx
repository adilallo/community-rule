"use client";

import { useState } from "react";
import RuleCard from "../components/RuleCard";
import Chip from "../components/Chip";
import MultiSelect from "../components/MultiSelect";
import Image from "next/image";
import { getAssetPath } from "../../lib/assetUtils";

interface ChipData {
  id: string;
  label: string;
  state: "Unselected" | "Selected" | "Custom";
  palette: "Default" | "Inverse";
  size: "S" | "M";
}

// MultiSelect example component with state management
function MultiSelectExample({ size }: { size: "S" | "M" }) {
  const [options, setOptions] = useState([
    { id: "1", label: "1 member", state: "Unselected" as const },
    { id: "2", label: "2-10 members", state: "Unselected" as const },
    { id: "3", label: "10-24 members", state: "Unselected" as const },
    { id: "4", label: "24-64 members", state: "Unselected" as const },
    { id: "5", label: "64-128 members", state: "Unselected" as const },
    { id: "6", label: "125-1000 members", state: "Unselected" as const },
    { id: "7", label: "1000+ members", state: "Unselected" as const },
  ]);

  const handleChipClick = (chipId: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state: opt.state === "Selected" ? ("Unselected" as const) : ("Selected" as const),
            }
          : opt
      )
    );
  };

  const handleAddClick = () => {
    const newId = `custom-${Date.now()}`;
    setOptions((prev) => [
      ...prev,
      { id: newId, label: "", state: "Custom" as const },
    ]);
  };

  const handleCustomConfirm = (chipId: string, value: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? { ...opt, label: value, state: "Selected" as const }
          : opt
      )
    );
  };

  const handleCustomClose = (chipId: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== chipId));
  };

  return (
    <div className="space-y-[var(--spacing-scale-016)]">
      <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
        {size === "S" ? "Small (S)" : "Medium (M)"}
      </h3>
      <MultiSelect
        label="Label"
        showHelpIcon={true}
        size={size}
        options={options}
        onChipClick={handleChipClick}
        onAddClick={handleAddClick}
        onCustomChipConfirm={handleCustomConfirm}
        onCustomChipClose={handleCustomClose}
        addButtonText="Add organization type"
      />
    </div>
  );
}

export default function ComponentsPreview() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [chipStates, setChipStates] = useState<Record<string, "Unselected" | "Selected">>({
    "default-s": "Unselected",
    "default-m": "Unselected",
    "inverse-s": "Unselected",
    "inverse-m": "Unselected",
  });
  
  // Manage custom chips separately
  const [customChips, setCustomChips] = useState<ChipData[]>([
    { id: "custom-1", label: "", state: "Custom", palette: "Default", size: "S" },
    { id: "custom-2", label: "", state: "Custom", palette: "Default", size: "M" },
  ]);

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
            RuleCard and Chip component examples - states, palettes, sizes, and interactions
          </p>
        </header>

        {/* Chip Component - Controls */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Chip Component (Controls)
          </h2>
          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            {/* Default palette */}
            <div className="space-y-[var(--spacing-scale-016)]">
              <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
                Default palette
              </h3>
              <div className="flex flex-wrap items-center gap-[var(--spacing-scale-016)]">
                <Chip
                  label="Small"
                  state={chipStates["default-s"]}
                  palette="Default"
                  size="S"
                  onClick={() =>
                    setChipStates((prev) => ({
                      ...prev,
                      "default-s": prev["default-s"] === "Selected" ? "Unselected" : "Selected",
                    }))
                  }
                />
                <Chip
                  label="Medium"
                  state={chipStates["default-m"]}
                  palette="Default"
                  size="M"
                  onClick={() =>
                    setChipStates((prev) => ({
                      ...prev,
                      "default-m": prev["default-m"] === "Selected" ? "Unselected" : "Selected",
                    }))
                  }
                />
                <Chip
                  label="Disabled"
                  state="Disabled"
                  palette="Default"
                  size="S"
                />
                {customChips
                  .filter((chip) => chip.palette === "Default")
                  .map((chip) => (
                    <Chip
                      key={chip.id}
                      label={chip.state === "Custom" ? "" : chip.label}
                      state={chip.state}
                      palette={chip.palette}
                      size={chip.size}
                      onCheck={(value, e) => {
                        e.stopPropagation();
                        setCustomChips((prev) =>
                          prev.map((c) =>
                            c.id === chip.id
                              ? { ...c, label: value, state: "Selected" as const }
                              : c
                          )
                        );
                      }}
                      onClose={(e) => {
                        e.stopPropagation();
                        setCustomChips((prev) => prev.filter((c) => c.id !== chip.id));
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Only toggle if the chip is in Selected or Unselected state (not Custom)
                        if (chip.state === "Selected" || chip.state === "Unselected") {
                          setCustomChips((prev) =>
                            prev.map((c) =>
                              c.id === chip.id
                                ? {
                                    ...c,
                                    state: c.state === "Selected" ? ("Unselected" as const) : ("Selected" as const),
                                  }
                                : c
                            )
                          );
                        }
                      }}
                    />
                  ))}
                {/* Add new custom chip button - Ghost button style */}
                <button
                  type="button"
                  onClick={() => {
                    const newId = `custom-${Date.now()}`;
                    setCustomChips((prev) => [
                      ...prev,
                      { id: newId, label: "", state: "Custom", palette: "Default", size: "S" },
                    ]);
                  }}
                  className="flex gap-[var(--measures-spacing-050,2px)] items-center justify-center p-[var(--measures-spacing-200,8px)] rounded-[var(--measures-radius-full,9999px)] shrink-0 hover:opacity-80 transition-opacity"
                >
                  {/* Plus icon */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[var(--color-content-default-brand-primary,#fefcc9)] shrink-0"
                  >
                    <path
                      d="M7 3V11M3 7H11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* Text */}
                  <span className="font-inter font-medium text-[length:var(--sizing-300,12px)] leading-[14px] text-[color:var(--color-content-default-brand-primary,#fefcc9)]">
                    Add Applicable Scope
                  </span>
                </button>
              </div>
            </div>

            {/* Inverse palette - on white background */}
            <div className="space-y-[var(--spacing-scale-016)]">
              <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
                Inverse palette (on white background)
              </h3>
              <div className="!bg-white p-[var(--spacing-scale-032)] rounded-[var(--radius-300,12px)]" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex flex-wrap items-center gap-[var(--spacing-scale-016)]">
                  <Chip
                    label="Small"
                    state={chipStates["inverse-s"]}
                    palette="Inverse"
                    size="S"
                    onClick={() =>
                      setChipStates((prev) => ({
                        ...prev,
                        "inverse-s": prev["inverse-s"] === "Selected" ? "Unselected" : "Selected",
                      }))
                    }
                  />
                  <Chip
                    label="Medium"
                    state={chipStates["inverse-m"]}
                    palette="Inverse"
                    size="M"
                    onClick={() =>
                      setChipStates((prev) => ({
                        ...prev,
                        "inverse-m": prev["inverse-m"] === "Selected" ? "Unselected" : "Selected",
                      }))
                    }
                  />
                  <Chip
                    label="Disabled"
                    state="Disabled"
                    palette="Inverse"
                    size="S"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {/* MultiSelect Component */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            MultiSelect Component (Controls)
          </h2>
          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            {/* Small size */}
            <MultiSelectExample size="S" />
            
            {/* Medium size */}
            <MultiSelectExample size="M" />
          </div>
        </section>
      </div>
    </div>
  );
}
