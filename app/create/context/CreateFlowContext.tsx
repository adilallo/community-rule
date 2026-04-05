"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  CreateFlowState,
  CreateFlowContextValue,
  CreateFlowStep,
} from "../types";

const CreateFlowContext = createContext<CreateFlowContextValue | null>(null);

const STORAGE_KEY = "create-flow-state";
const DRAFT_STORAGE_KEY = "create-flow-draft";

function readStateFromStorage(key: string): CreateFlowState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CreateFlowState;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStateToStorage(key: string, value: CreateFlowState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors (e.g. quota, private mode)
  }
}

function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

interface CreateFlowProviderProps {
  children: ReactNode;
  initialStep?: CreateFlowStep | null;
}

/**
 * Provider component for Create Flow state management
 *
 * Manages flow state with optional localStorage persistence and draft support.
 */
export function CreateFlowProvider({
  children,
  initialStep = null,
}: CreateFlowProviderProps) {
  const [state, setState] = useState<CreateFlowState>(() =>
    readStateFromStorage(STORAGE_KEY),
  );
  const [currentStep] = useState<CreateFlowStep | null>(initialStep);

  useEffect(() => {
    writeStateToStorage(STORAGE_KEY, state);
  }, [state]);

  const updateState = useCallback((updates: Partial<CreateFlowState>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  }, []);

  const replaceState = useCallback((next: CreateFlowState) => {
    setState(next);
    writeStateToStorage(STORAGE_KEY, next);
  }, []);

  const clearState = useCallback(() => {
    setState({});
    removeFromStorage(STORAGE_KEY);
    removeFromStorage(DRAFT_STORAGE_KEY);
  }, []);

  const contextValue: CreateFlowContextValue = {
    state,
    currentStep,
    updateState,
    replaceState,
    clearState,
  };

  return (
    <CreateFlowContext.Provider value={contextValue}>
      {children}
    </CreateFlowContext.Provider>
  );
}

/** Save current state as draft (e.g. on "Save & Exit"). Stub for CR-57. */
export function saveCreateFlowDraft(state: CreateFlowState): void {
  writeStateToStorage(DRAFT_STORAGE_KEY, state);
}

/** Load draft state if present. Caller can merge into initial state when entering flow. */
export function loadCreateFlowDraft(): CreateFlowState {
  return readStateFromStorage(DRAFT_STORAGE_KEY);
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
