import type { ReactNode } from "react";

export const CASE_STUDY_SURFACE_OPTIONS = ["lavender", "neutral", "rose"] as const;

export type CaseStudySurfaceValue = (typeof CASE_STUDY_SURFACE_OPTIONS)[number];

export interface CaseStudyProps {
  surface: CaseStudySurfaceValue;
  /**
   * Alt text for built-in SVG art (`public/assets/case-study/`) when **`visual`** is omitted.
   */
  imageAlt?: string;
  /** Overrides built-in artwork with custom slot content when provided. */
  visual?: ReactNode;
  className?: string;
}
