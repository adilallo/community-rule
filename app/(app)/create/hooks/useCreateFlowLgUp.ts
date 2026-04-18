"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

/** `--breakpoint-lg` (1024px); same SSR/first-paint pattern as `useCreateFlowMdUp`. */
const CREATE_FLOW_MIN_WIDTH_LG = "(min-width: 1024px)";

/** True at viewport ≥1024px (e.g. review grid column split with Tailwind `lg:`). */
export function useCreateFlowLgUp(): boolean {
  const [isMounted, setIsMounted] = useState(false);
  const isLgOrLarger = useMediaQuery(CREATE_FLOW_MIN_WIDTH_LG);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer until mount for SSR/first-paint alignment
    setIsMounted(true);
  }, []);

  return !isMounted || isLgOrLarger;
}
