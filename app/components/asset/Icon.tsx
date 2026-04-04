"use client";

import { memo } from "react";
import ExclamationIcon from "./icon/exclamation.svg";

export type IconName = "exclamation";

/** SVG import may be a React component or a module object { default: Component } (e.g. with Turbopack) */
const iconMap: Record<
  IconName,
  | React.ComponentType<React.SVGProps<SVGSVGElement>>
  | { default: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  exclamation: ExclamationIcon,
};

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
  // Turbopack/bundler may expose SVG as { default: Component } instead of the component directly
  const Svg =
    typeof SvgModule === "object" &&
    SvgModule !== null &&
    "default" in SvgModule
      ? (
          SvgModule as {
            default: React.ComponentType<React.SVGProps<SVGSVGElement>>;
          }
        ).default
      : (SvgModule as React.ComponentType<React.SVGProps<SVGSVGElement>>);
  if (typeof Svg !== "function") return null;
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
