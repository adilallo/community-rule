"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import HeaderLockup from "../../components/type/HeaderLockup";
import TextInput from "../../components/controls/TextInput";

/**
 * Text page for the create flow
 *
 * Displays a text input field for user input using HeaderLockup and TextInput components.
 * Responsive sizing: uses L/M for HeaderLockup and medium/small for TextInput based on 640px breakpoint.
 */
export default function TextPage() {
  const [isMounted, setIsMounted] = useState(false);
  const isMdOrLarger = useMediaQuery("(min-width: 640px)");
  const [value, setValue] = useState("");

  // Avoid flash: only use breakpoint after mount so SSR and first paint use same layout (desktop).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: defer layout breakpoint until after mount to prevent flash
    setIsMounted(true);
  }, []);

  const effectiveMdOrLarger = !isMounted || isMdOrLarger;

  const maxLength = 48;
  const characterCount = value.length;

  return (
    <div className="w-full flex flex-col items-center px-[var(--spacing-measures-spacing-500,20px)] md:px-[64px]">
      <div className="flex flex-col gap-[18px] items-start w-full max-w-[640px]">
        {/* HeaderLockup: Left justification, L size at 640px+, M size below 640px */}
        <HeaderLockup
          title="What is your community called?"
          description="This will be the name of your community"
          justification="left"
          size={effectiveMdOrLarger ? "L" : "M"}
        />

        {/* TextInput: medium size at 640px+, small size below 640px */}
        <div className="w-full">
          <TextInput
            placeholder="Enter your community name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputSize={effectiveMdOrLarger ? "medium" : "small"}
            formHeader={false}
            textHint={`${characterCount}/${maxLength}`}
            maxLength={maxLength}
          />
        </div>
      </div>
    </div>
  );
}
