"use client";

import React, { useState } from "react";
import Checkbox from "../components/Checkbox";
import RadioButton from "../components/RadioButton";
import RadioGroup from "../components/RadioGroup";

export default function FormsPlayground() {
  const [standardChecked, setStandardChecked] = useState(false);
  const [inverseChecked, setInverseChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("option1");
  const [standardRadioValue, setStandardRadioValue] = useState("option1");
  const [inverseRadioValue, setInverseRadioValue] = useState("option2");

  return (
    <div className="p-[24px] space-y-[24px]">
      <h1 className="font-bricolage text-[24px]">Forms Playground</h1>

      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">Checkbox Examples</h2>
        <div className="flex flex-col gap-[12px] max-w-[520px]">
          <Checkbox
            label="Standard (controlled)"
            checked={standardChecked}
            mode="standard"
            state="default"
            onChange={({ checked }) => setStandardChecked(checked)}
          />
          <Checkbox
            label="Inverse (controlled)"
            checked={inverseChecked}
            mode="inverse"
            state="default"
            onChange={({ checked }) => setInverseChecked(checked)}
          />
        </div>
      </section>

      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">Radio Button Examples</h2>
        <div className="flex flex-col gap-[12px] max-w-[520px]">
          <RadioButton
            label="Standard (controlled)"
            checked={radioValue === "option1"}
            mode="standard"
            state="default"
            value="option1"
            onChange={({ checked }) => checked && setRadioValue("option1")}
          />
          <RadioButton
            label="Inverse (controlled)"
            checked={radioValue === "option2"}
            mode="inverse"
            state="default"
            value="option2"
            onChange={({ checked }) => checked && setRadioValue("option2")}
          />
        </div>
      </section>

      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">Radio Group</h2>
        <div className="max-w-[520px] space-y-[16px]">
          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Standard Mode</h3>
            <RadioGroup
              name="standard-radio"
              value={standardRadioValue}
              mode="standard"
              state="default"
              onChange={({ value }) => setStandardRadioValue(value)}
              options={[
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
                { value: "option3", label: "Option 3" },
              ]}
            />
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Inverse Mode</h3>
            <RadioGroup
              name="inverse-radio"
              value={inverseRadioValue}
              mode="inverse"
              state="default"
              onChange={({ value }) => setInverseRadioValue(value)}
              options={[
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
                { value: "option3", label: "Option 3" },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
