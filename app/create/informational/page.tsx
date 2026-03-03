"use client";

import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderLockup from "../../components/type/HeaderLockup";
import NumberedList from "../../components/type/NumberedList";

/**
 * Informational page for the create flow
 *
 * Displays information about the create flow process using HeaderLockup and NumberedList components.
 * Responsive sizing: uses L/M for HeaderLockup and M/S for NumberedList based on 640px breakpoint.
 */
export default function InformationalPage() {
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  const items = [
    {
      title: "Tell us about your organization",
      description:
        "Start by providing your group's name, description, and profile image.",
    },
    {
      title: "Define your group's CommunityRule.",
      description:
        "Outline decision-making processes, conflict resolution methods, and membership practices. Get recommendations.",
    },
    {
      title: "Share and evolve over time",
      description:
        "Review and refine your community framework before putting it into action and adapting it over time.",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center px-[var(--spacing-measures-spacing-500,20px)] md:px-[64px]">
      <div className="flex flex-col gap-[48px] items-center w-full max-w-[640px]">
        {/* HeaderLockup: Left justification, L size at 640px+, M size below 640px */}
        <HeaderLockup
          title="How CommunityRule helps groups like yours"
          description="This flow will give you recommendations to improve your community and help you put together a proposal for your group to consider. Alternatively, there is a workshop that your group can use to go through the process it together."
          justification="left"
          size={isMdOrLarger ? "L" : "M"}
        />

        {/* NumberedList: M size at 640px+, S size below 640px */}
        <NumberedList items={items} size={isMdOrLarger ? "M" : "S"} />
      </div>
    </div>
  );
}
