import type { ReactNode } from "react";
import { MessagesProvider } from "../contexts/MessagesContext";
import { AuthModalProvider } from "../contexts/AuthModalContext";
import marketingMessages from "../../messages/en/marketing";

/** Full-viewport case-study surfaces (completed rule demos) — no marketing footer. */
export default function MarketingCaseStudyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MessagesProvider messages={marketingMessages}>
      <AuthModalProvider>
        <main className="flex h-dvh min-h-0 flex-col overflow-hidden">
          {children}
        </main>
      </AuthModalProvider>
    </MessagesProvider>
  );
}
