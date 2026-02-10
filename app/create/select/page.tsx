"use client";

import { useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderLockup from "../../components/type/HeaderLockup";
import MultiSelect from "../../components/controls/MultiSelect";

/**
 * Select page for the create flow
 * 
 * Displays selection options using HeaderLockup and MultiSelect components.
 * Responsive layout: two-column at 640px+, single column below 640px.
 * Responsive sizing: uses L/M for HeaderLockup and S for MultiSelect based on 640px breakpoint.
 */
export default function SelectPage() {
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  // Sample options for MultiSelect components
  const [communitySizeOptions, setCommunitySizeOptions] = useState([
    { id: "1", label: "1 member", state: "Unselected" as const },
    { id: "2", label: "2-10 members", state: "Unselected" as const },
    { id: "3", label: "10-24 members", state: "Unselected" as const },
    { id: "4", label: "24-64 members", state: "Unselected" as const },
    { id: "5", label: "64-128 members", state: "Unselected" as const },
    { id: "6", label: "125-1000 members", state: "Unselected" as const },
    { id: "7", label: "1000+ members", state: "Unselected" as const },
  ]);

  const [organizationTypeOptions, setOrganizationTypeOptions] = useState([
    { id: "1", label: "Non-profit", state: "Unselected" as const },
    { id: "2", label: "For-profit", state: "Unselected" as const },
    { id: "3", label: "Community", state: "Unselected" as const },
    { id: "4", label: "Educational", state: "Unselected" as const },
  ]);

  const [governanceStyleOptions, setGovernanceStyleOptions] = useState([
    { id: "1", label: "Democratic", state: "Unselected" as const },
    { id: "2", label: "Consensus", state: "Unselected" as const },
    { id: "3", label: "Hierarchical", state: "Unselected" as const },
    { id: "4", label: "Flat", state: "Unselected" as const },
  ]);

  const handleCommunitySizeClick = (chipId: string) => {
    setCommunitySizeOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? { ...opt, state: opt.state === "Selected" ? "Unselected" : "Selected" }
          : opt
      )
    );
  };

  const handleOrganizationTypeClick = (chipId: string) => {
    setOrganizationTypeOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? { ...opt, state: opt.state === "Selected" ? "Unselected" : "Selected" }
          : opt
      )
    );
  };

  const handleGovernanceStyleClick = (chipId: string) => {
    setGovernanceStyleOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? { ...opt, state: opt.state === "Selected" ? "Unselected" : "Selected" }
          : opt
      )
    );
  };

  return (
    <div className="w-full flex flex-col items-center px-[var(--spacing-measures-spacing-500,20px)] md:px-[64px]">
      {isMdOrLarger ? (
        // Two-column layout for 640px+
        <div className="flex gap-[var(--measures-spacing-1200,48px)] items-center justify-center w-full max-w-[1280px]">
          {/* Left column: HeaderLockup */}
          <div className="flex flex-[1_0_0] flex-col gap-[var(--measures-spacing-200,8px)] items-start justify-center max-w-[640px] min-h-px min-w-px py-[12px]">
            <HeaderLockup
              title="What is your community called?"
              description="This will be the name of your community"
              justification="left"
              size="L"
            />
          </div>

          {/* Right column: Three MultiSelect components */}
          <div className="flex flex-[1_0_0] flex-col gap-[var(--measures-spacing-800,32px)] items-start max-w-[640px] min-h-px min-w-px">
            <MultiSelect
              label="Label"
              size="S"
              options={communitySizeOptions}
              onChipClick={handleCommunitySizeClick}
              addButton={true}
              addButtonText="Add organization type"
            />
            <MultiSelect
              label="Label"
              size="S"
              options={organizationTypeOptions}
              onChipClick={handleOrganizationTypeClick}
              addButton={true}
              addButtonText="Add organization type"
            />
            <MultiSelect
              label="Label"
              size="S"
              options={governanceStyleOptions}
              onChipClick={handleGovernanceStyleClick}
              addButton={true}
              addButtonText="Add organization type"
            />
          </div>
        </div>
      ) : (
        // Single column layout below 640px
        <div className="flex flex-col gap-[var(--measures-spacing-400,16px)] items-start w-full max-w-[640px]">
          {/* HeaderLockup */}
          <HeaderLockup
            title="What is your community called?"
            description="This will be the name of your community"
            justification="left"
            size="M"
          />

          {/* Three MultiSelect components */}
          <MultiSelect
            label="Label"
            size="S"
            options={communitySizeOptions}
            onChipClick={handleCommunitySizeClick}
            addButton={true}
            addButtonText="Add organization type"
          />
          <MultiSelect
            label="Label"
            size="S"
            options={organizationTypeOptions}
            onChipClick={handleOrganizationTypeClick}
            addButton={true}
            addButtonText="Add organization type"
          />
          <MultiSelect
            label="Label"
            size="S"
            options={governanceStyleOptions}
            onChipClick={handleGovernanceStyleClick}
            addButton={true}
            addButtonText="Add organization type"
          />
        </div>
      )}
    </div>
  );
}
