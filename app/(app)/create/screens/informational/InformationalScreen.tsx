"use client";

import type { ReactNode } from "react";
import NumberedList from "../../../../components/type/NumberedList";
import { useMessages } from "../../../../contexts/MessagesContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import { CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS } from "../../components/createFlowLayoutTokens";

/**
 * Create Community — frame 1 (Figma [20094-16005](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=20094-16005)).
 * URL: /create/informational
 */
export function InformationalScreen() {
  const mdUp = useCreateFlowMdUp();
  const copy = useMessages().create.informational;

  const items = [
    {
      title: copy.steps["0"].title,
      description: copy.steps["0"].description,
    },
    {
      title: copy.steps["1"].title,
      description: copy.steps["1"].description,
    },
    {
      title: copy.steps["2"].title,
      description: copy.steps["2"].description,
    },
  ];

  const description: ReactNode = (
    <>
      {copy.descriptionLead}{" "}
      <a
        href="#"
        className="font-inter font-normal text-[var(--color-content-default-tertiary,#b4b4b4)] underline decoration-solid underline-offset-[3px] cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {copy.workshopLabel}
      </a>{" "}
      {copy.descriptionTrail}
    </>
  );

  return (
    <CreateFlowStepShell
      variant="centeredNarrow"
      contentTopBelowMd="space-1400"
    >
      <div
        className={`flex flex-col items-center gap-[var(--measures-spacing-1200,48px)] ${CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}`}
      >
        <CreateFlowHeaderLockup
          title={copy.title}
          description={description}
          justification="left"
        />
        <NumberedList items={items} size={mdUp ? "M" : "S"} />
      </div>
    </CreateFlowStepShell>
  );
}
