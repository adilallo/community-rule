import type { ReactNode } from "react";
import ConditionalNavigation from "../components/navigation/ConditionalNavigation";

// Reads `cr_session` via Server Components on every navigation so the header
// matches the HttpOnly cookie on the first HTML response (no "Log in" flash
// before `/api/auth/session`). Scoped here instead of the root layout so
// `(marketing)` can render statically.
export const dynamic = "force-dynamic";

// Signed-in product surfaces (`/create/*`, `/login`) run without the marketing
// footer. `/profile` adds it via `profile/layout.tsx`. Per-route chrome (e.g.
// CreateFlow) is composed in nested layouts.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ConditionalNavigation />
      <main className="flex-1">{children}</main>
    </>
  );
}
