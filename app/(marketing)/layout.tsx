import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// Site footer is part of the public marketing chrome only — not rendered for
// signed-in product surfaces, admin dashboards, or dev previews. See
// `.cursor/rules/routes.mdc` for the full chrome composition map.
const Footer = dynamic(() => import("../components/navigation/Footer"), {
  loading: () => (
    <footer className="bg-[var(--color-surface-default-primary)] w-full min-h-[200px]" />
  ),
  ssr: true,
});

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
