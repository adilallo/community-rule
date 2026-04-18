"use client";

import { useState, useEffect, type HTMLInputTypeAttribute } from "react";
import TextInput from "../../../../components/controls/TextInput";
import type { HeaderLockupJustificationValue } from "../../../../components/type/HeaderLockup/HeaderLockup.types";
import { useTranslation } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import {
  CreateFlowStepShell,
  type CreateFlowContentTopBelowMd,
} from "../../components/CreateFlowStepShell";
import { CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS } from "../../components/createFlowLayoutTokens";
import type { CreateFlowTextStateField } from "../../types";

type Props = {
  messageNamespace: string;
  stateField: CreateFlowTextStateField;
  maxLength: number;
  /** Figma Flow — Text (`20094:41243`): main column `items-center` + horizontal padding token. */
  mainAlign?: "start" | "center";
  inputType?: HTMLInputTypeAttribute;
  showCharacterCount?: boolean;
  headerJustification?: HeaderLockupJustificationValue;
  /** Top spacing under top chrome (`CreateFlowStepShell` / `CreateFlowContentTopBelowMd`). */
  contentTopBelowMd?: CreateFlowContentTopBelowMd;
};

/**
 * Shared narrow-column + TextInput pattern for Create Community text frames.
 */
export function CreateFlowTextFieldScreen({
  messageNamespace,
  stateField,
  maxLength,
  mainAlign = "start",
  inputType = "text",
  showCharacterCount = true,
  headerJustification = "left",
  contentTopBelowMd = "space-1400",
}: Props) {
  const { markCreateFlowInteraction, updateState, state } = useCreateFlow();
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation(messageNamespace);

  const readFromState = (): string => {
    const raw = state[stateField];
    return typeof raw === "string" ? raw : "";
  };

  const [value, setValue] = useState(() => readFromState());

  useEffect(() => {
    const incoming = readFromState();
    if (incoming.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync when context hydrates from server/local
    setValue((prev) => (prev === "" ? incoming : prev));
  }, [state, stateField]);

  const characterCount = value.length;
  const hint =
    showCharacterCount === false
      ? false
      : t("characterCountTemplate")
          .replace("{current}", String(characterCount))
          .replace("{max}", String(maxLength));

  const mainItems =
    mainAlign === "center" ? "items-center" : "items-start";

  return (
    <CreateFlowStepShell
      variant="centeredNarrow"
      contentTopBelowMd={contentTopBelowMd}
    >
      <div
        className={`flex flex-col gap-[18px] ${mainItems} ${CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}`}
      >
        <div className="w-full">
          <CreateFlowHeaderLockup
            title={t("title")}
            description={t("description")}
            justification={headerJustification}
          />
        </div>
        <div className="w-full">
          <TextInput
            className="!transition-none"
            type={inputType}
            placeholder={t("placeholder")}
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              setValue(v);
              markCreateFlowInteraction();
              updateState({ [stateField]: v } as Record<string, string>);
            }}
            inputSize={mdUp ? "medium" : "small"}
            formHeader={false}
            textHint={hint}
            maxLength={maxLength}
          />
        </div>
      </div>
    </CreateFlowStepShell>
  );
}
