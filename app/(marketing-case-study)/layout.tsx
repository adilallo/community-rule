import type { ReactNode } from "react";

/** Full-viewport case-study surfaces (completed rule demos) — no marketing footer. */
export default function MarketingCaseStudyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden">
      {children}
    </main>
  );
}
