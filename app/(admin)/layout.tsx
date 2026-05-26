import type { ReactNode } from "react";
import ConditionalNavigation from "../components/navigation/ConditionalNavigation";

// Reads the session for admin chrome (matches the HttpOnly cookie on first
// HTML response). Scoped here so `(marketing)` can render statically.
export const dynamic = "force-dynamic";

// Operator/admin dashboards (e.g. `/monitor`) intentionally render without the
// public marketing footer. Auth/access is enforced upstream.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ConditionalNavigation />
      <main className="flex-1">{children}</main>
    </>
  );
}
