import type { ReactNode } from "react";

// Development-only previews (e.g. `/components-preview`) — no public chrome.
// Routes here are gated by NODE_ENV checks at the page level.
export default function DevLayout({ children }: { children: ReactNode }) {
  return <main className="flex-1">{children}</main>;
}
