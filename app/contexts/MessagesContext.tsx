"use client";

import { createContext, useContext, type ReactNode } from "react";
import type messages from "../../messages/en/index";

type Messages = typeof messages;

const MessagesContext = createContext<Messages | null>(null);

interface MessagesProviderProps {
  messages: Messages;
  children: ReactNode;
}

export function MessagesProvider({ messages, children }: MessagesProviderProps) {
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
 * Get a translation value from messages using dot notation
 * @param messages - The messages object
 * @param key - Dot-separated key path (e.g., "heroBanner.title")
 * @returns The translation string or the key if not found
 */
function getTranslationValue(messages: Messages, key: string): string {
  const keys = key.split(".");
  let value: any = messages;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k as keyof typeof value];
    } else {
      return key; // Fallback to key if path not found
    }
  }

  return typeof value === "string" ? value : key;
}

/**
 * Custom translation hook for client components
 * @param namespace - Optional namespace to scope translations (e.g., "footer")
 * @returns Translation function that accepts a key and returns the translated string
 */
export function useTranslation(namespace?: string) {
  const messages = useMessages();

  return (key: string): string => {
    if (namespace) {
      // If namespace is provided, prepend it to the key
      const fullKey = `${namespace}.${key}`;
      return getTranslationValue(messages, fullKey);
    }
    return getTranslationValue(messages, key);
  };
}
