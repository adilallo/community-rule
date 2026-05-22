import type { CommunityRuleSection } from "../../../../../components/type/CommunityRule/CommunityRule.types";
import type { UseCaseDetailSlug } from "../../../../../../lib/useCaseSyntheticPost";
import type { UseCaseCompletedRuleFixture } from "../../../../../../lib/useCaseCompletedRule";
import type { UseCaseCompletedRuleActionBanner } from "./useUseCaseCompletedRuleActions";

export type UseCaseCompletedRuleProps = {
  slug: UseCaseDetailSlug;
  fixture: UseCaseCompletedRuleFixture;
  sections: CommunityRuleSection[];
};

export type UseCaseCompletedRuleViewProps = UseCaseCompletedRuleProps & {
  mdUp: boolean;
  duplicateLabel: string;
  duplicateAriaLabel: string;
  exitLabel: string;
  shareModalOpen: boolean;
  onShareOpen: () => void;
  onShareClose: () => void;
  onCopyLink: () => void;
  onEmailShare: () => void;
  onDuplicate: () => void;
  onExit: () => void;
  actionBanner: UseCaseCompletedRuleActionBanner | null;
  onActionBannerClose: () => void;
};
