import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { AuthModalProvider } from "../../app/contexts/AuthModalContext";
import { MessagesProvider } from "../../app/contexts/MessagesContext";
import { CreateFlowProvider } from "../../app/(app)/create/context/CreateFlowContext";
import messages from "../../messages/en/index";

/**
 * Custom render function: MessagesProvider, AuthModalProvider (`Top` login), CreateFlowProvider.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MessagesProvider messages={messages}>
        <AuthModalProvider>
          <CreateFlowProvider>{children}</CreateFlowProvider>
        </AuthModalProvider>
      </MessagesProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from @testing-library/react for convenience
export * from "@testing-library/react";
