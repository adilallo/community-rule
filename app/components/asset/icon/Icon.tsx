"use client";

import Image from "next/image";
import { memo } from "react";
import ArrowBackIcon from "./arrow_back.svg";
import ContentCopyIcon from "./content_copy.svg";
import EditIcon from "./edit.svg";
import ExclamationIcon from "./exclamation.svg";
import ChevronRightIcon from "./chevron_right.svg";
import LogOutIcon from "./log_out.svg";
import MailIcon from "./mail.svg";
import WarningIcon from "./warning.svg";

export const ICON_NAME_OPTIONS = [
  "arrow_back",
  "chevron_right",
  "content_copy",
  "edit",
  "exclamation",
  "log_out",
  "mail",
  "warning",
] as const;

export type IconName = (typeof ICON_NAME_OPTIONS)[number];

type SvgComponent =
  | React.ComponentType<React.SVGProps<SVGSVGElement>>
  | { default: React.ComponentType<React.SVGProps<SVGSVGElement>> };

/** SVG import may be a React component or a module object { default: Component } (e.g. with Turbopack) */
const iconMap: Record<IconName, SvgComponent> = {
  arrow_back: ArrowBackIcon,
  chevron_right: ChevronRightIcon,
  content_copy: ContentCopyIcon,
  edit: EditIcon,
  exclamation: ExclamationIcon,
  log_out: LogOutIcon,
  mail: MailIcon,
  warning: WarningIcon,
};

function resolveSvgComponent(module: SvgComponent) {
  if (
    typeof module === "object" &&
    module !== null &&
    "default" in module
  ) {
    return (
      module as {
        default: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      }
    ).default;
  }
  return module as React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface IconProps {
  name: IconName;
  className?: string;
  /** Width and height (default 24) */
  size?: number;
  "aria-hidden"?: boolean;
}

function IconComponent({
  name,
  className = "",
  size = 24,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  const SvgModule = iconMap[name];
  if (!SvgModule) return null;
  const resolved = resolveSvgComponent(SvgModule);

  // Turbopack/webpack mismatch: `.svg` may be a URL string instead of SVGR output.
  if (typeof resolved === "string") {
    return (
      <Image
        src={resolved}
        width={size}
        height={size}
        className={className}
        alt=""
        unoptimized
        aria-hidden={ariaHidden}
      />
    );
  }

  if (resolved == null) return null;

  const Svg = resolved as React.ComponentType<React.SVGProps<SVGSVGElement>>;

  return (
    <Svg
      width={size}
      height={size}
      className={className}
      aria-hidden={ariaHidden}
    />
  );
}

export default memo(IconComponent);
