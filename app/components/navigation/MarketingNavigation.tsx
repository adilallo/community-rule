"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import { isChromelessNavigationPath } from "../../../lib/navigationChromelessPath";
import TopWithPathname from "./Top/TopWithPathname";

/**
 * Marketing-only navigation. Skips the server-side `getNavAuthSignedIn()` call
 * so marketing pages can render statically (no `force-dynamic`); `TopWithPathname`
 * fetches `/api/auth/session` on mount and updates the header from "Log in" to
 * "Profile" when the user is signed in. Brief mismatch is acceptable here —
 * `(app)` / `(admin)` keep the server-rendered nav.
 */
const MarketingNavigation = memo(() => {
  const pathname = usePathname();

  if (isChromelessNavigationPath(pathname)) {
    return null;
  }

  return <TopWithPathname initialSignedIn={false} />;
});

MarketingNavigation.displayName = "MarketingNavigation";

export default MarketingNavigation;
