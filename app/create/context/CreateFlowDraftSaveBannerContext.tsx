"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CreateFlowDraftSaveBannerContextValue = {
  draftSaveBannerMessage: string | null;
  setDraftSaveBannerMessage: (_message: string | null) => void;
};

const CreateFlowDraftSaveBannerContext =
  createContext<CreateFlowDraftSaveBannerContextValue | null>(null);

export function CreateFlowDraftSaveBannerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [draftSaveBannerMessage, setDraftSaveBannerMessage] = useState<
    string | null
  >(null);

  const value = useMemo(
    () => ({
      draftSaveBannerMessage,
      setDraftSaveBannerMessage,
    }),
    [draftSaveBannerMessage],
  );

  return (
    <CreateFlowDraftSaveBannerContext.Provider value={value}>
      {children}
    </CreateFlowDraftSaveBannerContext.Provider>
  );
}

export function useCreateFlowDraftSaveBanner(): CreateFlowDraftSaveBannerContextValue {
  const ctx = useContext(CreateFlowDraftSaveBannerContext);
  if (!ctx) {
    throw new Error(
      "useCreateFlowDraftSaveBanner must be used within CreateFlowDraftSaveBannerProvider",
    );
  }
  return ctx;
}
