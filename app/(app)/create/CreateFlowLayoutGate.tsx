"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const CreateFlowLayoutClient = dynamic(
  () => import("./CreateFlowLayoutClient"),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-screen min-h-0 flex-col overflow-hidden bg-black"
        aria-busy="true"
        aria-label="Loading create flow"
      />
    ),
  },
);

export default function CreateFlowLayoutGate({
  children,
}: {
  children: ReactNode;
}) {
  return <CreateFlowLayoutClient>{children}</CreateFlowLayoutClient>;
}
