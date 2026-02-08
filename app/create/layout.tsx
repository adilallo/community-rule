"use client";

import type { ReactNode } from "react";
import { CreateFlowProvider } from "./context/CreateFlowContext";

/**
 * Layout for the Create Rule Flow
 * 
 * Provides a full-screen layout without the root layout's TopNav/Footer.
 * This layout wraps all create flow pages and provides the CreateFlowContext.
 */
export default function CreateFlowLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CreateFlowProvider>
      <div className="min-h-screen bg-black flex flex-col">
        {children}
      </div>
    </CreateFlowProvider>
  );
}
