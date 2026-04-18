"use client";

import { createContext, useContext, type ReactNode } from "react";
import type messages from "../../messages/en/index";
import { getTranslation } from "../../lib/i18n/getTranslation";

type Messages = typeof messages;

const MessagesContext = createContext<Messages | null>(null);

interface MessagesProviderProps {
  messages: Messages;
  children: ReactNode;
}

export function MessagesProvider({
  messages,
  children,
}: MessagesProviderProps) {
  return (
    <MessagesContext.Provider value={messages}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages(): Messages {
  const messages = useContext(MessagesContext);
  if (!messages) {
    throw new Error("useMessages must be used within MessagesProvider");
  }
  return messages;
}

/**
 * Custom translation hook for client components
 * @param namespace - Optional namespace to scope translations (e.g., "footer")
 * @returns Translation function that accepts a key and returns the translated string
 */
export function useTranslation(namespace?: string) {
  const messages = useMessages();

  return (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return getTranslation(messages, fullKey);
  };
}
