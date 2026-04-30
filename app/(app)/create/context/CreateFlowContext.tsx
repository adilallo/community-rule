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
  CreateFlowMethodCardFacetSection,
  CreateFlowState,
  CreateFlowContextValue,
  CreateFlowStep,
} from "../types";
import {
  clearAnonymousCreateFlowStorage,
  clearLegacyCreateFlowKeysOnce,
  readAnonymousCreateFlowState,
  writeAnonymousCreateFlowState,
} from "../utils/anonymousDraftStorage";
import { stripCustomRuleSelectionFields } from "../../../../lib/create/stripCustomRuleSelectionFields";
import {
  clearCoreValueDetailsLocalStorage,
  readCoreValueDetailsFromLocalStorage,
  writeCoreValueDetailsToLocalStorage,
} from "../utils/coreValueDetailsLocalStorage";

const CreateFlowContext = createContext<CreateFlowContextValue | null>(null);

interface CreateFlowProviderProps {
  children: ReactNode;
  initialStep?: CreateFlowStep | null;
  /**
   * When true (session resolved, guest or signed-in), mirror in-flight draft to
   * `create-flow-anonymous` in localStorage so refresh / dev-restart never wipes
   * progress. When false, in-memory only (e.g. unit tests, pre-session-resolve).
   *
   * Signed-in users additionally get an explicit "Save & Exit" that PUTs to the
   * server (`useCreateFlowExit`); the server draft is the cross-device snapshot,
   * localStorage is the on-every-keystroke buffer.
   */
  enableLocalDraftMirroring?: boolean;
}

/**
 * Create flow state. All users mirror in-flight state to localStorage when
 * `enableLocalDraftMirroring` is true; signed-in users layer an explicit
 * server-draft snapshot on top via {@link useCreateFlowExit}.
 */
export function CreateFlowProvider({
  children,
  initialStep = null,
  enableLocalDraftMirroring = false,
}: CreateFlowProviderProps) {
  const [state, setState] = useState<CreateFlowState>(() => {
    const base = enableLocalDraftMirroring
      ? readAnonymousCreateFlowState()
      : {};
    const storedDetails = readCoreValueDetailsFromLocalStorage();
    if (Object.keys(storedDetails).length === 0) return base;
    return {
      ...base,
      coreValueDetailsByChipId: {
        ...storedDetails,
        ...(base.coreValueDetailsByChipId ?? {}),
      },
    };
  });
  const [interactionTouched, setInteractionTouched] = useState(false);
  const [currentStep] = useState<CreateFlowStep | null>(initialStep);
  const prevPersistRef = useRef(enableLocalDraftMirroring);
  const persistWriteSkipRef = useRef(true);

  useEffect(() => {
    clearLegacyCreateFlowKeysOnce();
  }, []);

  // Session resolved after initial paint: hydrate from localStorage, merging
  // with anything already in state. We can't bail on `prev` being non-empty:
  // the initializer pre-populates `coreValueDetailsByChipId` from a separate
  // localStorage key, so `prev` is virtually always non-empty here.
  // Merge strategy: `prev` wins for fields the user might have touched between
  // mount and session-resolve; `from` fills in anything else; coreValueDetails
  // is union-merged (prev wins per chip id since it loaded from the dedicated
  // `create-flow-core-value-details` key).
  useEffect(() => {
    if (!enableLocalDraftMirroring) {
      prevPersistRef.current = false;
      return;
    }
    const wasOff = !prevPersistRef.current;
    prevPersistRef.current = true;
    if (!wasOff) return;
    const from = readAnonymousCreateFlowState();
    if (Object.keys(from).length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate local draft when mirroring turns on
    setState((prev) => {
      const merged: CreateFlowState = { ...from, ...prev };
      const fromDetails = from.coreValueDetailsByChipId;
      const prevDetails = prev.coreValueDetailsByChipId;
      if (fromDetails || prevDetails) {
        merged.coreValueDetailsByChipId = {
          ...(fromDetails ?? {}),
          ...(prevDetails ?? {}),
        };
      }
      return merged;
    });
  }, [enableLocalDraftMirroring]);

  useEffect(() => {
    if (!enableLocalDraftMirroring) {
      // Reset so the next OFF→ON transition skips its first write again.
      persistWriteSkipRef.current = true;
      return;
    }
    // Skip the very first write that runs on the same render where mirroring
    // turned ON — the hydrate effect (above) is racing to setState the loaded
    // draft, and writing the still-empty pre-hydrate state here would clobber
    // localStorage. The next render (with the hydrated state) will write
    // normally. Without this guard, drafts get wiped during HMR / any
    // auth-session refetch that re-toggles `enableLocalDraftMirroring`.
    if (persistWriteSkipRef.current) {
      persistWriteSkipRef.current = false;
      return;
    }
    writeAnonymousCreateFlowState(state);
  }, [state, enableLocalDraftMirroring]);

  /** Meaning/signals for core values: survives refresh for signed-in users; merged with anonymous draft when both exist. */
  useEffect(() => {
    writeCoreValueDetailsToLocalStorage(state.coreValueDetailsByChipId);
  }, [state.coreValueDetailsByChipId]);

  const markCreateFlowInteraction = useCallback(() => {
    setInteractionTouched(true);
  }, []);

  const setMethodSectionsPinCommitted = useCallback(
    (section: CreateFlowMethodCardFacetSection, committed: boolean) => {
      setState((prevState) => ({
        ...prevState,
        methodSectionsPinCommitted: {
          ...(prevState.methodSectionsPinCommitted ?? {}),
          [section]: committed,
        },
      }));
    },
    [],
  );

  const updateState = useCallback((updates: Partial<CreateFlowState>) => {
    setState((prevState) => {
      const merged: CreateFlowState = { ...prevState, ...updates };
      if (updates.communityStructureChipSnapshots !== undefined) {
        merged.communityStructureChipSnapshots = {
          ...(prevState.communityStructureChipSnapshots ?? {}),
          ...updates.communityStructureChipSnapshots,
        };
      }
      if (updates.coreValueDetailsByChipId !== undefined) {
        merged.coreValueDetailsByChipId = {
          ...(prevState.coreValueDetailsByChipId ?? {}),
          ...updates.coreValueDetailsByChipId,
        };
      }
      return merged;
    });
  }, []);

  const replaceState = useCallback(
    (next: CreateFlowState | ((prev: CreateFlowState) => CreateFlowState)) => {
      setState(next);
    },
    [],
  );

  const clearState = useCallback(() => {
    setState({});
    setInteractionTouched(false);
    clearAnonymousCreateFlowStorage();
    clearCoreValueDetailsLocalStorage();
  }, []);

  // Keys cleared here match `STRIP_CUSTOM_RULE_SELECTION_STATE_KEYS` from
  // `lib/create/customRuleFacets.ts` (CUSTOM_RULE_FACETS / CR-92).
  const resetCustomRuleSelections = useCallback(() => {
    setState((prev) => stripCustomRuleSelectionFields(prev));
    // Effect on `state.coreValueDetailsByChipId` clears its dedicated
    // localStorage key when the field goes undefined, so we don't need to
    // touch `clearCoreValueDetailsLocalStorage()` directly here.
  }, []);

  const contextValue: CreateFlowContextValue = {
    state,
    currentStep,
    updateState,
    replaceState,
    clearState,
    resetCustomRuleSelections,
    setMethodSectionsPinCommitted,
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
