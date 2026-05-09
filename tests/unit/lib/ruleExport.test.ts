import { describe, it, expect } from "vitest";
import {
  buildPrintableRuleHtmlDocument,
  buildPublicRuleUrl,
  buildStoredRulePdfBlob,
  exportFilenameBase,
  sectionsToCsv,
  sectionsToMarkdown,
} from "../../../lib/create/ruleExport";
import type { CommunityRuleSection } from "../../../app/components/type/CommunityRule/CommunityRule.types";

async function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === "function") {
    return blob.arrayBuffer();
  }
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const r = new FileReader();
    r.onload = (): void => resolve(r.result as ArrayBuffer);
    r.onerror = (): void => reject(new Error("FileReader failed"));
    r.readAsArrayBuffer(blob);
  });
}

describe("ruleExport", () => {
  it("buildPublicRuleUrl encodes id and trims origin slash", () => {
    expect(buildPublicRuleUrl("https://example.com/", "abc/xyz")).toBe(
      "https://example.com/rules/abc%2Fxyz",
    );
    expect(buildPublicRuleUrl("https://example.com", "r1")).toBe(
      "https://example.com/rules/r1",
    );
  });

  it("exportFilenameBase slugifies title", () => {
    expect(
      exportFilenameBase({
        id: "id-1",
        title: "Mutual Aid Mondays!",
        document: {},
      }),
    ).toBe("mutual-aid-mondays");
  });

  it("exportFilenameBase falls back to id fragment", () => {
    expect(
      exportFilenameBase({
        id: "full-uuid-here",
        title: "   ",
        document: {},
      }),
    ).toBe("rule-full-uui");
  });

  it("sectionsToMarkdown renders title, summary, and sections", () => {
    const sections: CommunityRuleSection[] = [
      {
        categoryName: "Values",
        entries: [
          {
            title: "Solidarity",
            body: "First paragraph.\n\nSecond paragraph.",
          },
        ],
      },
    ];
    const md = sectionsToMarkdown(
      "My Rule",
      "Short summary.",
      sections,
    );
    expect(md).toContain("# My Rule");
    expect(md).toContain("Short summary.");
    expect(md).toContain("## Values");
    expect(md).toContain("### Solidarity");
    expect(md).toContain("First paragraph.");
    expect(md).toContain("Second paragraph.");
  });

  it("sectionsToCsv includes header row, title metadata, sections, and quotes commas", () => {
    const sections: CommunityRuleSection[] = [
      {
        categoryName: "Values",
        entries: [
          {
            title: "Solidarity",
            body: "One, two",
          },
        ],
      },
    ];
    const csv = sectionsToCsv("My Rule", "Sum, mary", sections);
    expect(csv).toContain("Section,Entry,Block label,Content");
    expect(csv).toContain('"Sum, mary"');
    expect(csv).toContain('"One, two"');
    expect(csv).toContain(",Title,,My Rule");
  });

  it("buildPrintableRuleHtmlDocument escapes HTML in user content", () => {
    const sections: CommunityRuleSection[] = [
      {
        categoryName: 'Values <x>',
        entries: [{ title: "Entry", body: "<script>bad()</script>" }],
      },
    ];
    const html = buildPrintableRuleHtmlDocument(
      'Title <t>',
      null,
      sections,
    );
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>bad()");
    expect(html).toContain("Values &lt;x&gt;");
  });

  it("buildStoredRulePdfBlob produces application/pdf with PDF magic bytes", async () => {
    const blob = buildStoredRulePdfBlob({
      id: "id-1",
      title: "Garden Norms",
      summary: "Summary here.",
      document: {
        sections: [
          {
            categoryName: "Values",
            entries: [{ title: "Solidarity", body: "Be kind.\n\nShare tools." }],
          },
        ],
      },
    });
    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBeGreaterThan(500);
    const buf = new Uint8Array(await readBlobAsArrayBuffer(blob));
    expect(String.fromCharCode(...buf.subarray(0, 5))).toBe("%PDF-");
  });

  it("buildStoredRulePdfBlob throws exportEmptyDocument when sections empty", () => {
    expect(() =>
      buildStoredRulePdfBlob({
        id: "id-1",
        title: "T",
        document: {},
      }),
    ).toThrowError("exportEmptyDocument");
  });

  it("export pdf attachment filename matches csv/md convention", () => {
    const rule = {
      id: "id-1",
      title: "Garden norms",
      document: {
        sections: [
          { categoryName: "X", entries: [{ title: "t", body: "b" }] },
        ],
      },
    };
    expect(`${exportFilenameBase(rule)}-community-rule.pdf`).toBe(
      "garden-norms-community-rule.pdf",
    );
  });
});
