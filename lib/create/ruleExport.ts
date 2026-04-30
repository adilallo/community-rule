import { jsPDF } from "jspdf";

import type {
  CommunityRuleEntry,
  CommunityRuleSection,
} from "../../app/components/type/CommunityRule/CommunityRule.types";
import type { StoredLastPublishedRule } from "./lastPublishedRule";
import { parsePublishedDocumentForCommunityRuleDisplay } from "./publishedDocumentToDisplaySections";

export function buildPublicRuleUrl(origin: string, ruleId: string): string {
  const base = origin.replace(/\/$/, "");
  return `${base}/rules/${encodeURIComponent(ruleId)}`;
}

/** Safe filename fragment from rule title, with stable fallback. */
export function exportFilenameBase(rule: StoredLastPublishedRule): string {
  const fromTitle = rule.title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return fromTitle.length > 0 ? fromTitle : `rule-${rule.id.slice(0, 8)}`;
}

function entryToMarkdown(entry: CommunityRuleEntry): string {
  const lines: string[] = [`### ${entry.title}`, ""];
  if (entry.blocks && entry.blocks.length > 0) {
    for (const b of entry.blocks) {
      lines.push(`#### ${b.label}`, "", b.body, "");
    }
  } else {
    const body = (entry.body ?? "").trim();
    if (body.length > 0) {
      const paras = body.split(/\n\s*\n/);
      for (const p of paras) {
        const t = p.trim();
        if (t.length > 0) lines.push(t, "");
      }
    }
  }
  return lines.join("\n").trimEnd();
}

export function sectionsToMarkdown(
  title: string,
  summary: string | null | undefined,
  sections: CommunityRuleSection[],
): string {
  const parts: string[] = [`# ${title}`, ""];
  const sum = typeof summary === "string" ? summary.trim() : "";
  if (sum.length > 0) {
    parts.push(sum, "");
  }
  for (const sec of sections) {
    parts.push(`## ${sec.categoryName}`, "");
    for (const ent of sec.entries) {
      parts.push(entryToMarkdown(ent), "");
    }
  }
  return `${parts.join("\n").trimEnd()}\n`;
}

function escapeCsvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Tabular snapshot of parsed rule content (RFC 4180-style; UTF-8 with BOM when downloaded). */
export function sectionsToCsv(
  title: string,
  summary: string | null | undefined,
  sections: CommunityRuleSection[],
): string {
  const rows: string[][] = [
    ["Section", "Entry", "Block label", "Content"],
    ["", "Title", "", title],
  ];
  const sum = typeof summary === "string" ? summary.trim() : "";
  if (sum.length > 0) {
    rows.push(["", "Summary", "", sum]);
  }
  for (const sec of sections) {
    for (const ent of sec.entries) {
      if (ent.blocks && ent.blocks.length > 0) {
        for (const b of ent.blocks) {
          rows.push([sec.categoryName, ent.title, b.label, b.body]);
        }
      } else {
        rows.push([sec.categoryName, ent.title, "", ent.body ?? ""]);
      }
    }
  }
  return `${rows.map((r) => r.map(escapeCsvCell).join(",")).join("\n")}\n`;
}

export function exportStoredRuleAsMarkdown(rule: StoredLastPublishedRule): string {
  const sections = parsePublishedDocumentForCommunityRuleDisplay(rule.document);
  if (sections.length === 0) {
    throw new Error("exportEmptyDocument");
  }
  return sectionsToMarkdown(rule.title, rule.summary, sections);
}

export function exportStoredRuleAsCsv(rule: StoredLastPublishedRule): string {
  const sections = parsePublishedDocumentForCommunityRuleDisplay(rule.document);
  if (sections.length === 0) {
    throw new Error("exportEmptyDocument");
  }
  return `\uFEFF${sectionsToCsv(rule.title, rule.summary, sections)}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphsHtml(text: string): string {
  const paras = text
    .trim()
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0);
  if (paras.length === 0) return "";
  return paras
    .map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

function entryToPrintHtml(entry: CommunityRuleEntry): string {
  let inner = "";
  if (entry.blocks && entry.blocks.length > 0) {
    for (const b of entry.blocks) {
      inner += `<h4 class="block-label">${escapeHtml(b.label)}</h4>`;
      inner += paragraphsHtml(b.body);
    }
  } else {
    inner += paragraphsHtml(entry.body ?? "");
  }
  return `<article class="entry"><h3>${escapeHtml(entry.title)}</h3>${inner}</article>`;
}

/** Full HTML document for static preview or tests; PDF export uses {@link sectionsToPdfBlob}. */
export function buildPrintableRuleHtmlDocument(
  title: string,
  summary: string | null | undefined,
  sections: CommunityRuleSection[],
): string {
  const sum = typeof summary === "string" ? summary.trim() : "";
  const summaryBlock =
    sum.length > 0 ? `<div class="summary">${paragraphsHtml(sum)}</div>` : "";
  const body = sections
    .map(
      (sec) =>
        `<section><h2>${escapeHtml(sec.categoryName)}</h2>${sec.entries.map(entryToPrintHtml).join("\n")}</section>`,
    )
    .join("\n");
  const styles = `body{font-family:system-ui,sans-serif;line-height:1.5;margin:2rem auto;max-width:48rem;padding:0 1rem;color:#111;background:#fff}h1{font-size:1.75rem;margin-bottom:.5rem}h2{font-size:1.25rem;margin-top:1.5rem;margin-bottom:.75rem;border-bottom:1px solid #ccc}h3{font-size:1.05rem;margin-top:1rem}h4.block-label{font-size:.95rem;font-weight:600;margin-top:.75rem;margin-bottom:.25rem}p{margin:0 0 .75rem}.summary{color:#333;margin-bottom:1.25rem}@media print{body{margin:0;max-width:none}h2,h3{break-after:avoid}}`;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title><style>${styles}</style></head><body><h1>${escapeHtml(title)}</h1>${summaryBlock}${body}</body></html>`;
}

function splitDisplayParagraphs(text: string): string[] {
  return text
    .trim()
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0)
    .map((p) => p.trim());
}

