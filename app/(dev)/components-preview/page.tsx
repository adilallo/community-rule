"use client";

import { useState } from "react";
import RuleCard from "../../components/cards/RuleCard";
import Card from "../../components/cards/Card";
import Chip from "../../components/controls/Chip";
import MultiSelect from "../../components/controls/MultiSelect";
import Image from "next/image";
import { getAssetPath } from "../../../lib/assetUtils";

/** Module-level counter for unique rule card chip IDs (avoids ref in initial state). */
let ruleCardIdCounter = 0;

interface ChipData {
  id: string;
  label: string;
  state: "unselected" | "selected" | "custom";
  palette: "default" | "inverse";
  size: "s" | "m";
}

function MultiSelectExample({ size }: { size: "s" | "m" }) {
  const [options, setOptions] = useState<
    Array<{
      id: string;
      label: string;
      state: "unselected" | "selected" | "custom";
    }>
  >([
    { id: "1", label: "1 member", state: "unselected" },
    { id: "2", label: "2-10 members", state: "unselected" },
    { id: "3", label: "10-24 members", state: "unselected" },
    { id: "4", label: "24-64 members", state: "unselected" },
    { id: "5", label: "64-128 members", state: "unselected" },
    { id: "6", label: "125-1000 members", state: "unselected" },
    { id: "7", label: "1000+ members", state: "unselected" },
  ]);

  const handleChipClick = (chipId: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state: opt.state === "selected" ? "unselected" : "selected",
            }
          : opt,
      ),
    );
  };

  const handleAddClick = () => {
    const newId = `custom-${Date.now()}`;
    setOptions((prev) => [...prev, { id: newId, label: "", state: "custom" }]);
  };

  const handleCustomConfirm = (chipId: string, value: string) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? { ...opt, label: value, state: "selected" as const }
          : opt,
      ),
    );
  };

  const handleCustomClose = (chipId: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== chipId));
  };

  return (
    <div className="space-y-[var(--spacing-scale-016)]">
      <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
        {size === "s" ? "Small (S)" : "Medium (M)"}
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
  const [chipStates, setChipStates] = useState<
    Record<string, "unselected" | "selected">
  >({
    "default-s": "unselected",
    "default-m": "unselected",
    "inverse-s": "unselected",
    "inverse-m": "unselected",
  });

  // Manage custom chips separately
  const [customChips, setCustomChips] = useState<ChipData[]>([
    {
      id: "custom-1",
      label: "",
      state: "custom",
      palette: "default",
      size: "s",
    },
    {
      id: "custom-2",
      label: "",
      state: "custom",
      palette: "default",
      size: "m",
    },
  ]);

  // RuleCard categories with chip options and state management
  const [ruleCardCategories, setRuleCardCategories] = useState<
    Array<{
      name: string;
      chipOptions: Array<{
        id: string;
        label: string;
        state: "unselected" | "selected" | "custom";
      }>;
      onChipClick?: (_categoryName: string, _chipId: string) => void;
      onAddClick?: (_categoryName: string) => void;
      onCustomChipConfirm?: (
        _categoryName: string,
        _chipId: string,
        _value: string,
      ) => void;
      onCustomChipClose?: (_categoryName: string, _chipId: string) => void;
    }>
  >([
    {
      name: "Values",
      chipOptions: [
        { id: "values-1", label: "Consciousness", state: "unselected" },
        { id: "values-2", label: "Ecology", state: "unselected" },
        { id: "values-3", label: "Abundance", state: "unselected" },
        { id: "values-4", label: "Art", state: "unselected" },
        { id: "values-5", label: "Decisiveness", state: "unselected" },
      ],
      onChipClick: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? {
                          ...opt,
                          state:
                            opt.state === "selected"
                              ? "unselected"
                              : "selected",
                        }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onAddClick: (categoryName: string) => {
        const newId = `custom-${categoryName}-${++ruleCardIdCounter}`;
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: [
                    ...cat.chipOptions,
                    { id: newId, label: "", state: "custom" },
                  ],
                }
              : cat,
          ),
        );
      },
      onCustomChipConfirm: (
        categoryName: string,
        chipId: string,
        value: string,
      ) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? { ...opt, label: value, state: "selected" }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onCustomChipClose: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.filter(
                    (opt) => opt.id !== chipId,
                  ),
                }
              : cat,
          ),
        );
      },
    },
    {
      name: "Communication",
      chipOptions: [{ id: "comm-1", label: "Signal", state: "unselected" }],
      onChipClick: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? {
                          ...opt,
                          state:
                            opt.state === "selected"
                              ? "unselected"
                              : "selected",
                        }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onAddClick: (categoryName: string) => {
        const newId = `custom-${categoryName}-${++ruleCardIdCounter}`;
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: [
                    ...cat.chipOptions,
                    { id: newId, label: "", state: "custom" },
                  ],
                }
              : cat,
          ),
        );
      },
      onCustomChipConfirm: (
        categoryName: string,
        chipId: string,
        value: string,
      ) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? { ...opt, label: value, state: "selected" }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onCustomChipClose: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.filter(
                    (opt) => opt.id !== chipId,
                  ),
                }
              : cat,
          ),
        );
      },
    },
    {
      name: "Membership",
      chipOptions: [
        { id: "membership-1", label: "Open Admission", state: "unselected" },
      ],
      onChipClick: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? {
                          ...opt,
                          state:
                            opt.state === "selected"
                              ? "unselected"
                              : "selected",
                        }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onAddClick: (categoryName: string) => {
        const newId = `custom-${categoryName}-${++ruleCardIdCounter}`;
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: [
                    ...cat.chipOptions,
                    { id: newId, label: "", state: "custom" },
                  ],
                }
              : cat,
          ),
        );
      },
      onCustomChipConfirm: (
        categoryName: string,
        chipId: string,
        value: string,
      ) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? { ...opt, label: value, state: "selected" }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onCustomChipClose: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.filter(
                    (opt) => opt.id !== chipId,
                  ),
                }
              : cat,
          ),
        );
      },
    },
    {
      name: "Decision-making",
      chipOptions: [
        { id: "decision-1", label: "Lazy Consensus", state: "unselected" },
        { id: "decision-2", label: "Modified Consensus", state: "unselected" },
      ],
      onChipClick: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? {
                          ...opt,
                          state:
                            opt.state === "selected"
                              ? "unselected"
                              : "selected",
                        }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onAddClick: (categoryName: string) => {
        const newId = `custom-${categoryName}-${++ruleCardIdCounter}`;
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: [
                    ...cat.chipOptions,
                    { id: newId, label: "", state: "custom" },
                  ],
                }
              : cat,
          ),
        );
      },
      onCustomChipConfirm: (
        categoryName: string,
        chipId: string,
        value: string,
      ) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? { ...opt, label: value, state: "selected" }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onCustomChipClose: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.filter(
                    (opt) => opt.id !== chipId,
                  ),
                }
              : cat,
          ),
        );
      },
    },
    {
      name: "Conflict management",
      chipOptions: [
        { id: "conflict-1", label: "Code of Conduct", state: "unselected" },
        { id: "conflict-2", label: "Restorative Justice", state: "unselected" },
      ],
      onChipClick: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? {
                          ...opt,
                          state:
                            opt.state === "selected"
                              ? "unselected"
                              : "selected",
                        }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onAddClick: (categoryName: string) => {
        const newId = `custom-${categoryName}-${++ruleCardIdCounter}`;
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: [
                    ...cat.chipOptions,
                    { id: newId, label: "", state: "custom" },
                  ],
                }
              : cat,
          ),
        );
      },
      onCustomChipConfirm: (
        categoryName: string,
        chipId: string,
        value: string,
      ) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.map((opt) =>
                    opt.id === chipId
                      ? { ...opt, label: value, state: "selected" }
                      : opt,
                  ),
                }
              : cat,
          ),
        );
      },
      onCustomChipClose: (categoryName: string, chipId: string) => {
        setRuleCardCategories((prev) =>
          prev.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  chipOptions: cat.chipOptions.filter(
                    (opt) => opt.id !== chipId,
                  ),
                }
              : cat,
          ),
        );
      },
    },
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)] p-[var(--spacing-scale-032)]">
      <div className="max-w-[1200px] mx-auto space-y-[var(--spacing-scale-064)]">
        <header className="space-y-[var(--spacing-scale-008)]">
          <h1 className="font-bricolage-grotesque text-[48px] leading-[56px] font-bold text-[var(--color-content-default-primary)]">
            Component Preview
          </h1>
          <p className="font-inter text-[18px] leading-[24px] text-[var(--color-content-default-secondary)]">
            RuleCard, Card, and Chip component examples - states, palettes,
            sizes, and interactions
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
                  palette="default"
                  size="s"
                  onClick={() =>
                    setChipStates((prev) => ({
                      ...prev,
                      "default-s":
                        prev["default-s"] === "selected"
                          ? "unselected"
                          : "selected",
                    }))
                  }
                />
                <Chip
                  label="Medium"
                  state={chipStates["default-m"]}
                  palette="default"
                  size="m"
                  onClick={() =>
                    setChipStates((prev) => ({
                      ...prev,
                      "default-m":
                        prev["default-m"] === "selected"
                          ? "unselected"
                          : "selected",
                    }))
                  }
                />
                <Chip
                  label="Disabled"
                  state="disabled"
                  palette="default"
                  size="s"
                />
                {customChips
                  .filter((chip) => chip.palette === "default")
                  .map((chip) => (
                    <Chip
                      key={chip.id}
                      label={chip.state === "custom" ? "" : chip.label}
                      state={chip.state}
                      palette={chip.palette}
                      size={chip.size}
                      onCheck={(value, e) => {
                        e.stopPropagation();
                        setCustomChips((prev) =>
                          prev.map((c) =>
                            c.id === chip.id
                              ? { ...c, label: value, state: "selected" }
                              : c,
                          ),
                        );
                      }}
                      onClose={(e) => {
                        e.stopPropagation();
                        setCustomChips((prev) =>
                          prev.filter((c) => c.id !== chip.id),
                        );
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Only toggle if the chip is in Selected or Unselected state (not Custom)
                        if (
                          chip.state === "selected" ||
                          chip.state === "unselected"
                        ) {
                          setCustomChips((prev) =>
                            prev.map((c) =>
                              c.id === chip.id
                                ? {
                                    ...c,
                                    state:
                                      c.state === "selected"
                                        ? "unselected"
                                        : "selected",
                                  }
                                : c,
                            ),
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
                      {
                        id: newId,
                        label: "",
                        state: "custom",
                        palette: "default",
                        size: "s",
                      },
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
              <div
                className="!bg-white p-[var(--spacing-scale-032)] rounded-[var(--radius-300,12px)]"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex flex-wrap items-center gap-[var(--spacing-scale-016)]">
                  <Chip
                    label="Small"
                    state={chipStates["inverse-s"]}
                    palette="inverse"
                    size="s"
                    onClick={() =>
                      setChipStates((prev) => ({
                        ...prev,
                        "inverse-s":
                          prev["inverse-s"] === "selected"
                            ? "unselected"
                            : "selected",
                      }))
                    }
                  />
                  <Chip
                    label="Medium"
                    state={chipStates["inverse-m"]}
                    palette="inverse"
                    size="m"
                    onClick={() =>
                      setChipStates((prev) => ({
                        ...prev,
                        "inverse-m":
                          prev["inverse-m"] === "selected"
                            ? "unselected"
                            : "selected",
                      }))
                    }
                  />
                  <Chip
                    label="Disabled"
                    state="disabled"
                    palette="inverse"
                    size="s"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Component - Create flow selection card variants */}
        <section className="space-y-[var(--spacing-scale-024)]">
          <h2 className="font-bricolage-grotesque text-[32px] leading-[40px] font-bold text-[var(--color-content-default-primary)]">
            Card Component
          </h2>
          <div className="bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-300,12px)] p-[var(--spacing-scale-032)] space-y-[var(--spacing-scale-024)]">
            <p className="font-inter text-[18px] leading-[24px] text-[var(--color-content-default-secondary)]">
              Horizontal and vertical orientations with recommended and selected
              states.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="space-y-2">
                <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
                  Horizontal + Recommended
                </h3>
                <Card
                  label="Label"
                  supportText="Members vote to resolve a dispute democratically."
                  recommended={true}
                  selected={false}
                  orientation="horizontal"
                  onClick={() => console.warn("Card clicked")}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
                  Horizontal + Selected
                </h3>
                <Card
                  label="Label"
                  supportText="Members vote to resolve a dispute democratically."
                  recommended={false}
                  selected={true}
                  orientation="horizontal"
                  onClick={() => console.warn("Card clicked")}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
                  Vertical + Recommended
                </h3>
                <Card
                  label="Label"
                  supportText="Invite-only"
                  recommended={true}
                  selected={false}
                  orientation="vertical"
                  showInfoIcon={true}
                  onClick={() => console.warn("Card clicked")}
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-inter text-[20px] leading-[24px] font-semibold text-[var(--color-content-default-primary)]">
                  Vertical + Selected
                </h3>
                <Card
                  label="Label"
                  supportText="Invite-only"
                  recommended={false}
                  selected={true}
                  orientation="vertical"
                  showInfoIcon={true}
                  onClick={() => console.warn("Card clicked")}
                />
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
              onClick={() => console.warn("Card clicked: Mutual Aid Mondays")}
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
              onClick={() => console.warn("Card clicked: Mutual Aid Mondays")}
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
              categories={ruleCardCategories}
              onClick={() => console.warn("Card clicked: Mutual Aid Mondays")}
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
              categories={ruleCardCategories}
              onClick={() => console.warn("Card clicked: Mutual Aid Mondays")}
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
                    src={getAssetPath("assets/template-mark/consensus-clusters.svg")}
                    alt="Sociocracy"
                    width={103}
                    height={103}
                  />
                }
                onClick={() => console.warn("Consensus clusters selected")}
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
                    src={getAssetPath("assets/template-mark/consensus.svg")}
                    alt="Consensus"
                    width={103}
                    height={103}
                  />
                }
                onClick={() => console.warn("Consensus selected")}
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
              onClick={() => console.warn("Community Example selected")}
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
            <MultiSelectExample size="s" />

            {/* Medium size */}
            <MultiSelectExample size="m" />
          </div>
        </section>
      </div>
    </div>
  );
}
