"use client";

import {
  useState,
  useEffect,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderLockup from "../../components/type/HeaderLockup";
import MultiSelect from "../../components/controls/MultiSelect";
import type { ChipOption } from "../../components/controls/MultiSelect/MultiSelect.types";
import { useCreateFlow } from "../context/CreateFlowContext";

function createListCustomHandlers(
  setList: Dispatch<SetStateAction<ChipOption[]>>,
  confirmState: "Unselected" | "Selected",
  onInteraction?: () => void,
) {
  const touch = () => onInteraction?.();
  return {
    onAddClick: () => {
      touch();
      setList((prev) => [
        ...prev,
        { id: crypto.randomUUID(), label: "", state: "Custom" },
      ]);
    },
    onCustomChipConfirm: (chipId: string, value: string) => {
      touch();
      setList((prev) =>
        prev.map((opt) =>
          opt.id === chipId
            ? { ...opt, label: value, state: confirmState }
            : opt,
        ),
      );
    },
    onCustomChipClose: (chipId: string) => {
      touch();
      setList((prev) => prev.filter((o) => o.id !== chipId));
    },
  };
}

/**
 * Select page for the create flow
 *
 * Displays selection options using HeaderLockup and MultiSelect components.
 * Responsive layout: two-column at 640px+, single column below 640px.
 * Responsive sizing: uses L/M for HeaderLockup and S for MultiSelect based on 640px breakpoint.
 */
export default function SelectPage() {
  const { markCreateFlowInteraction } = useCreateFlow();
  const [isMounted, setIsMounted] = useState(false);
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  // Avoid flash: only use breakpoint after mount so SSR and first paint use same layout (desktop).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer layout breakpoint until after mount to prevent flash
    setIsMounted(true);
  }, []);

  const effectiveMdOrLarger = !isMounted || isMdOrLarger;

  const [communitySizeOptions, setCommunitySizeOptions] = useState<
    ChipOption[]
  >([
    { id: "1", label: "1 member", state: "Unselected" },
    { id: "2", label: "2-10 members", state: "Unselected" },
    { id: "3", label: "10-24 members", state: "Unselected" },
    { id: "4", label: "24-64 members", state: "Unselected" },
    { id: "5", label: "64-128 members", state: "Unselected" },
    { id: "6", label: "125-1000 members", state: "Unselected" },
    { id: "7", label: "1000+ members", state: "Unselected" },
  ]);

  const [organizationTypeOptions, setOrganizationTypeOptions] = useState<
    ChipOption[]
  >([
    { id: "1", label: "Non-profit", state: "Unselected" },
    { id: "2", label: "For-profit", state: "Unselected" },
    { id: "3", label: "Community", state: "Unselected" },
    { id: "4", label: "Educational", state: "Unselected" },
  ]);

  const [governanceStyleOptions, setGovernanceStyleOptions] = useState<
    ChipOption[]
  >([
    { id: "1", label: "Democratic", state: "Unselected" },
    { id: "2", label: "Consensus", state: "Unselected" },
    { id: "3", label: "Hierarchical", state: "Unselected" },
    { id: "4", label: "Flat", state: "Unselected" },
  ]);

  const communityCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setCommunitySizeOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );
  const organizationCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setOrganizationTypeOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );
  const governanceCustomHandlers = useMemo(
    () =>
      createListCustomHandlers(
        setGovernanceStyleOptions,
        "Unselected",
        markCreateFlowInteraction,
      ),
    [markCreateFlowInteraction],
  );

  const handleCommunitySizeClick = (chipId: string) => {
    markCreateFlowInteraction();
    setCommunitySizeOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state: opt.state === "Selected" ? "Unselected" : "Selected",
            }
          : opt,
      ),
    );
  };

  const handleOrganizationTypeClick = (chipId: string) => {
    markCreateFlowInteraction();
    setOrganizationTypeOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state: opt.state === "Selected" ? "Unselected" : "Selected",
            }
          : opt,
      ),
    );
  };

  const handleGovernanceStyleClick = (chipId: string) => {
    markCreateFlowInteraction();
    setGovernanceStyleOptions((prev) =>
      prev.map((opt) =>
        opt.id === chipId
          ? {
              ...opt,
              state: opt.state === "Selected" ? "Unselected" : "Selected",
            }
          : opt,
      ),
    );
  };

  return (
    <div className="w-full flex flex-col items-center px-[var(--spacing-measures-spacing-500,20px)] md:px-[64px]">
      {effectiveMdOrLarger ? (
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
              {...communityCustomHandlers}
              addButton={true}
              addButtonText="Add organization type"
            />
            <MultiSelect
              label="Label"
              size="S"
              options={organizationTypeOptions}
              onChipClick={handleOrganizationTypeClick}
              {...organizationCustomHandlers}
              addButton={true}
              addButtonText="Add organization type"
            />
            <MultiSelect
              label="Label"
              size="S"
              options={governanceStyleOptions}
              onChipClick={handleGovernanceStyleClick}
              {...governanceCustomHandlers}
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
            {...communityCustomHandlers}
            addButton={true}
            addButtonText="Add organization type"
          />
          <MultiSelect
            label="Label"
            size="S"
            options={organizationTypeOptions}
            onChipClick={handleOrganizationTypeClick}
            {...organizationCustomHandlers}
            addButton={true}
            addButtonText="Add organization type"
          />
          <MultiSelect
            label="Label"
            size="S"
            options={governanceStyleOptions}
            onChipClick={handleGovernanceStyleClick}
            {...governanceCustomHandlers}
            addButton={true}
            addButtonText="Add organization type"
          />
        </div>
      )}
    </div>
  );
}
