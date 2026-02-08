"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import TopNavWithPathname from "./TopNav/TopNavWithPathname";

/**
 * Conditionally renders TopNav based on pathname.
 * Hides navigation for /create/* routes (full-screen create flow).
 */
const ConditionalNavigation = memo(() => {
  const pathname = usePathname();
  const isCreateFlow = pathname?.startsWith("/create");

  if (isCreateFlow) {
    return null;
  }

  return <TopNavWithPathname />;
});

ConditionalNavigation.displayName = "ConditionalNavigation";

export default ConditionalNavigation;