/**
 * Same section structure as {@link buildPrintableRuleHtmlDocument}; renders a
 * simple multi-page PDF (Helvetica, headings + wrapped body text).
 */
export function sectionsToPdfBlob(
  title: string,
  summary: string | null | undefined,
  sections: CommunityRuleSection[],
): Blob {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const margin = 20;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - 2 * margin;
  let y = margin;

  function ensureSpace(h: number): void {
    if (y + h > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  {
    const lines = doc.splitTextToSize(title, maxW);
    const dim = doc.getTextDimensions(lines.join("\n"), { maxWidth: maxW });
    ensureSpace(dim.h + 4);
    doc.text(lines, margin, y);
    y += dim.h + 6;
  }

  const sum = typeof summary === "string" ? summary.trim() : "";
  if (sum.length > 0) {
    for (const p of splitDisplayParagraphs(sum)) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(p, maxW);
      const dim = doc.getTextDimensions(lines.join("\n"), { maxWidth: maxW });
      ensureSpace(dim.h + 2);
      doc.text(lines, margin, y);
      y += dim.h + 3;
    }
    y += 2;
  }

  for (const sec of sections) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    {
      const lines = doc.splitTextToSize(sec.categoryName, maxW);
      const dim = doc.getTextDimensions(lines.join("\n"), { maxWidth: maxW });
      ensureSpace(dim.h + 3);
      doc.text(lines, margin, y);
      y += dim.h + 5;
    }

    for (const ent of sec.entries) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      {
        const lines = doc.splitTextToSize(ent.title, maxW);
        const dim = doc.getTextDimensions(lines.join("\n"), { maxWidth: maxW });
        ensureSpace(dim.h + 2);
        doc.text(lines, margin, y);
        y += dim.h + 3;
      }

      if (ent.blocks && ent.blocks.length > 0) {
        for (const b of ent.blocks) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          {
            const lines = doc.splitTextToSize(b.label, maxW);
            const dim = doc.getTextDimensions(lines.join("\n"), {
              maxWidth: maxW,
            });
            ensureSpace(dim.h + 1);
            doc.text(lines, margin, y);
            y += dim.h + 2;
          }
          for (const p of splitDisplayParagraphs(b.body)) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            const lines = doc.splitTextToSize(p, maxW);
            const dim = doc.getTextDimensions(lines.join("\n"), {
              maxWidth: maxW,
            });
            ensureSpace(dim.h + 1);
            doc.text(lines, margin, y);
            y += dim.h + 2;
          }
        }
      } else {
        for (const p of splitDisplayParagraphs(ent.body ?? "")) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          const lines = doc.splitTextToSize(p, maxW);
          const dim = doc.getTextDimensions(lines.join("\n"), { maxWidth: maxW });
          ensureSpace(dim.h + 1);
          doc.text(lines, margin, y);
          y += dim.h + 2;
        }
      }
    }
  }

  const ab = doc.output("arraybuffer") as ArrayBuffer;
  return new Blob([ab], { type: "application/pdf" });
}

export function buildStoredRulePdfBlob(rule: StoredLastPublishedRule): Blob {
  const sections = parsePublishedDocumentForCommunityRuleDisplay(rule.document);
  if (sections.length === 0) {
    throw new Error("exportEmptyDocument");
  }
  return sectionsToPdfBlob(rule.title, rule.summary, sections);
}

export function downloadStoredRuleAsPdf(rule: StoredLastPublishedRule): void {
  if (typeof document === "undefined") return;
  const blob = buildStoredRulePdfBlob(rule);
  const base = exportFilenameBase(rule);
  downloadBlob(`${base}-community-rule.pdf`, blob);
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadTextFile(
  filename: string,
  contents: string,
  mime: string,
): void {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
