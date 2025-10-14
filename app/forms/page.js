"use client";

import React, { useState } from "react";
import Toggle from "../components/Toggle";

export default function FormsPlayground() {
  const [toggleStates, setToggleStates] = useState({
    default: false,
    hover: false,
    selected: true,
    focus: false,
    disabled: false,
    icon: false,
    text: false,
    both: false,
  });

  const handleToggleChange = (key) => (e) => {
    setToggleStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-[24px] space-y-[24px]">
      <h1 className="font-bricolage text-[24px]">Forms Playground</h1>

      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">Toggle Examples</h2>
        <div
          className="max-w-[520px] space-y-[16px] bg-white p-6 rounded-lg border border-gray-200 shadow-lg"
          //style={{ backgroundColor: "white" }}
        >
          <div>
            <h3 className="font-space text-[14px] mb-[8px]">States</h3>
            <div className="space-y-[12px]">
              <Toggle
                label="Default State"
                checked={toggleStates.default}
                onChange={handleToggleChange("default")}
              />
              <Toggle
                label="Hover State"
                checked={toggleStates.hover}
                onChange={handleToggleChange("hover")}
                state="hover"
              />
              <Toggle
                label="Selected State"
                checked={toggleStates.selected}
                onChange={handleToggleChange("selected")}
              />
              <Toggle
                label="Focus State"
                checked={toggleStates.focus}
                onChange={handleToggleChange("focus")}
                state="focus"
              />
              <Toggle
                label="Disabled State"
                checked={toggleStates.disabled}
                onChange={handleToggleChange("disabled")}
                disabled
              />
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Content Types</h3>
            <div className="space-y-[12px]">
              <Toggle
                label="Icon Only"
                checked={toggleStates.icon}
                onChange={handleToggleChange("icon")}
                showIcon={true}
                icon="I"
              />
              <Toggle
                label="Text Only"
                checked={toggleStates.text}
                onChange={handleToggleChange("text")}
                showText={true}
                text="Toggle"
              />
              <Toggle
                label="Icon and Text"
                checked={toggleStates.both}
                onChange={handleToggleChange("both")}
                showIcon={true}
                showText={true}
                icon="I"
                text="Toggle"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
