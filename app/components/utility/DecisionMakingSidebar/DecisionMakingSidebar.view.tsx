"use client";

import { memo } from "react";
import HeaderLockup from "../../type/HeaderLockup";
import InfoMessageBox from "../InfoMessageBox";
import type { DecisionMakingSidebarViewProps } from "./DecisionMakingSidebar.types";

function DecisionMakingSidebarView({
  title,
  description,
  messageBoxTitle,
  messageBoxItems,
  messageBoxCheckedIds,
  onMessageBoxCheckboxChange,
  size,
  justification,
  className,
}: DecisionMakingSidebarViewProps) {
  const isL = size === "L";
  const isLeft = justification === "left";
  const isStringDescription = typeof description === "string";

  return (
    <div className={`flex flex-col gap-3 w-full min-w-0 ${className}`}>
      {isStringDescription ? (
        <HeaderLockup
          title={title}
          description={description as string}
          justification={justification}
          size={size}
        />
      ) : (
        <div
          className={`flex flex-col gap-[var(--measures-spacing-200,8px)] py-[12px] relative ${
            isLeft ? "items-start" : "items-center"
          }`}
        >
          <div className="flex items-center relative shrink-0 w-full">
            <h1
              className={`flex-[1_0_0] min-h-px min-w-px overflow-hidden relative text-[var(--color-content-default-primary,white)] text-ellipsis whitespace-pre-wrap ${
                isLeft ? "text-left" : "text-center"
              } ${
                isL
                  ? "font-bricolage-grotesque font-extrabold text-[36px] leading-[44px]"
                  : "font-bricolage-grotesque font-bold text-[28px] leading-[36px]"
              }`}
            >
              {title}
            </h1>
          </div>
          {description != null && (
            <p
              className={`font-inter font-normal max-w-[640px] overflow-hidden relative shrink-0 text-[var(--color-content-default-tertiary,#b4b4b4)] text-ellipsis w-full whitespace-pre-wrap ${
                isLeft ? "" : "text-center"
              } ${
                isL
                  ? "text-[18px] leading-[1.3]"
                  : "text-[14px] leading-[20px]"
              }`}
            >
              {description}
            </p>
          )}
        </div>
      )}
      <InfoMessageBox
        title={messageBoxTitle}
        items={messageBoxItems}
        checkedIds={messageBoxCheckedIds}
        onCheckboxChange={onMessageBoxCheckboxChange ?? undefined}
      />
    </div>
  );
}

DecisionMakingSidebarView.displayName = "DecisionMakingSidebarView";

export default memo(DecisionMakingSidebarView);
