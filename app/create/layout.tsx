import type { ReactNode } from "react";
import CreateFlowLayoutGate from "./CreateFlowLayoutGate";

export default function CreateFlowLayout({ children }: { children: ReactNode }) {
  return <CreateFlowLayoutGate>{children}</CreateFlowLayoutGate>;
}
