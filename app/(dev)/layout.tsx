import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { MessagesProvider } from "../contexts/MessagesContext";
import { AuthModalProvider } from "../contexts/AuthModalContext";
import messages from "../../messages/en/index";

// Development-only previews (e.g. `/components-preview`) — no public chrome.
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return (
    <MessagesProvider messages={messages}>
      <AuthModalProvider>
        <main className="flex-1">{children}</main>
      </AuthModalProvider>
    </MessagesProvider>
  );
}
