"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useTranslation } from "../../contexts/MessagesContext";

function CreateFlowLayoutLoading() {
  const t = useTranslation("controlsChrome");
  return (
    <div
      className="flex h-screen min-h-0 flex-col overflow-hidden bg-black"
      aria-busy="true"
      aria-label={t("loadingCreateFlow")}
    />
  );
}

const CreateFlowLayoutClient = dynamic(
  () => import("./CreateFlowLayoutClient"),
  {
    ssr: false,
    loading: () => <CreateFlowLayoutLoading />,
  },
);

export default function CreateFlowLayoutGate({
  children,
}: {
  children: ReactNode;
}) {
  return <CreateFlowLayoutClient>{children}</CreateFlowLayoutClient>;
}
