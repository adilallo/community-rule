"use client";

import React, { useState } from "react";
import TextArea from "../components/TextArea";

export default function FormsPlayground() {
  const [smallValue, setSmallValue] = useState("");
  const [mediumValue, setMediumValue] = useState("");
  const [largeValue, setLargeValue] = useState("");
  const [defaultLabelValue, setDefaultLabelValue] = useState("");
  const [horizontalLabelValue, setHorizontalLabelValue] = useState("");
  const [smallHorizontalValue, setSmallHorizontalValue] = useState("");
  const [smallDefaultValue, setSmallDefaultValue] = useState("");
  const [errorStateValue, setErrorStateValue] = useState("");
  const [disabledStateValue, setDisabledStateValue] = useState("");

  return (
    <div className="p-[24px] space-y-[24px]">
      <h1 className="font-bricolage text-[24px]">Forms Playground</h1>

      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">TextArea Examples</h2>
        <div className="max-w-[520px] space-y-[16px]">
          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Sizes</h3>
            <div className="space-y-[12px]">
              <TextArea
                label="Small"
                size="small"
                value={smallValue}
                onChange={(e) => setSmallValue(e.target.value)}
                placeholder="Enter text..."
              />
              <TextArea
                label="Medium"
                size="medium"
                value={mediumValue}
                onChange={(e) => setMediumValue(e.target.value)}
                placeholder="Enter text..."
              />
              <TextArea
                label="Large"
                size="large"
                value={largeValue}
                onChange={(e) => setLargeValue(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Label Variants</h3>
            <div className="space-y-[12px]">
              <TextArea
                label="Default (Top Label)"
                labelVariant="default"
                size="medium"
                value={defaultLabelValue}
                onChange={(e) => setDefaultLabelValue(e.target.value)}
                placeholder="Enter text..."
              />
              <TextArea
                label="Small Default"
                labelVariant="default"
                size="small"
                value={smallDefaultValue}
                onChange={(e) => setSmallDefaultValue(e.target.value)}
                placeholder="Enter text..."
              />
              <TextArea
                label="Horizontal (Left Label)"
                labelVariant="horizontal"
                size="medium"
                value={horizontalLabelValue}
                onChange={(e) => setHorizontalLabelValue(e.target.value)}
                placeholder="Enter text..."
              />
              <TextArea
                label="Small Horizontal"
                labelVariant="horizontal"
                size="small"
                value={smallHorizontalValue}
                onChange={(e) => setSmallHorizontalValue(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">States</h3>
            <div className="space-y-[12px]">
              <TextArea
                label="Error"
                size="medium"
                state="default"
                error={true}
                value={errorStateValue}
                onChange={(e) => setErrorStateValue(e.target.value)}
                placeholder="Enter text..."
              />
              <TextArea
                label="Disabled"
                size="medium"
                state="default"
                disabled={true}
                value={disabledStateValue}
                onChange={(e) => setDisabledStateValue(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
