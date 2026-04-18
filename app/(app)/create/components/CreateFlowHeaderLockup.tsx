"use client";

import HeaderLockup from "../../../components/type/HeaderLockup";
import type { HeaderLockupProps } from "../../../components/type/HeaderLockup/HeaderLockup.types";
import { useCreateFlowMdUp } from "../hooks/useCreateFlowMdUp";

export type CreateFlowHeaderLockupProps = Omit<HeaderLockupProps, "size"> & {
  /** Omit for responsive `M` below `md`, `L` at/above `md` (matches `--breakpoint-md`). */
  size?: HeaderLockupProps["size"];
};

/**
 * Create-flow HeaderLockup: **`L` at/above `md`**, `M` below unless `size` is passed explicitly.
 */
export function CreateFlowHeaderLockup({
  size: sizeProp,
  ...rest
}: CreateFlowHeaderLockupProps) {
  const mdUp = useCreateFlowMdUp();
  const size = sizeProp ?? (mdUp ? "L" : "M");
  return <HeaderLockup {...rest} size={size} />;
}
