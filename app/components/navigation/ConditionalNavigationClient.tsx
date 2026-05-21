"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import { isChromelessNavigationPath } from "../../../lib/navigationChromelessPath";
import TopWithPathname from "./Top/TopWithPathname";

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

    if (isChromelessNavigationPath(pathname)) {
      return null;
    }

    return <TopWithPathname initialSignedIn={initialSignedIn} />;
  },
);

ConditionalNavigationClient.displayName = "ConditionalNavigationClient";

export default ConditionalNavigationClient;
