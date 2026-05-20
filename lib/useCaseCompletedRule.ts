import type { CommunityRuleSection } from "../app/components/type/CommunityRule/CommunityRule.types";
import { parsePublishedDocumentForCommunityRuleDisplay } from "./create/publishedDocumentToDisplaySections";
import type useCasesCompletedRules from "../messages/en/pages/useCasesCompletedRules.json";
import {
  isUseCaseDetailSlug,
  useCaseContentKeyForSlug,
  type UseCaseDetailSlug,
} from "./useCaseSyntheticPost";

export type UseCasesCompletedRulesMessages = typeof useCasesCompletedRules;

export type UseCaseCompletedRuleFixture =
  UseCasesCompletedRulesMessages[keyof UseCasesCompletedRulesMessages];

export function getUseCaseCompletedRuleFixture(
  slug: UseCaseDetailSlug,
  completedRules: UseCasesCompletedRulesMessages,
): UseCaseCompletedRuleFixture {
  const contentKey = useCaseContentKeyForSlug(slug);
  return completedRules[contentKey];
}

export function buildUseCaseCompletedRuleSections(
  fixture: UseCaseCompletedRuleFixture,
): CommunityRuleSection[] {
  return parsePublishedDocumentForCommunityRuleDisplay(fixture.document);
}

export function resolveUseCaseCompletedRule(
  slug: string,
  completedRules: UseCasesCompletedRulesMessages,
):
  | {
      slug: UseCaseDetailSlug;
      fixture: UseCaseCompletedRuleFixture;
      sections: CommunityRuleSection[];
    }
  | null {
  if (!isUseCaseDetailSlug(slug)) {
    return null;
  }
  const fixture = getUseCaseCompletedRuleFixture(slug, completedRules);
  const sections = buildUseCaseCompletedRuleSections(fixture);
  if (sections.length === 0) {
    return null;
  }
  return {
    slug,
    fixture,
    sections,
  };
}
