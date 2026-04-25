"use client";

import { memo } from "react";
import Divider from "../../utility/Divider";
import ListEntry from "../ListEntry";
import { FIGMA_LIST_ROOT } from "../listSizeLayout";
import type { ListViewProps } from "./List.types";

export const ListView = memo(function ListView({
  items,
  size = "m",
  topDivider = true,
  leadingIcon = "edit",
  className = "",
}: ListViewProps) {
  return (
    <div
      className={`flex w-full max-w-[1590px] flex-col items-start ${className}`}
      data-figma-node={FIGMA_LIST_ROOT[size]}
    >
      {topDivider ? <Divider type="content" orientation="horizontal" /> : null}
      <ul className="m-0 flex w-full list-none flex-col items-start p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex w-full flex-col items-stretch [list-style:none]"
          >
            <ListEntry
              title={item.title}
              description={item.description}
              showDescription={item.showDescription}
              href={item.href}
              onClick={item.onClick}
              size={size}
              leadingIcon={item.leadingIcon ?? leadingIcon}
              variant={item.variant}
              topDivider={false}
              bottomDivider
            />
          </li>
        ))}
      </ul>
    </div>
  );
});

ListView.displayName = "ListView";
