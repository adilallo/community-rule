import Link from "next/link";
import messages from "../messages/en/index";
import { getTranslation } from "../lib/i18n/getTranslation";
import { getGovernanceTemplateCatalogEntry } from "../lib/templates/governanceTemplateCatalog";
import Icon from "./components/asset/Icon";
import Button from "./components/buttons/Button";
import HeroDecor from "./components/sections/HeroBanner/HeroDecor";

const NOT_FOUND_TEMPLATE_SLUGS = [
  "consensus",
  "do-ocracy",
  "devolution",
  "quadratic-governance",
] as const;

/**
 * Figma: 404 page frame 22078-808557; 480px lockup 22078-808903; title + CTA group 22078-808908
 * (filled / Go home left, outline / Browse right, 16px between).
 * Same [HeroDecor](app/components/sections/HeroBanner/HeroDecor.tsx) SVG as home; 404 places it only behind the title stack.
 * Shell: [app/layout.tsx](app/layout.tsx) `TopNav` only — no site footer.
 * Template chip row: Figma 22078-809968 — one row, 16px gaps, 20px to hint (no inner scroll; page handles overflow if needed).
 * Hero pattern: behind the 404 + bar + h1; wide SVG is painted with overflow-x-clip on `main` so it does not widen the scrollport.
 */
export default function NotFound() {
  const t = (key: string) => getTranslation(messages, key);

  const templateEntries = NOT_FOUND_TEMPLATE_SLUGS.map((slug) =>
    getGovernanceTemplateCatalogEntry(slug),
  ).filter(
    (e): e is NonNullable<typeof e> => e != null,
  );

  return (
    <main
      className="relative flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-x-clip bg-[var(--color-surface-default-primary)]"
      aria-labelledby="not-found-heading"
    >
      <div
        className="relative flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-x-clip px-[var(--spacing-scale-008)] sm:px-[var(--spacing-scale-010)] md:px-[var(--spacing-scale-016)] lg:px-[var(--spacing-scale-024)] xl:px-[var(--spacing-scale-048)]"
      >
          <div className="relative z-10 flex min-h-0 w-full max-w-full flex-1 flex-col items-center justify-center py-[var(--spacing-scale-040)] sm:py-[var(--spacing-scale-048)]">
            {/*
              Vertical rhythm: 22078-808903 + 22078-808908 — 404→bar 8px, bar→h1 32px, h1→body 16px,
              body→CTAs 48px, CTA→templates 40px (lockup flex gap), template→hint 20px
            */}
            <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-[var(--spacing-scale-040)] text-center">
              <div className="flex w-full min-w-0 flex-col items-center">
                <div className="relative flex w-full flex-col items-center">
                  <HeroDecor
                    className="pointer-events-none absolute left-1/2 top-[40%] -z-10 h-[645px] w-[1540px] max-w-none
                      -translate-x-1/2 -translate-y-1/2
                      scale-[0.41] sm:scale-[0.45] md:scale-[0.47] lg:scale-[0.5] xl:scale-[0.53]"
                  />
                  <p
                    className="w-full text-center font-bricolage-grotesque font-extrabold leading-none tracking-[-0.04em] text-[clamp(5.5rem,16vw,13.75rem)] text-[var(--color-content-default-brand-primary)]"
                    aria-hidden="true"
                  >
                    {t("pages.notFoundPage.codeTitle")}
                  </p>
                  <div
                    className="mt-[var(--spacing-scale-008)] h-1.5 w-[120px] shrink-0 rounded-full bg-[var(--color-yellow-yellow200)]"
                    aria-hidden="true"
                  />
                  <h1
                    id="not-found-heading"
                    className="mt-[var(--spacing-scale-032)] max-w-full text-center font-bricolage-grotesque text-[2.5rem] font-medium leading-[1.1] text-[var(--color-content-default-primary)] min-[400px]:text-[44px] min-[400px]:leading-[1.1]"
                  >
                    {t("pages.notFoundPage.heading")}
                  </h1>
                </div>
                <p className="mt-[var(--spacing-scale-016)] w-full max-w-[443px] text-center font-inter text-lg font-normal leading-[1.3] text-[var(--color-content-default-secondary)]">
                  {t("pages.notFoundPage.description")}
                </p>

                <div
                  dir="ltr"
                  className="mt-[var(--spacing-scale-048)] flex w-full min-w-0 flex-col items-center justify-center gap-[var(--spacing-scale-016)] min-[400px]:flex-nowrap min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-center"
                >
                  <Button
                    href="/"
                    size="large"
                    buttonType="filled"
                    palette="default"
                    className="inline-flex w-max max-w-full shrink-0 items-center justify-center gap-[var(--spacing-scale-010)]"
                  >
                    <Icon
                      name="arrow_back"
                      size={20}
                      className="shrink-0"
                    />
                    {t("pages.notFoundPage.goHomeCta")}
                  </Button>
                  <Button
                    href="/templates"
                    size="large"
                    buttonType="outline"
                    palette="default"
                    className="inline-flex w-max max-w-full shrink-0 items-center justify-center"
                  >
                    {t("pages.notFoundPage.browseTemplatesCta")}
                  </Button>
                </div>
              </div>

              {templateEntries.length > 0 ? (
                <div className="flex w-full min-w-0 max-w-[36rem] flex-col items-center gap-[var(--spacing-scale-020)] self-stretch">
                  <div
                    className="flex w-full min-w-0 max-md:flex-wrap md:flex-nowrap items-center justify-center gap-x-[var(--spacing-scale-016)] gap-y-[var(--spacing-scale-012)]"
                    role="list"
                  >
                    {templateEntries.map((entry) => (
                      <Link
                        key={entry.slug}
                        href={`/create/review-template/${entry.slug}`}
                        role="listitem"
                        className={`${entry.backgroundColor} inline-flex h-[37px] shrink-0 items-center justify-center rounded-full px-[20px] py-0 text-center font-bricolage-grotesque text-sm font-extrabold leading-[21px] text-[var(--color-content-invert-primary)] no-underline transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-invert-primary)]`}
                      >
                        {entry.title}
                      </Link>
                    ))}
                  </div>
                  <p className="w-full text-center font-inter text-[13px] font-normal leading-[1.2] text-[var(--color-gray-500)]">
                    {t("pages.notFoundPage.templateHint")}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
  );
}
