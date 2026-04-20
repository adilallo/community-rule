import messages from "../../messages/en/index";
import {
  fetchTemplateBySlug,
  type RuleTemplateDto,
} from "./fetchTemplates";

export type LoadTemplateReviewResult =
  | { ok: true; template: RuleTemplateDto }
  | { ok: false; message: string };

/**
 * Shared prelude for the two template-review actions (Customize and
 * "Use without changes") in `CreateFlowLayoutClient`. Wraps the slug →
 * `RuleTemplateDto` fetch and normalizes its three possible failures
 * (network / server / not-found) into a single localized error message
 * suitable for the template-review banner.
 *
 * Keeping the localized copy here (rather than in the fetch layer) means
 * callers only forward `result.message` to `setTemplateReviewApplyError`,
 * and both handlers resolve identical error text from a single source.
 *
 * Malformed template bodies (`body` not an object, missing `sections`,
 * etc.) remain the caller's responsibility because the expected shape
 * differs between Customize (prefill lookup) and Use-without-changes
 * (full section extraction). Those checks stay in the handlers that need
 * them so errors surface at the step where the shape matters.
 */
export async function loadTemplateReviewBySlug(
  slug: string,
): Promise<LoadTemplateReviewResult> {
  const errors = messages.create.templateReview.errors;
  const result = await fetchTemplateBySlug(slug);
  if (result === null) {
    return { ok: false, message: errors.notFound };
  }
  if ("error" in result) {
    const trimmed = typeof result.error === "string" ? result.error.trim() : "";
    return {
      ok: false,
      message: trimmed.length > 0 ? trimmed : errors.applyFailed,
    };
  }
  return { ok: true, template: result };
}
