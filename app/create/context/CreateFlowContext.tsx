"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  CreateFlowState,
  CreateFlowContextValue,
  CreateFlowStep,
} from "../types";

const CreateFlowContext = createContext<CreateFlowContextValue | null>(null);

interface CreateFlowProviderProps {
  children: ReactNode;
  initialStep?: CreateFlowStep | null;
}

/**
 * Provider component for Create Flow state management
 * 
 * This is a basic implementation that will be expanded in CR-56
 * with full navigation logic, state persistence, and validation.
 */
export function CreateFlowProvider({
  children,
  initialStep = null,
}: CreateFlowProviderProps) {
  const [state, setState] = useState<CreateFlowState>({});
  const [currentStep] = useState<CreateFlowStep | null>(
    initialStep,
  );

  const updateState = (updates: Partial<CreateFlowState>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };

  const contextValue: CreateFlowContextValue = {
    state,
    currentStep,
    updateState,
  };

  return (
    <CreateFlowContext.Provider value={contextValue}>
      {children}
    </CreateFlowContext.Provider>
  );
}

/**
 * Hook to access Create Flow context
 * 
 * @throws Error if used outside CreateFlowProvider
 * @returns CreateFlowContextValue
 */
export function useCreateFlow(): CreateFlowContextValue {
  const context = useContext(CreateFlowContext);
  if (!context) {
    throw new Error("useCreateFlow must be used within CreateFlowProvider");
  }
  return context;
}
