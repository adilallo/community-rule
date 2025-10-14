"use client";

import React, { useState } from "react";
import ToggleGroup from "../components/ToggleGroup";

export default function FormsPlayground() {
  const [selectedToggle, setSelectedToggle] = useState("active");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [toggleStates, setToggleStates] = useState({
    default: false,
    hover: false,
    selected: true,
    focus: false,
  });

  const handleToggleChange = (key) => (e) => {
    setToggleStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleGroupChange = (position) => (e) => {
    setSelectedToggle(position);
  };

  const handleFilterChange = (filter) => (e) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="p-[24px] space-y-[24px]">
      <h1 className="font-bricolage text-[24px]">Forms Playground</h1>

      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">Toggle Group Examples</h2>
        <div
          className="max-w-[520px] space-y-[16px] bg-white p-6 rounded-lg border border-gray-200 shadow-lg"
          style={{ backgroundColor: "white" }}
        >
          <div>
            <h3 className="font-space text-[14px] mb-[8px]">
              Interactive Toggle Group
            </h3>
            <div className="flex">
              <ToggleGroup
                position="left"
                state={selectedToggle === "active" ? "selected" : "default"}
                showText={true}
                onChange={handleToggleGroupChange("active")}
              >
                Active Deals
              </ToggleGroup>
              <ToggleGroup
                position="middle"
                state={selectedToggle === "inactive" ? "selected" : "default"}
                showText={true}
                onChange={handleToggleGroupChange("inactive")}
              >
                Inactive Deals
              </ToggleGroup>
              <ToggleGroup
                position="right"
                state={selectedToggle === "pending" ? "selected" : "default"}
                showText={true}
                onChange={handleToggleGroupChange("pending")}
              >
                Pending Deals
              </ToggleGroup>
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">States</h3>
            <div className="flex space-x-2">
              <ToggleGroup position="left" state="default" showText={true}>
                Default
              </ToggleGroup>
              <ToggleGroup position="middle" state="hover" showText={true}>
                Hover
              </ToggleGroup>
              <ToggleGroup position="middle" state="focus" showText={true}>
                Focus
              </ToggleGroup>
              <ToggleGroup position="right" state="selected" showText={true}>
                Selected
              </ToggleGroup>
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Positions</h3>
            <div className="flex">
              <ToggleGroup position="left" state="default" showText={true}>
                Left
              </ToggleGroup>
              <ToggleGroup position="middle" state="default" showText={true}>
                Middle
              </ToggleGroup>
              <ToggleGroup position="middle" state="default" showText={true}>
                Middle
              </ToggleGroup>
              <ToggleGroup position="right" state="default" showText={true}>
                Right
              </ToggleGroup>
            </div>
          </div>

          <div>
            <h3 className="font-space text-[14px] mb-[8px]">Without Text</h3>
            <div className="flex">
              <ToggleGroup position="left" state="default" showText={false}>
                Icon
              </ToggleGroup>
              <ToggleGroup position="middle" state="selected" showText={false}>
                Icon
              </ToggleGroup>
              <ToggleGroup position="right" state="default" showText={false}>
                Icon
              </ToggleGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Content Visibility Examples */}
      <section className="space-y-[12px]">
        <h2 className="font-space text-[18px]">Content Visibility Examples</h2>

        {/* Deal Management Example */}
        <div className="max-w-[520px] space-y-[16px] bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
          <h3 className="font-space text-[14px] mb-[8px]">Deal Management</h3>
          <div className="flex">
            <ToggleGroup
              position="left"
              state={selectedToggle === "active" ? "selected" : "default"}
              showText={true}
              onChange={handleToggleGroupChange("active")}
            >
              Active Deals
            </ToggleGroup>
            <ToggleGroup
              position="middle"
              state={selectedToggle === "inactive" ? "selected" : "default"}
              showText={true}
              onChange={handleToggleGroupChange("inactive")}
            >
              Inactive Deals
            </ToggleGroup>
            <ToggleGroup
              position="right"
              state={selectedToggle === "pending" ? "selected" : "default"}
              showText={true}
              onChange={handleToggleGroupChange("pending")}
            >
              Pending Deals
            </ToggleGroup>
          </div>

          {/* Content that changes based on toggle selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            {selectedToggle === "active" && (
              <div>
                <h4 className="font-semibold text-green-700 mb-2">
                  Active Deals
                </h4>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>Summer Sale - 50% Off</span>
                    <span className="text-green-600 font-semibold">$299</span>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>Black Friday Special</span>
                    <span className="text-green-600 font-semibold">$199</span>
                  </li>
                </ul>
              </div>
            )}

            {selectedToggle === "inactive" && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">
                  Inactive Deals
                </h4>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center p-2 bg-white rounded border opacity-60">
                    <span>Holiday Sale - Expired</span>
                    <span className="text-gray-500 line-through">$399</span>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-white rounded border opacity-60">
                    <span>Spring Clearance - Ended</span>
                    <span className="text-gray-500 line-through">$149</span>
                  </li>
                </ul>
              </div>
            )}

            {selectedToggle === "pending" && (
              <div>
                <h4 className="font-semibold text-yellow-700 mb-2">
                  Pending Deals
                </h4>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>Cyber Monday - Coming Soon</span>
                    <span className="text-yellow-600 font-semibold">$99</span>
                  </li>
                  <li className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>New Year Sale - Pending</span>
                    <span className="text-yellow-600 font-semibold">$79</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Filter Example */}
        <div className="max-w-[520px] space-y-[16px] bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
          <h3 className="font-space text-[14px] mb-[8px]">Content Filter</h3>
          <div className="flex">
            <ToggleGroup
              position="left"
              state={selectedFilter === "all" ? "selected" : "default"}
              showText={true}
              onChange={handleFilterChange("all")}
            >
              All
            </ToggleGroup>
            <ToggleGroup
              position="middle"
              state={selectedFilter === "featured" ? "selected" : "default"}
              showText={true}
              onChange={handleFilterChange("featured")}
            >
              Featured
            </ToggleGroup>
            <ToggleGroup
              position="right"
              state={selectedFilter === "recent" ? "selected" : "default"}
              showText={true}
              onChange={handleFilterChange("recent")}
            >
              Recent
            </ToggleGroup>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div
              className={`p-4 rounded-lg border ${
                selectedFilter === "all" || selectedFilter === "featured"
                  ? "block"
                  : "hidden"
              }`}
            >
              <h4 className="font-semibold">Featured Article</h4>
              <p className="text-gray-600 text-sm">
                This is a featured article that shows when "All" or "Featured"
                is selected.
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                selectedFilter === "all" || selectedFilter === "recent"
                  ? "block"
                  : "hidden"
              }`}
            >
              <h4 className="font-semibold">Recent Post</h4>
              <p className="text-gray-600 text-sm">
                This is a recent post that shows when "All" or "Recent" is
                selected.
              </p>
            </div>
            <div
              className={`p-4 rounded-lg border ${
                selectedFilter === "all" ? "block" : "hidden"
              }`}
            >
              <h4 className="font-semibold">General Content</h4>
              <p className="text-gray-600 text-sm">
                This content only shows when "All" is selected.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
