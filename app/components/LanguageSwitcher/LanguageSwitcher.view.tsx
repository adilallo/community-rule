"use client";

import { memo } from "react";
import type { LanguageSwitcherProps, Language } from "./LanguageSwitcher.types";

const AVAILABLE_LANGUAGES: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
  },
];

function LanguageSwitcherView({ className = "" }: LanguageSwitcherProps) {
  return (
    <div className={className}>
      <label htmlFor="language-select" className="sr-only">
        Select language
      </label>
      <select
        id="language-select"
        className="bg-[var(--color-surface-default-primary)] text-[var(--color-content-default-primary)] font-inter text-sm leading-5 font-normal border border-[var(--color-surface-default-secondary)] rounded-[var(--radius-measures-radius-small)] px-[var(--spacing-scale-012)] py-[var(--spacing-scale-008)] focus:outline-none focus:ring-2 focus:ring-[var(--color-surface-default-brand-royal)] focus:ring-offset-2 cursor-pointer"
        aria-label="Select language"
        disabled
      >
        {AVAILABLE_LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.nativeName}
          </option>
        ))}
      </select>
      <p className="text-[var(--color-content-default-secondary)] font-inter text-xs leading-4 font-normal mt-[var(--spacing-scale-008)]">
        Language switching functionality coming soon
      </p>
    </div>
  );
}

export default memo(LanguageSwitcherView);
