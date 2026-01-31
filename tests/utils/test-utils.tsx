import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MessagesProvider } from "../../app/contexts/MessagesContext";
import messages from "../../messages/en/index";

/**
 * Custom render function that wraps components with MessagesProvider
 * Use this instead of the default render from @testing-library/react
 * for components that use useTranslation hook
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <MessagesProvider messages={messages}>{children}</MessagesProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from @testing-library/react for convenience
export * from "@testing-library/react";
