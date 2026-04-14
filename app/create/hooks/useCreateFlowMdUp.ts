"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/** `--breakpoint-md` (640px); same SSR/first-paint pattern as `useCreateFlowLgUp`. */
const CREATE_FLOW_MIN_WIDTH_MD = "(min-width: 640px)";

/** True at viewport ≥640px (pairs with Tailwind `md:` on create-flow screens). */
export function useCreateFlowMdUp(): boolean {
  const [isMounted, setIsMounted] = useState(false);
  const isMdOrLarger = useMediaQuery(CREATE_FLOW_MIN_WIDTH_MD);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer until mount for SSR/first-paint alignment
    setIsMounted(true);
  }, []);

  return !isMounted || isMdOrLarger;
}
