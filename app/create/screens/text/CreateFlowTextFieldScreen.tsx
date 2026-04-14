"use client";

import { useState, useEffect } from "react";
import TextInput from "../../../components/controls/TextInput";
import { useTranslation } from "../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import type { CreateFlowTextStateField } from "../../types";

type Props = {
  messageNamespace: string;
  stateField: CreateFlowTextStateField;
  maxLength: number;
};

/**
 * Shared narrow-column + TextInput pattern for Create Community text frames.
 */
export function CreateFlowTextFieldScreen({
  messageNamespace,
  stateField,
  maxLength,
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
  const hint = t("characterCountTemplate")
    .replace("{current}", String(characterCount))
    .replace("{max}", String(maxLength));

  return (
    <CreateFlowStepShell variant="centeredNarrow">
      <div className="flex w-full max-w-[640px] flex-col items-start gap-[18px]">
        <CreateFlowHeaderLockup
          title={t("title")}
          description={t("description")}
          justification="left"
        />
        <div className="w-full">
          <TextInput
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
