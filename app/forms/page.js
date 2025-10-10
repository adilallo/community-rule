"use client";

import React, { useState } from "react";
import Checkbox from "../components/Checkbox";
import RadioButton from "../components/RadioButton";
import Input from "../components/Input";

export default function FormsPlayground() {
  const [standardChecked, setStandardChecked] = useState(false);
  const [inverseChecked, setInverseChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("option1");
  const [smallValue, setSmallValue] = useState("Data");
  const [mediumValue, setMediumValue] = useState("Data");
  const [largeValue, setLargeValue] = useState("Data");
  const [defaultLabelValue, setDefaultLabelValue] = useState("Data");
  const [horizontalLabelValue, setHorizontalLabelValue] = useState("Data");
  const [smallHorizontalValue, setSmallHorizontalValue] = useState("Data");
  const [smallDefaultValue, setSmallDefaultValue] = useState("Data");
  const [errorStateValue, setErrorStateValue] = useState("Data");
  const [disabledStateValue, setDisabledStateValue] = useState("Data");

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
        <h2 className="font-space text-[18px]">Input Examples</h2>
        <div className="max-w-[520px] space-y-[16px]">
          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Sizes</h3>
            <div className="space-y-[12px]">
              <Input
                label="Small"
                size="small"
                value={smallValue}
                onChange={(e) => setSmallValue(e.target.value)}
              />
              <Input
                label="Medium"
                size="medium"
                value={mediumValue}
                onChange={(e) => setMediumValue(e.target.value)}
              />
              <Input
                label="Large"
                size="large"
                value={largeValue}
                onChange={(e) => setLargeValue(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Label Variants</h3>
            <div className="space-y-[12px]">
              <Input
                label="Default (Top Label)"
                labelVariant="default"
                size="medium"
                value={defaultLabelValue}
                onChange={(e) => setDefaultLabelValue(e.target.value)}
              />
              <Input
                label="Small Default"
                labelVariant="default"
                size="small"
                value={smallDefaultValue}
                onChange={(e) => setSmallDefaultValue(e.target.value)}
              />
              <Input
                label="Horizontal (Left Label)"
                labelVariant="horizontal"
                size="medium"
                value={horizontalLabelValue}
                onChange={(e) => setHorizontalLabelValue(e.target.value)}
              />
              <Input
                label="Small Horizontal"
                labelVariant="horizontal"
                size="small"
                value={smallHorizontalValue}
                onChange={(e) => setSmallHorizontalValue(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">States</h3>
            <div className="space-y-[12px]">
              <Input
                label="Error"
                size="medium"
                state="default"
                error={true}
                value={errorStateValue}
                onChange={(e) => setErrorStateValue(e.target.value)}
              />
              <Input
                label="Disabled"
                size="medium"
                state="default"
                disabled={true}
                value={disabledStateValue}
                onChange={(e) => setDisabledStateValue(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
