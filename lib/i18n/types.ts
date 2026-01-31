/**
 * Type definitions for translation keys
 *
 * These types provide type safety when accessing translation keys.
 * The actual types are inferred from the JSON files in messages/en/
 */

// Import the message structure to ensure type safety
import type messages from "../../messages/en/index";

export type Messages = typeof messages;

// Helper type for nested key paths
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Type for all possible translation keys
export type TranslationKey = NestedKeyOf<Messages>;
