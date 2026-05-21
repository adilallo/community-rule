"use client";

import { memo } from "react";
import Icon from "../../cards/Icon";
import type { GroupsViewProps } from "./Groups.types";

function GroupsView({ title, items, headingId, className = "" }: GroupsViewProps) {
  return (
    <section
      data-figma-node="22085-860411"
      aria-labelledby={headingId}
      className={`bg-transparent px-0 py-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)] xl:px-[var(--spacing-scale-160)] ${className}`.trim()}
    >
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-[var(--spacing-scale-032)] md:max-w-[1280px] md:gap-[var(--spacing-scale-048)]">
        <h2
          id={headingId}
          className="w-full shrink-0 text-center font-bricolage-grotesque text-[28px] font-bold leading-9 text-[var(--color-content-default-primary)] md:text-[32px] md:leading-10 lg:text-[40px] lg:leading-[52px]"
        >
          {title}
        </h2>
        <div className="flex w-full shrink-0 flex-col bg-[var(--color-surface-default-primary)] max-md:[&>*+*]:-mt-px md:grid md:grid-cols-2 md:gap-px md:bg-[var(--color-border-default-primary)] md:[&>*+*]:mt-0 lg:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex min-h-[350px] min-w-0 shrink-0 justify-center bg-[var(--color-surface-default-primary)] md:justify-stretch"
            >
              <Icon
                icon={item.icon}
                title={item.title}
                description={item.description}
                interactive={false}
                className="w-full min-w-0 max-w-none shrink-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

GroupsView.displayName = "GroupsView";

export default memo(GroupsView);
