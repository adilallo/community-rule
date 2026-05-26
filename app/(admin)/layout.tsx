import { Suspense, type ReactNode } from "react";
import ConditionalNavigation from "../components/navigation/ConditionalNavigation";
import { MessagesProvider } from "../contexts/MessagesContext";
import { AuthModalProvider } from "../contexts/AuthModalContext";
import messages from "../../messages/en/index";

// `force-dynamic` removed in favor of `experimental.cacheComponents` (Next 16).
// See `(app)/layout.tsx` for the matching `<Suspense fallback={null}>` rationale
// — the fallback can't access `usePathname()` since it sits in the static shell.
//
// Operator/admin dashboards (e.g. `/monitor`) intentionally render without the
// public marketing footer. Auth/access is enforced upstream.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <MessagesProvider messages={messages}>
      <AuthModalProvider>
        <Suspense fallback={null}>
          <ConditionalNavigation />
        </Suspense>
        <main className="flex-1">{children}</main>
      </AuthModalProvider>
    </MessagesProvider>
  );
}
