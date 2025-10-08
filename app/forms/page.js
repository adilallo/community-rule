"use client";

import React, { useState } from "react";
import Checkbox from "../components/Checkbox";

export default function FormsPlayground() {
  const [standardChecked, setStandardChecked] = useState(false);
  const [inverseChecked, setInverseChecked] = useState(true);

  const variations = [
    { title: "Standard / Default", mode: "standard", state: "default" },
    { title: "Standard / Hover", mode: "standard", state: "hover" },
    { title: "Standard / Focus", mode: "standard", state: "focus" },
    { title: "Inverse / Default", mode: "inverse", state: "default" },
    { title: "Inverse / Hover", mode: "inverse", state: "hover" },
    { title: "Inverse / Focus", mode: "inverse", state: "focus" },
  ];

  return (
    <div className="p-[24px] space-y-[24px]">
      <h1 className="font-bricolage text-[24px]">
        Forms Playground — Checkbox
      </h1>

      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">Interactive examples</h2>
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
        <h2 className="font-space text-[18px]">Static states</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {variations.map((v) => (
            <div
              key={`${v.mode}-${v.state}`}
              className="border border-[color:var(--border-color-default-tertiary)] rounded-[8px] p-[12px]"
            >
              <div className="text-[12px] mb-[8px] opacity-70">{v.title}</div>
              <div>
                <div className="flex items-center gap-[12px]">
                  <Checkbox
                    checked={false}
                    mode={v.mode}
                    state={v.state}
                    label="Unchecked"
                    onChange={() => {}}
                  />
                  <Checkbox
                    checked
                    mode={v.mode}
                    state={v.state}
                    label="Checked"
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
