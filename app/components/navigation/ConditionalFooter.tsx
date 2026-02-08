"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Code split Footer - below the fold, can be lazy loaded
const Footer = dynamic(() => import("./Footer"), {
  loading: () => (
    <footer className="bg-[var(--color-surface-default-primary)] w-full min-h-[200px]" />
  ),
  ssr: true, // Keep SSR for SEO
});

/**
 * Conditionally renders Footer based on pathname.
 * Hides footer for /create/* routes (full-screen create flow).
 */
const ConditionalFooter = memo(() => {
  const pathname = usePathname();
  const isCreateFlow = pathname?.startsWith("/create");

  if (isCreateFlow) {
    return null;
  }

  return <Footer />;
});

ConditionalFooter.displayName = "ConditionalFooter";

export default ConditionalFooter;
