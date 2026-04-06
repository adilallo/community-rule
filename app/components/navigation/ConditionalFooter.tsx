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
 * Hides footer for /create/* and /login (full-screen flows; login uses a body portal).
 */
const ConditionalFooter = memo(() => {
  const pathname = usePathname();
  const isCreateFlow = pathname?.startsWith("/create");
  const isLogin = pathname === "/login";

  if (isCreateFlow || isLogin) {
    return null;
  }

  return <Footer />;
});

ConditionalFooter.displayName = "ConditionalFooter";

export default ConditionalFooter;
