"use client";

import { memo } from "react";
import CheckboxGroup from "../../controls/CheckboxGroup";
import type { InfoMessageBoxViewProps } from "./InfoMessageBox.types";

/** Exclamation icon per Figma 19751:35053 – vertical bar + dot inside circle; circle bg white 10% opacity, no border */
function ExclamationIconInline() {
  const fillColor = "var(--color-content-default-primary, white)";
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.1)" />
      <path
        d="M11.25 14.0386V5.53857H12.75V14.0386H11.25ZM11.25 18.4616V16.9616H12.75V18.4616H11.25Z"
        fill={fillColor}
      />
    </svg>
  );
}

function InfoMessageBoxView({
  title,
  items,
  icon,
  checkedIds,
  onGroupChange,
  className,
}: InfoMessageBoxViewProps) {
  const options = items.map((item) => ({
    value: item.id,
    label: item.label,
  }));

  const handleChange = (data: { value: string[] }) => {
    onGroupChange(data.value);
  };

  return (
    <div
      className={`flex flex-col gap-[12px] p-[var(--spacing-measures-spacing-500,20px)] rounded-[var(--measures-radius-300,12px)] border-l-2 border-solid border-[var(--color-border-default-secondary,#1f1f1f)] bg-[var(--color-content-inverse-secondary,#1f1f1f)] w-full min-w-0 ${className}`}
      role="region"
      aria-label={title}
    >
      <div className="flex items-center gap-[var(--measures-spacing-200,8px)] min-w-0">
        <div
          className="relative shrink-0 size-6 flex items-center justify-center"
          data-name="Asset / Icon / exclamation"
        >
          {icon ?? <ExclamationIconInline />}
        </div>
        <p className="font-inter font-medium text-[14px] leading-[16px] text-[var(--color-content-default-primary,white)] min-w-0">
          {title}
        </p>
      </div>
      <div className="flex flex-col gap-[12px] [&_label]:gap-[6px] [&_label_span]:text-[12px] [&_label_span]:leading-[16px] [&_label_span]:opacity-80 pl-8">
        <CheckboxGroup
          mode="standard"
          value={checkedIds}
          onChange={handleChange}
          options={options}
          aria-label={title}
          className="flex flex-col gap-[12px] !space-y-0"
        />
      </div>
    </div>
  );
}

export default memo(InfoMessageBoxView);
