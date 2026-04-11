"use client";

import { useState, useEffect } from "react";
import TextInput from "../../components/controls/TextInput";
import { useTranslation } from "../../contexts/MessagesContext";
import { useCreateFlow } from "../context/CreateFlowContext";
import { useCreateFlowMdUp } from "../hooks/useCreateFlowMdUp";
import { CreateFlowHeaderLockup } from "../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../components/CreateFlowStepShell";

/**
 * Text page for the create flow
 *
 * Displays a text input field for user input using HeaderLockup and TextInput components.
 * Lockup sizing via `CreateFlowHeaderLockup`. TextInput: small / medium by breakpoint.
 * Below `md`, this step stays vertically centered in the main area (see `CreateFlowLayoutClient`).
 */
export default function TextPage() {
  const { markCreateFlowInteraction, updateState, state } = useCreateFlow();
  const mdUp = useCreateFlowMdUp();
  const t = useTranslation("create.text");
  const [value, setValue] = useState(() =>
    typeof state.title === "string" ? state.title : "",
  );

  useEffect(() => {
    const incoming = state.title;
    if (typeof incoming !== "string" || incoming.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync controlled field when context hydrates from server/local
    setValue((prev) => (prev === "" ? incoming : prev));
  }, [state.title]);

  const maxLength = 48;
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
              updateState({ title: v });
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
