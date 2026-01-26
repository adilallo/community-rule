import { useState, useEffect } from "react";

/**
 * Tailwind CSS breakpoints (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Hook for responsive breakpoint detection
 * Uses window.matchMedia for efficient media query detection
 *
 * @param query - Media query string (e.g., "(min-width: 1024px)") or breakpoint key
 *
 * @returns Boolean indicating if the media query matches
 *
 * @example
 * ```tsx
 * // Using breakpoint key
 * const isMobile = useMediaQuery("lg", "max");
 * // Returns true if screen width < 1024px
 *
 * // Using custom query
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 * ```
 */
export function useMediaQuery(
  query: string | keyof typeof BREAKPOINTS,
  direction: "min" | "max" = "min",
): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Convert breakpoint key to media query string
    let mediaQuery: string;
    if (query in BREAKPOINTS) {
      const breakpoint = BREAKPOINTS[query as keyof typeof BREAKPOINTS];
      mediaQuery = `(${direction}-width: ${breakpoint}px)`;
    } else {
      mediaQuery = query;
    }

    // Check if window is available (SSR safety)
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(mediaQuery);
    setMatches(media.matches);

    // Create listener for changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers support addEventListener
    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      // Fallback for older browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query, direction]);

  return matches;
}

/**
 * Convenience hook for mobile detection (below lg breakpoint)
 */
export function useIsMobile(): boolean {
  return useMediaQuery("lg", "max");
}

/**
 * Convenience hook for desktop detection (lg breakpoint and above)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("lg", "min");
}
