"use client";

import React from "react";
import ContentLockup from "./ContentLockup";
import Button from "./Button";

const AskOrganizer = ({
  title,
  subtitle,
  description,
  buttonText = "Ask an organizer",
  buttonHref = "#",
  className = "",
}) => {
  return (
    <section
      className={`py-[var(--spacing-scale-032)] px-[var(--spacing-scale-032)] md:py-[var(--spacing-scale-096)] md:px-[var(--spacing-scale-064)] ${className}`}
      aria-labelledby="ask-organizer-headline"
      role="region"
      tabIndex={-1}
    >
      <div className="flex flex-col gap-[var(--spacing-scale-040)]">
        {/* Content Lockup */}
        <ContentLockup
          title={title}
          subtitle={subtitle}
          description={description}
          variant="ask"
        />

        {/* Button */}
        <div className="flex justify-center">
          <Button href={buttonHref} size="large" variant="default">
            {buttonText}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AskOrganizer;
