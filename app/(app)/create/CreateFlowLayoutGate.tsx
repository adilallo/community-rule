import type { ReactNode } from "react";
import CreateFlowLayoutClient from "./CreateFlowLayoutClient";

/**
 * Server-renders the create-flow chrome shell so users see real layout instead
 * of a black `aria-busy` div while the client bundle hydrates. The provider
 * inside `CreateFlowLayoutClient` defers `localStorage` reads to a mount-once
 * effect so SSR + first client render align.
 */
export default function CreateFlowLayoutGate({
  children,
}: {
  children: ReactNode;
}) {
  return <CreateFlowLayoutClient>{children}</CreateFlowLayoutClient>;
}
