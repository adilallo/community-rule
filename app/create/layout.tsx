"use client";

import type { ReactNode } from "react";
import { CreateFlowProvider } from "./context/CreateFlowContext";
import CreateFlowTopNav from "../components/utility/CreateFlowTopNav";
import CreateFlowFooter from "../components/utility/CreateFlowFooter";
import Button from "../components/buttons/Button";

/**
 * Layout for the Create Rule Flow
 * 
 * Provides a full-screen layout without the root layout's TopNav/Footer.
 * This layout wraps all create flow pages and provides the CreateFlowContext.
 * Includes the create flow-specific TopNav and Footer components.
 */
export default function CreateFlowLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CreateFlowProvider>
      <div className="min-h-screen bg-black flex flex-col">
        <CreateFlowTopNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <CreateFlowFooter
          secondButton={
            <Button
              buttonType="filled"
              palette="default"
              size="xsmall"
              className="md:!text-[14px] md:!leading-[16px] !text-[12px] !leading-[14px] !px-[var(--spacing-measures-spacing-200,8px)] md:!px-[var(--spacing-measures-spacing-250,10px)] !py-[var(--spacing-measures-spacing-200,8px)] md:!py-[var(--spacing-measures-spacing-250,10px)]"
            >
              Next
            </Button>
          }
        />
      </div>
    </CreateFlowProvider>
  );
}
