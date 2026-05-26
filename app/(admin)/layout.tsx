import type { ReactNode } from "react";
import ConditionalNavigation from "../components/navigation/ConditionalNavigation";
import { MessagesProvider } from "../contexts/MessagesContext";
import { AuthModalProvider } from "../contexts/AuthModalContext";
import messages from "../../messages/en/index";

// Reads the session for admin chrome (matches the HttpOnly cookie on first
// HTML response). Scoped here so `(marketing)` can render statically.
export const dynamic = "force-dynamic";

// Operator/admin dashboards (e.g. `/monitor`) intentionally render without the
// public marketing footer. Auth/access is enforced upstream.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <MessagesProvider messages={messages}>
      <AuthModalProvider>
        <ConditionalNavigation />
        <main className="flex-1">{children}</main>
      </AuthModalProvider>
    </MessagesProvider>
  );
}
