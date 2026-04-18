import type { ReactNode } from "react";

// Operator/admin dashboards (e.g. `/monitor`) intentionally render without the
// public marketing footer. Auth/access is enforced upstream.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
