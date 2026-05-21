"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

/** `--breakpoint-sm2` (440px); pairs with Tailwind `sm2:` on create-flow chrome. */
const CREATE_FLOW_MIN_WIDTH_SM2 = "(min-width: 440px)";

/** True at viewport ≥440px. */
export function useCreateFlowSm2Up(): boolean {
  const [isMounted, setIsMounted] = useState(false);
  const isSm2OrLarger = useMediaQuery(CREATE_FLOW_MIN_WIDTH_SM2);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- defer until mount for SSR/first-paint alignment
    setIsMounted(true);
  }, []);

  return !isMounted || isSm2OrLarger;
}
