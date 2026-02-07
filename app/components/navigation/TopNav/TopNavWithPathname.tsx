"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import TopNav from "./TopNav.container";
import type { TopNavProps } from "./TopNav.types";

/**
 * TopNav wrapper that automatically determines folderTop based on current pathname.
 * Use this in layout.tsx instead of ConditionalHeader.
 */
const TopNavWithPathname = memo<Omit<TopNavProps, "folderTop">>((props) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return <TopNav {...props} folderTop={isHomePage} />;
});

TopNavWithPathname.displayName = "TopNavWithPathname";

export default TopNavWithPathname;
