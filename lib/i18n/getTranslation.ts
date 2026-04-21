import type messages from "../../messages/en/index";

type Messages = typeof messages;

/**
 * Helper function to access nested translation keys from messages object
 * This provides a type-safe way to access translations in server components
 * without requiring the next-intl plugin configuration.
 *
 * @param messages - The messages object from messages/en/index
 * @param key - Dot-separated key path (e.g., "heroBanner.title")
 * @returns The translation string or the key if not found
 */
export function getTranslation(messages: Messages, key: string): string {
  const keys = key.split(".");
  let value: unknown = messages;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to key if path not found
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}
