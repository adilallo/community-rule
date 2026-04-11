"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/**
 * Matches design-system `md` (`--breakpoint-md`, 640px in `app/tailwind.css`).
 * Use with Tailwind `md:` / `max-md:` utilities in create-flow pages.
 */
const CREATE_FLOW_MIN_WIDTH_MD = "(min-width: 640px)";

/**
 * True at or above the create-flow `md` breakpoint (desktop-oriented layout).
 *
 * `useMediaQuery` initializes to `false` on the server and first client render
 * to avoid hydration mismatches. We combine it with a post-mount flag so the
 * first paint matches the intended desktop layout until `matchMedia` runs.
 */
export function useCreateFlowMdUp(): boolean {
  const [isMounted, setIsMounted] = useState(false);
  const isMdOrLarger = useMediaQuery(CREATE_FLOW_MIN_WIDTH_MD);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer until mount for SSR/first-paint alignment
    setIsMounted(true);
  }, []);

  return !isMounted || isMdOrLarger;
}
