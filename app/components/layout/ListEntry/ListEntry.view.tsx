"use client";

import { memo } from "react";
import Link from "next/link";
import Icon, { type IconName } from "../../asset/Icon";
import Divider from "../../utility/Divider";
import { FIGMA_LIST_ENTRY_OUTER, listEntrySizeLayout } from "../listSizeLayout";
import type {
  ListEntryViewProps,
  ListEntryVariant,
  ListSize,
} from "./ListEntry.types";

type RowCoreProps = {
  title: string;
  description?: string;
  showDescription: boolean;
  href?: string;
  onClick?: () => void;
  leadingIcon: IconName;
  size: ListSize;
  variant: ListEntryVariant;
};

const ListEntryRow = memo(function ListEntryRow({
  title,
  description,
  showDescription,
  href,
  onClick,
  leadingIcon,
  size,
  variant,
}: RowCoreProps) {
  const layout = listEntrySizeLayout[size];

  const leadingBoxClass =
    size === "s"
      ? "flex h-6 w-6 shrink-0 items-center justify-center"
      : size === "m"
        ? "flex size-8 shrink-0 items-center justify-center"
        : "flex size-10 shrink-0 items-center justify-center";

  const chevronSize = size === "s" ? 16 : size === "l" ? 32 : 24;

  const shellExtra =
    variant === "muted" ? "opacity-60 hover:!bg-transparent" : "";

  const titleClass =
    variant === "danger"
      ? `${layout.title} !text-[var(--color-content-default-negative-primary)]`
      : layout.title;

  const leadingToneClass =
    variant === "danger"
      ? "text-[var(--color-content-default-negative-primary)]"
      : "text-[var(--color-content-default-primary)]";

  const chevronToneClass =
    variant === "danger"
      ? "text-[var(--color-content-default-negative-primary)]"
      : "text-[var(--color-content-default-primary)]";

  const leadingSlot = (
    <div className={`${leadingBoxClass} ${leadingToneClass}`}>
      <Icon name={leadingIcon} size={24} />
    </div>
  );

  const chevronSlot = (
    <div
      className={
        size === "s"
          ? `flex size-4 shrink-0 items-center justify-center ${chevronToneClass}`
          : size === "l"
            ? `flex size-8 shrink-0 items-center justify-center ${chevronToneClass}`
            : `flex size-6 shrink-0 items-center justify-center ${chevronToneClass}`
      }
    >
      <Icon name="chevron_right" size={chevronSize} />
    </div>
  );

  const textBlock = (
    <>
      <div className="flex w-full min-w-0 items-center justify-between">
        <p className={titleClass}>{title}</p>
      </div>
      {showDescription && description != null && description !== "" ? (
        <p className={layout.description}>{description}</p>
      ) : null}
    </>
  );

  const inner = (
    <>
      {leadingSlot}
      <div className={layout.textCol}>{textBlock}</div>
      {chevronSlot}
    </>
  );

  const shellClass = `${layout.shell} ${shellExtra}`.trim();

  if (href) {
    return (
      <Link
        href={href}
        className={shellClass}
        data-figma-node={layout.rowFigma}
      >
        {inner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={shellClass}
        data-figma-node={layout.rowFigma}
      >
        {inner}
      </button>
    );
  }

  return (
    <div className={shellClass} data-figma-node={layout.rowFigma}>
      {inner}
    </div>
  );
});

ListEntryRow.displayName = "ListEntryRow";

export const ListEntryView = memo(function ListEntryView({
  title,
  description = "",
  showDescription = true,
  href,
  onClick,
  size = "m",
  leadingIcon = "edit",
  variant = "default",
  topDivider = false,
  bottomDivider = true,
  className = "",
}: ListEntryViewProps) {
  return (
    <div
      className={`flex w-full flex-col items-start ${className}`}
      data-figma-node={FIGMA_LIST_ENTRY_OUTER[size]}
    >
      {topDivider ? <Divider type="content" orientation="horizontal" /> : null}
      <ListEntryRow
        title={title}
        description={description}
        showDescription={showDescription}
        href={href}
        onClick={onClick}
        leadingIcon={leadingIcon}
        size={size}
        variant={variant}
      />
      {bottomDivider ? <Divider type="content" orientation="horizontal" /> : null}
    </div>
  );
});

ListEntryView.displayName = "ListEntryView";
