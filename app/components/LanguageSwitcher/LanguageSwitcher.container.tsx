"use client";

import { memo } from "react";
import LanguageSwitcherView from "./LanguageSwitcher.view";
import type { LanguageSwitcherProps } from "./LanguageSwitcher.types";

const LanguageSwitcherContainer = memo<LanguageSwitcherProps>(
  ({ className }) => {
    // Future: Add language switching logic here
    // For now, this is just a UI component

    return <LanguageSwitcherView className={className} />;
  },
);

LanguageSwitcherContainer.displayName = "LanguageSwitcher";

export default LanguageSwitcherContainer;
