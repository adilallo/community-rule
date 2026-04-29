"use client";

import { memo } from "react";
import type { TextBlockProps } from "./TextBlock.types";

/**
 * Figma: Utility / **Community Rule / Text Block** (22001:29793).
 * Title + body paragraphs and/or labeled rows (12px between stacks, 8px label→body).
 */

const ENTRY_TITLE_CLASS =
  "font-inter font-bold text-[20px] leading-[28px] text-[var(--color-content-invert-primary)] shrink-0";

const ROW_LABEL_CLASS =
  "font-inter font-medium text-[14px] leading-[18px] text-[var(--color-content-invert-primary)] shrink-0";

const PARAGRAPH_CLASS =
  "font-inter font-normal text-[14px] leading-[20px] text-[var(--color-content-invert-primary)] shrink-0";

function bodyToParagraphs(body: string): string[] {
  return body
    .split(/\n\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function ParagraphGroup({ text }: { text: string }) {
  const paragraphs = bodyToParagraphs(text);
  if (paragraphs.length === 0) return null;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {paragraphs.map((p, i) => (
        <p key={i} className={`${PARAGRAPH_CLASS} whitespace-pre-wrap`}>
          {p}
        </p>
      ))}
    </div>
  );
}

function TextBlockView({
  title,
  body = "",
  rows,
  className = "",
}: TextBlockProps) {
  const hasRows = rows && rows.length > 0;

  return (
    <div
      className={`flex min-w-0 flex-col gap-2 ${className}`.trim()}
      data-name="TextBlock"
    >
      <p className={`${ENTRY_TITLE_CLASS} w-full min-w-0`}>{title}</p>
      <div className="flex min-w-0 flex-col gap-3">
        {hasRows
          ? rows!.map((row, i) => (
              <div key={i} className="flex min-w-0 flex-col gap-2">
                <p className={ROW_LABEL_CLASS}>{row.label}</p>
                <ParagraphGroup text={row.body} />
              </div>
            ))
          : body.trim().length > 0 && <ParagraphGroup text={body} />}
      </div>
    </div>
  );
}

TextBlockView.displayName = "TextBlockView";

export default memo(TextBlockView);
