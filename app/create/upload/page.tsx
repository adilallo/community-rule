"use client";

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
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");

  const handleUploadClick = () => {
    // Handle upload button click
    console.log("Upload clicked");
  };

  return (
    <div className="w-full flex flex-col items-center px-[var(--spacing-measures-spacing-500,20px)] md:px-[64px]">
      <div className="flex flex-col gap-[18px] items-center w-full max-w-[640px]">
        {/* HeaderLockup: Center justification at 640px+, left below 640px */}
        <HeaderLockup
          title="How should conflicts be resolved?"
          description="This will be the name of your community"
          justification={isMdOrLarger ? "center" : "left"}
          size={isMdOrLarger ? "L" : "M"}
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
