"use client";

import NumberedList from "../../components/type/NumberedList";
import { useTranslation } from "../../contexts/MessagesContext";
import { useCreateFlowMdUp } from "../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../components/CreateFlowStepShell";

/**
 * Informational page for the create flow
 *
 * Displays information about the create flow process using HeaderLockup and NumberedList components.
 * Lockup sizing via `CreateFlowHeaderLockup`. NumberedList: S / M by breakpoint.
 */
export default function InformationalPage() {
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation("create.informational");

  const items = [
    {
      title: t("steps.0.title"),
      description: t("steps.0.description"),
    },
    {
      title: t("steps.1.title"),
      description: t("steps.1.description"),
    },
    {
      title: t("steps.2.title"),
      description: t("steps.2.description"),
    },
  ];

  return (
    <CreateFlowStepShell
      variant="centeredNarrow"
      contentTopBelowMd="space-1400"
    >
      <div className="flex w-full max-w-[640px] flex-col items-center gap-12">
        <CreateFlowHeaderLockup
          title={t("title")}
          description={t("description")}
          justification="left"
        />
        <NumberedList items={items} size={mdUp ? "M" : "S"} />
      </div>
    </CreateFlowStepShell>
  );
}
