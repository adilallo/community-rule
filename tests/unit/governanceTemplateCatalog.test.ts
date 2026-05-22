import { describe, expect, it } from "vitest";
import {
  GOVERNANCE_TEMPLATE_CATALOG,
  GOVERNANCE_TEMPLATE_HOME_SLUGS,
  getGovernanceTemplatesForHome,
} from "../../lib/templates/governanceTemplateCatalog";

/**
 * Figma Community-Rule-System node 21764-16435 — Card / Rule template surfaces.
 * Token names and hex fallbacks from Dev Mode (May 2026).
 */
const FIGMA_TEMPLATE_SURFACE_BY_SLUG: Record<string, string> = {
  consensus: "--color-surface-invert-positive-secondary",
  "consensus-clusters": "--color-surface-invert-brand-teal",
  "solidarity-network": "--color-surface-invert-positive-primary",
  "sortition-jury": "--color-surface-invert-brand-lavender",
  "liquid-democracy": "--color-surface-invert-brand-kiwi",
  "do-ocracy": "--color-surface-invert-brand-royal",
  "quadratic-governance": "--color-surface-invert-brand-secondary",
  "federated-clusters": "--color-surface-invert-brand-primary",
  devolution: "--color-surface-invert-negative-secondary",
  "benevolent-dictator": "--color-surface-invert-negative-primary",
  petition: "--color-surface-invert-brand-teal",
  "self-appointed-board": "--color-surface-invert-brand-rust",
  "elected-board": "--color-surface-invert-warning-secondary",
};

describe("governanceTemplateCatalog (Figma 21764-16435)", () => {
  it("maps every catalog slug to the Figma invert surface token", () => {
    for (const entry of GOVERNANCE_TEMPLATE_CATALOG) {
      const expected = FIGMA_TEMPLATE_SURFACE_BY_SLUG[entry.slug];
      expect(expected, `missing Figma mapping for ${entry.slug}`).toBeTruthy();
      expect(entry.backgroundColor).toBe(`bg-[var(${expected})]`);
    }
  });

  it("covers all thirteen Figma template variants", () => {
    expect(GOVERNANCE_TEMPLATE_CATALOG).toHaveLength(13);
    expect(Object.keys(FIGMA_TEMPLATE_SURFACE_BY_SLUG)).toHaveLength(13);
  });

  it("orders the home RuleStack row per Figma 22083-855584", () => {
    expect([...GOVERNANCE_TEMPLATE_HOME_SLUGS]).toEqual([
      "consensus",
      "do-ocracy",
      "devolution",
      "quadratic-governance",
    ]);
    expect(getGovernanceTemplatesForHome()).toHaveLength(4);
  });
});
