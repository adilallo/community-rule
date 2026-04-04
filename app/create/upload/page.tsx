"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderLockup from "../../components/type/HeaderLockup";
import Upload from "../../components/controls/Upload";

/**
 * Upload page for the create flow
 *
 * Displays upload functionality using HeaderLockup and Upload components.
 * Responsive layout: centered at 640px+, left-aligned below 640px.
 * Responsive sizing: uses L/M for HeaderLockup based on 640px breakpoint.
 */
export default function UploadPage() {
  const [isMounted, setIsMounted] = useState(false);
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  // Avoid flash: only use breakpoint after mount so SSR and first paint use same layout (desktop).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer layout breakpoint until after mount to prevent flash
    setIsMounted(true);
  }, []);

  const effectiveMdOrLarger = !isMounted || isMdOrLarger;

  const handleUploadClick = () => {
    // TODO: Handle upload button click (e.g. open file picker)
  };

  return (
    <div className="w-full flex flex-col items-center px-[var(--spacing-measures-spacing-500,20px)] md:px-[64px]">
      <div className="flex flex-col gap-[18px] items-center w-full max-w-[640px]">
        {/* HeaderLockup: Center justification at 640px+, left below 640px */}
        <HeaderLockup
          title="How should conflicts be resolved?"
          description="This will be the name of your community"
          justification={effectiveMdOrLarger ? "center" : "left"}
          size={effectiveMdOrLarger ? "L" : "M"}
        />

        {/* Upload component: no label in create flow, max width 474px */}
        <div className="w-full max-w-[474px]">
          <Upload
            active={true}
            showHelpIcon={true}
            onClick={handleUploadClick}
          />
        </div>
      </div>
    </div>
  );
}
