import type { ReactNode } from "react";

// Signed-in product surfaces (`/create/*`, `/login`) run without the marketing
// footer. `/profile` adds it via `profile/layout.tsx`. Per-route chrome (e.g.
// CreateFlow) is composed in nested layouts.
export default function AppLayout({ children }: { children: ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
