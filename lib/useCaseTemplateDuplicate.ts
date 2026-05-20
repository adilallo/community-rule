/** Title for a rule duplicated from a use-case completed demo (profile list). */
export function useCaseTemplateDuplicateTitle(sourceTitle: string): string {
  const trimmed = sourceTitle.trim();
  return trimmed.length > 0
    ? `${trimmed} Template (Copy)`
    : "Community Rule Template (Copy)";
}
