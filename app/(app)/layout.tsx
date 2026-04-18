import type { ReactNode } from "react";

// Signed-in product surfaces (`/create/*`, `/login`, `/profile`) intentionally
// run without the marketing footer. Per-route chrome (e.g. CreateFlow's own
// header/footer lockup) is composed in nested layouts.
export default function AppLayout({ children }: { children: ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
