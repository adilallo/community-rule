import type { ReactNode } from "react";
import { notFound } from "next/navigation";

// Development-only previews (e.g. `/components-preview`) — no public chrome.
export default function DevLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <main className="flex-1">{children}</main>;
}
