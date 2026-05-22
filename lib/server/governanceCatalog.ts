/**
 * Public catalog DTOs for built-in governance methods and core values (CR-115).
 * Source of truth: `messages/en/create/customRule/*.json` (English v1).
 */

import communicationMessages from "../../messages/en/create/customRule/communication.json";
import conflictManagementMessages from "../../messages/en/create/customRule/conflictManagement.json";
import coreValuesMessages from "../../messages/en/create/customRule/coreValues.json";
import decisionApproachesMessages from "../../messages/en/create/customRule/decisionApproaches.json";
import membershipMessages from "../../messages/en/create/customRule/membership.json";
import type { MethodFacetApiSectionId } from "../create/customRuleFacets";

export type CatalogMethodDto = {
  /** Stable id — same as `methods[].id` in messages and `MethodFacet.slug`. */
  slug: string;
  label: string;
  /** Card copy from messages `supportText`. */
  description: string;
  /** Section-specific modal blocks from messages `sections`. */
  sections: Record<string, unknown>;
};

export type CatalogCoreValueDto = {
  /** 1-based position in `coreValues.json` (`"1"`, `"2"`, …). */
  id: string;
  label: string;
  meaning: string;
  signals: string;
};

export type CatalogSectionId = MethodFacetApiSectionId | "coreValues";

type MethodMessagesSource = {
  methods?: unknown;
};

const METHOD_MESSAGES_BY_SECTION: Record<MethodFacetApiSectionId, unknown> = {
  communication: communicationMessages,
  membership: membershipMessages,
  decisionApproaches: decisionApproachesMessages,
  conflictManagement: conflictManagementMessages,
};

function readMethodRows(source: unknown): Array<{
  id: string;
  label: string;
  supportText?: string;
  sections?: Record<string, unknown>;
}> {
  if (!source || typeof source !== "object") return [];
  const methods = (source as MethodMessagesSource).methods;
  if (!Array.isArray(methods)) return [];
  const out: Array<{
    id: string;
    label: string;
    supportText?: string;
    sections?: Record<string, unknown>;
  }> = [];
  for (const raw of methods) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.label !== "string") continue;
    out.push({
      id: o.id,
      label: o.label,
      supportText:
        typeof o.supportText === "string" ? o.supportText : undefined,
      sections:
        o.sections && typeof o.sections === "object"
          ? (o.sections as Record<string, unknown>)
          : undefined,
    });
  }
  return out;
}

function rowToCatalogMethod(row: {
  id: string;
  label: string;
  supportText?: string;
  sections?: Record<string, unknown>;
}): CatalogMethodDto {
  return {
    slug: row.id,
    label: row.label,
    description: row.supportText ?? "",
    sections: row.sections ?? {},
  };
}

/** All built-in methods for a card-deck section, in messages authoring order. */
export function listCatalogMethods(
  section: MethodFacetApiSectionId,
): CatalogMethodDto[] {
  return readMethodRows(METHOD_MESSAGES_BY_SECTION[section]).map(
    rowToCatalogMethod,
  );
}

export function getCatalogMethod(
  section: MethodFacetApiSectionId,
  slug: string,
): CatalogMethodDto | null {
  const row = readMethodRows(METHOD_MESSAGES_BY_SECTION[section]).find(
    (r) => r.id === slug,
  );
  return row ? rowToCatalogMethod(row) : null;
}

/** All preset core values, in `coreValues.json` order (ids `"1"` … `"n"`). */
export function listCatalogCoreValues(): CatalogCoreValueDto[] {
  const values = (coreValuesMessages as { values?: unknown }).values;
  if (!Array.isArray(values)) return [];
  const out: CatalogCoreValueDto[] = [];
  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    const id = String(i + 1);
    if (typeof row === "string") {
      out.push({ id, label: row, meaning: "", signals: "" });
      continue;
    }
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    if (typeof o.label !== "string") continue;
    out.push({
      id,
      label: o.label,
      meaning: typeof o.meaning === "string" ? o.meaning : "",
      signals: typeof o.signals === "string" ? o.signals : "",
    });
  }
  return out;
}

export function getCatalogCoreValue(id: string): CatalogCoreValueDto | null {
  return listCatalogCoreValues().find((v) => v.id === id) ?? null;
}

/** Slugs for parity tests — same set as messages `methods[].id`. */
export function catalogMethodSlugsForSection(
  section: MethodFacetApiSectionId,
): string[] {
  return listCatalogMethods(section).map((m) => m.slug);
}
