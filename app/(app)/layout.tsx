import { Suspense, type ReactNode } from "react";
import ConditionalNavigation from "../components/navigation/ConditionalNavigation";
import { MessagesProvider } from "../contexts/MessagesContext";
import { AuthModalProvider } from "../contexts/AuthModalContext";
import messages from "../../messages/en/index";

// `force-dynamic` removed in favor of `experimental.cacheComponents` (Next 16).
// `ConditionalNavigation` reads `cr_session` server-side (and `usePathname()`
// transitively in `ConditionalNavigationClient`) — both are uncached, so it
// lives behind a `<Suspense>` boundary so the rest of the layout stays in the
// static shell while the session/pathname-aware nav streams in. The fallback
// is `null` because any non-null fallback would also need to live in the
// static shell, and the nav's chromeless decision depends on the pathname
// (e.g. `/create/*` and `/login` render no top-nav). Brief blank-nav while
// the dynamic island resolves is acceptable on signed-in product surfaces.
//
// Signed-in product surfaces (`/create/*`, `/login`) run without the marketing
// footer. `/profile` adds it via `profile/layout.tsx`. Per-route chrome (e.g.
// CreateFlow) is composed in nested layouts.
export default function AppLayout({ children }: { children: ReactNode }) {
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
