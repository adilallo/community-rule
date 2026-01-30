"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import { ConditionalHeaderView } from "./ConditionalHeader.view";
import type { ConditionalHeaderProps } from "./ConditionalHeader.types";

const ConditionalHeaderContainer = memo<ConditionalHeaderProps>(() => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return <ConditionalHeaderView isHomePage={isHomePage} />;
});

ConditionalHeaderContainer.displayName = "ConditionalHeader";

export default ConditionalHeaderContainer;
