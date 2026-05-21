"use client";

import { memo } from "react";
import Button from "../../buttons/Button";
import ContentLockup from "../ContentLockup";
import type {
  TripleTextBlockColumn,
  TripleTextBlockViewProps,
} from "./TripleTextBlock.types";

function columnUsesLargeBreakpointCopy(column: TripleTextBlockColumn): boolean {
  return column.lgTitle !== undefined || column.lgDescription !== undefined;
}

function TripleTextUseCasesColumn({ column }: { column: TripleTextBlockColumn }) {
  return (
    <article className="flex w-full flex-col gap-[var(--spacing-scale-006)] md:gap-[var(--spacing-scale-008)] lg:gap-[var(--spacing-scale-004)] xl:gap-[var(--spacing-scale-008)]">
      <h3 className="text-left font-bricolage-grotesque text-[24px] font-medium leading-8 text-[var(--color-content-default-primary,white)] md:text-[32px] md:leading-[1.1] lg:text-[18px] lg:leading-[var(--spacing-scale-022)] xl:text-[32px] xl:leading-[1.1]">
        {column.title}
      </h3>
      <div className="flex flex-col font-inter text-[16px] font-normal leading-6 text-[var(--color-content-default-secondary)] md:text-[24px] md:leading-8 lg:text-[14px] lg:leading-5 xl:text-[24px] xl:leading-8">
        <p>{column.description}</p>
        {column.descriptionSecondary ? (
          <p className="mt-[var(--spacing-scale-024)] md:mt-[var(--spacing-scale-032)] lg:mt-0 lg:pt-[var(--spacing-scale-020)] xl:mt-[var(--spacing-scale-032)]">
            {column.descriptionSecondary}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function TripleTextBlockColumnLockup({
  column,
  layoutPreset,
}: {
  column: TripleTextBlockColumn;
  layoutPreset: "default" | "useCases";
}) {
  if (layoutPreset === "useCases") {
    return <TripleTextUseCasesColumn column={column} />;
  }

  const dual = columnUsesLargeBreakpointCopy(column);
  const lgSubtitle = column.lgTitle ?? column.title;
  const lgBody = column.lgDescription ?? column.description;

  if (!dual) {
    return (
      <ContentLockup
        variant="about"
        alignment="left"
        subtitle={column.title}
        description={column.description}
      />
    );
  }

  return (
    <>
      <div className="lg:hidden">
        <ContentLockup
          variant="about"
          alignment="left"
          subtitle={column.title}
          description={column.description}
        />
      </div>
      <div className="hidden lg:block">
        <ContentLockup
          variant="about"
          alignment="left"
          subtitle={lgSubtitle}
          description={lgBody}
        />
      </div>
    </>
  );
}

/**
 * Section horizontal padding adds **+ Scale/096** below `xl` (outer frame inset); **use cases `xl`** uses **Scale/160** only ([22085:860414](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22085-860414&m=dev)).
 *
 * Figma: use cases **`lg`** [22037:26994](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22037-26994&m=dev);
 * baseline **22112:871529** / **22085:860366**; **`md`** [22085:862437](https://www.figma.com/design/agv0VBLiBlcnSAaiAORgPR/Community-Rule-System?node-id=22085-862437&m=dev); stacked **22137:890676**;
 * lg 3-col **22128:888715**; xl **22135:889705** (default preset).
 */
function TripleTextBlockView({
  title = "",
  columns,
  ctaText,
  ctaHref,
  headingId,
  className = "",
  layoutPreset = "default",
}: TripleTextBlockViewProps) {
  const sectionTitle = title.trim();
  const hasSectionTitle = sectionTitle.length > 0;
  const isUseCases = layoutPreset === "useCases";

  return (
    <section
      {...(isUseCases ? { "data-figma-node": "22085-860414" } : {})}
      aria-labelledby={hasSectionTitle ? headingId : undefined}
      className={`bg-black py-[var(--spacing-scale-064)] xl:py-[var(--spacing-scale-064)] ${
        isUseCases
          ? "px-[var(--spacing-scale-032)] md:px-[var(--spacing-scale-096)] lg:px-[calc(var(--spacing-scale-096)+var(--spacing-scale-096))] xl:px-[var(--spacing-scale-160)]"
          : "px-[calc(var(--spacing-scale-032)+var(--spacing-scale-096))] md:px-[calc(var(--spacing-scale-096)+var(--spacing-scale-096))] lg:px-[calc(var(--spacing-scale-096)+var(--spacing-scale-096))] xl:px-[calc(var(--spacing-scale-160)+var(--spacing-scale-096))]"
      } ${className}`.trim()}
    >
      <div
        className={
          isUseCases
            ? "mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[var(--spacing-scale-032)] md:gap-[var(--spacing-scale-048)] lg:items-center lg:gap-[var(--spacing-scale-064)]"
            : "mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[var(--spacing-scale-032)]"
        }
      >
        {hasSectionTitle ? (
          <h2
            id={headingId}
            className={
              isUseCases
                ? "w-full text-left font-bricolage-grotesque text-[28px] font-bold leading-9 text-[var(--color-content-default-primary,white)] md:text-[32px] md:leading-[40px] lg:mx-auto lg:max-w-[693px] lg:text-center lg:text-[36px] lg:font-extrabold lg:leading-[44px] xl:text-[40px] xl:leading-[52px] xl:font-bold"
                : "w-full text-left font-bricolage-grotesque text-[32px] font-medium leading-[1.1] text-[var(--color-content-default-primary,white)]"
            }
          >
            {sectionTitle}
          </h2>
        ) : null}
        <div
          className={
            isUseCases
              ? "flex w-full flex-col gap-[var(--spacing-scale-048)] lg:flex-row lg:items-start lg:gap-[var(--spacing-scale-032)]"
              : "flex w-full flex-col gap-[var(--spacing-scale-032)] lg:flex-row lg:items-start lg:gap-[var(--spacing-scale-032)]"
          }
        >
          {columns.map((column, index) => (
            <div
              key={`${column.title}-${column.lgTitle ?? ""}-${index}`}
              className="w-full min-w-0 lg:flex-1"
            >
              <TripleTextBlockColumnLockup
                column={column}
                layoutPreset={layoutPreset}
              />
            </div>
          ))}
        </div>
        {ctaText ? (
          <div
            className={
              isUseCases
                ? "flex w-full justify-start lg:justify-center"
                : "flex w-full justify-start"
            }
          >
            <Button
              buttonType={isUseCases ? "outline" : "filled"}
              palette={isUseCases ? "default" : "inverse"}
              size="large"
              href={ctaHref}
            >
              {ctaText}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

TripleTextBlockView.displayName = "TripleTextBlockView";

export default memo(TripleTextBlockView);
