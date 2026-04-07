"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  CreateFlowState,
  CreateFlowContextValue,
  CreateFlowStep,
} from "../types";
import {
  clearAnonymousCreateFlowStorage,
  clearLegacyCreateFlowKeysOnce,
  readAnonymousCreateFlowState,
  writeAnonymousCreateFlowState,
} from "../anonymousDraftStorage";

const CreateFlowContext = createContext<CreateFlowContextValue | null>(null);

interface CreateFlowProviderProps {
  children: ReactNode;
  initialStep?: CreateFlowStep | null;
  /**
   * When true (signed-out, session resolved), load/sync `create-flow-anonymous` in localStorage.
   * When false, in-memory only (authenticated fresh create).
   */
  enableAnonymousPersistence?: boolean;
}

/**
 * Create flow state. Anonymous users mirror state to localStorage; authenticated users stay in memory.
 */
export function CreateFlowProvider({
  children,
  initialStep = null,
  enableAnonymousPersistence = false,
}: CreateFlowProviderProps) {
  const [state, setState] = useState<CreateFlowState>(() =>
    enableAnonymousPersistence ? readAnonymousCreateFlowState() : {},
  );
  const [interactionTouched, setInteractionTouched] = useState(false);
  const [currentStep] = useState<CreateFlowStep | null>(initialStep);
  const prevPersistRef = useRef(enableAnonymousPersistence);

  useEffect(() => {
    clearLegacyCreateFlowKeysOnce();
  }, []);

  // Session resolved as guest after initial paint: hydrate from localStorage if still empty.
  useEffect(() => {
    if (!enableAnonymousPersistence) {
      prevPersistRef.current = false;
      return;
    }
    const wasOff = !prevPersistRef.current;
    prevPersistRef.current = true;
    if (!wasOff) return;
    const from = readAnonymousCreateFlowState();
    if (Object.keys(from).length === 0) return;
    setState((prev) =>
      Object.keys(prev).length > 0 ? prev : { ...from },
    );
  }, [enableAnonymousPersistence]);

  useEffect(() => {
    if (!enableAnonymousPersistence) return;
    writeAnonymousCreateFlowState(state);
  }, [state, enableAnonymousPersistence]);

  const markCreateFlowInteraction = useCallback(() => {
    setInteractionTouched(true);
  }, []);

  const updateState = useCallback((updates: Partial<CreateFlowState>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  }, []);

  const replaceState = useCallback((next: CreateFlowState) => {
    setState(next);
  }, []);

  const clearState = useCallback(() => {
    setState({});
    setInteractionTouched(false);
    clearAnonymousCreateFlowStorage();
  }, []);

  const contextValue: CreateFlowContextValue = {
    state,
    currentStep,
    updateState,
    replaceState,
    clearState,
    interactionTouched,
    markCreateFlowInteraction,
  };

  return (
    <CreateFlowContext.Provider value={contextValue}>
      {children}
    </CreateFlowContext.Provider>
  );
}

export function useCreateFlow(): CreateFlowContextValue {
  const context = useContext(CreateFlowContext);
  if (!context) {
    throw new Error("useCreateFlow must be used within CreateFlowProvider");
  }
  return context;
}
