"use client";

import HeaderLockup from "../../components/type/HeaderLockup";
import RuleCard from "../../components/cards/RuleCard";

/** Mid-flow review step (after upload, before compact-cards). */
export default function ReviewPage() {
  return (
    <div className="w-full max-w-[1280px] shrink-0 px-5 md:px-16">
      <div className="flex w-full flex-col gap-4 min-w-0 sm:grid sm:grid-cols-2 sm:gap-12">
        <div className="min-w-0">
          <HeaderLockup
            title="Your community is added - congrats!"
            description="In the next section, we'll go through membership, decision-making, conflict resolution, and community values and create a custom operating manual for your organization based on the specifics you just shared."
            justification="left"
            size="L"
          />
        </div>
        <div className="min-w-0 w-full">
          <RuleCard
            title="Mutual Aid Mondays"
            description="Mutual Aid Monday is a grassroots community in Denver, founded in November 2020 by Kelsang Virya, dedicated to supporting neighbors experiencing homelessness."
            size="L"
            expanded={false}
            backgroundColor="bg-[#c9fef9]"
            logoUrl="/assets/Vector_MutualAid.svg"
            logoAlt="Mutual Aid Mondays"
            className="rounded-[16px]"
          />
        </div>
      </div>
    </div>
  );
}
