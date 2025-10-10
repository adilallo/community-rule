"use client";

import React, { useState } from "react";
import Select from "../components/Select";
import ContextMenu from "../components/ContextMenu";
import ContextMenuItem from "../components/ContextMenuItem";
import ContextMenuSection from "../components/ContextMenuSection";
import ContextMenuDivider from "../components/ContextMenuDivider";

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
        <h2 className="font-space text-[18px]">Select Examples</h2>
        <div className="max-w-[520px] space-y-[16px]">
          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Sizes</h3>
            <div className="space-y-[12px]">
              <Select
                label="Small"
                size="small"
                value={smallValue}
                onChange={(e) => setSmallValue(e.target.value)}
                placeholder="Select"
              >
                <option value="item1">Context Menu Item 1</option>
                <option value="item2">Context Menu Item 2</option>
                <option value="item3">Context Menu Item 3</option>
              </Select>
              <Select
                label="Medium"
                size="medium"
                value={mediumValue}
                onChange={(e) => setMediumValue(e.target.value)}
                placeholder="Select"
              >
                <option value="item1">Context Menu Item 1</option>
                <option value="item2">Context Menu Item 2</option>
                <option value="item3">Context Menu Item 3</option>
              </Select>
              <Select
                label="Large"
                size="large"
                value={largeValue}
                onChange={(e) => setLargeValue(e.target.value)}
                placeholder="Select"
              >
                <option value="item1">Context Menu Item 1</option>
                <option value="item2">Context Menu Item 2</option>
                <option value="item3">Context Menu Item 3</option>
              </Select>
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Label Variants</h3>
            <div className="space-y-[12px]">
              <Select
                label="Default (Top Label)"
                labelVariant="default"
                size="medium"
                value={defaultLabelValue}
                onChange={(e) => setDefaultLabelValue(e.target.value)}
                placeholder="Select"
              >
                <option value="item1">Context Menu Item 1</option>
                <option value="item2">Context Menu Item 2</option>
                <option value="item3">Context Menu Item 3</option>
              </Select>
              <Select
                label="Small Default"
                labelVariant="default"
                size="small"
                value={smallDefaultValue}
                onChange={(e) => setSmallDefaultValue(e.target.value)}
                placeholder="Select"
              >
                <option value="item1">Context Menu Item 1</option>
                <option value="item2">Context Menu Item 2</option>
                <option value="item3">Context Menu Item 3</option>
              </Select>
              <Select
                label="Horizontal (Left Label)"
                labelVariant="horizontal"
                size="medium"
                value={horizontalLabelValue}
                onChange={(e) => setHorizontalLabelValue(e.target.value)}
                placeholder="Select"
              >
                <option value="item1">Context Menu Item 1</option>
                <option value="item2">Context Menu Item 2</option>
                <option value="item3">Context Menu Item 3</option>
              </Select>
              <Select
                label="Small Horizontal"
                labelVariant="horizontal"
                size="small"
                value={smallHorizontalValue}
                onChange={(e) => setSmallHorizontalValue(e.target.value)}
                placeholder="Select"
              >
                <option value="item1">Context Menu Item 1</option>
                <option value="item2">Context Menu Item 2</option>
                <option value="item3">Context Menu Item 3</option>
              </Select>
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">States</h3>
            <div className="space-y-[12px]">
              <Select
                label="Error"
                size="medium"
                state="default"
                error={true}
                value={errorStateValue}
                onChange={(e) => setErrorStateValue(e.target.value)}
                placeholder="Select"
              >
                <option value="item1">Context Menu Item 1</option>
                <option value="item2">Context Menu Item 2</option>
                <option value="item3">Context Menu Item 3</option>
              </Select>
              <Select
                label="Disabled"
                size="medium"
                state="default"
                disabled={true}
                value={disabledStateValue}
                onChange={(e) => setDisabledStateValue(e.target.value)}
                placeholder="Select"
              >
                <option value="item1">Context Menu Item 1</option>
                <option value="item2">Context Menu Item 2</option>
                <option value="item3">Context Menu Item 3</option>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">Context Menu Examples</h2>
        <div className="max-w-[520px] space-y-[16px]">
          <div>
            <h3 className="font-space text-[14px] mb-[8px]">
              Context Menu Demo
            </h3>
            <div className="space-y-[12px]">
              <ContextMenu>
                <ContextMenuItem>Context Menu Item</ContextMenuItem>
                <ContextMenuItem>Context Menu Item</ContextMenuItem>
                <ContextMenuItem hasSubmenu>Context Menu Item</ContextMenuItem>
                <ContextMenuItem hasSubmenu>Context Menu Item</ContextMenuItem>
                <ContextMenuDivider />
                <ContextMenuItem selected>Context Menu Item</ContextMenuItem>
                <ContextMenuItem>Context Menu Item</ContextMenuItem>
                <ContextMenuDivider />
                <ContextMenuSection title="Section Title">
                  <ContextMenuItem>Context Menu Item</ContextMenuItem>
                  <ContextMenuItem>Context Menu Item</ContextMenuItem>
                </ContextMenuSection>
              </ContextMenu>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
