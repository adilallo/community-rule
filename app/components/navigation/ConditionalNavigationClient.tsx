"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import TopNavWithPathname from "./TopNav/TopNavWithPathname";

export type ConditionalNavigationClientProps = {
  initialSignedIn: boolean;
};

/**
 * Client shell: pathname-based visibility. Session for the first paint comes from the
 * parent Server Component (`ConditionalNavigation`) via `initialSignedIn`.
 */
const ConditionalNavigationClient = memo(
  ({ initialSignedIn }: ConditionalNavigationClientProps) => {
    const pathname = usePathname();
    const isCreateFlow = pathname?.startsWith("/create");
    const isLogin = pathname === "/login";

    if (isCreateFlow || isLogin) {
      return null;
    }

    return <TopNavWithPathname initialSignedIn={initialSignedIn} />;
  },
);

ConditionalNavigationClient.displayName = "ConditionalNavigationClient";

export default ConditionalNavigationClient;
