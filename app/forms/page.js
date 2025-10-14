"use client";

import React, { useState } from "react";
import Switch from "../components/Switch";

export default function FormsPlayground() {
  const [switchStates, setSwitchStates] = useState({
    switch1: false,
    switch2: true,
    switch3: false,
    switch4: true,
  });

  const handleSwitchChange = (switchName) => {
    setSwitchStates((prev) => ({
      ...prev,
      [switchName]: !prev[switchName],
    }));
  };

  return (
    <div className="p-[24px] space-y-[24px]">
      <h1 className="font-bricolage text-[24px]">Forms Playground</h1>

      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">Switch Examples</h2>
        <div
          className="max-w-[520px] space-y-[16px] bg-white p-6 rounded-lg border border-gray-200 shadow-lg"
          //style={{ backgroundColor: "white" }}
        >
          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Switch States</h3>
            <div className="space-y-4">
              <Switch
                checked={switchStates.switch1}
                onChange={() => handleSwitchChange("switch1")}
                label="Switch label"
              />
              <Switch
                checked={switchStates.switch2}
                onChange={() => handleSwitchChange("switch2")}
                label="Switch label"
              />
              <Switch
                checked={switchStates.switch3}
                onChange={() => handleSwitchChange("switch3")}
                state="focus"
                label="Switch label"
              />
              <Switch
                checked={switchStates.switch4}
                onChange={() => handleSwitchChange("switch4")}
                state="focus"
                label="Switch label"
              />
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">
              Interactive Example
            </h3>
            <div className="space-y-4">
              <Switch
                checked={switchStates.switch1}
                onChange={() => handleSwitchChange("switch1")}
                label="Enable notifications"
              />
              <Switch
                checked={switchStates.switch2}
                onChange={() => handleSwitchChange("switch2")}
                label="Auto-save documents"
              />
              <Switch
                checked={switchStates.switch3}
                onChange={() => handleSwitchChange("switch3")}
                label="Dark mode"
              />
              <Switch
                checked={switchStates.switch4}
                onChange={() => handleSwitchChange("switch4")}
                label="Email updates"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
