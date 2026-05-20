/**
 * Routes that render product chrome only (`CreateFlowTopNav`), not marketing `Top`.
 * Keep in sync with `ConditionalNavigationClient`.
 */
export function isChromelessNavigationPath(
  pathname: string | null | undefined,
): boolean {
  if (!pathname) {
    return false;
  }
  if (pathname.startsWith("/create") || pathname === "/login") {
    return true;
  }
  return /^\/use-cases\/[^/]+\/rule\/?$/.test(pathname);
}
