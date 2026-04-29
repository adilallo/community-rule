import dynamic from "next/dynamic";
import type { ReactNode } from "react";

/** Profile uses the public marketing footer; other `(app)` routes stay footer-free. */
const Footer = dynamic(() => import("../../components/navigation/Footer"), {
  loading: () => (
    <footer className="w-full min-h-[200px] bg-[var(--color-surface-default-primary)]" />
  ),
  ssr: true,
});

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
