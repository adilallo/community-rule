import messages from "../../../messages/en/index";
import { getTranslation } from "../../../lib/i18n/getTranslation";
import AboutHeader from "../../components/type/AboutHeader";
import type { AboutHeaderSegment } from "../../components/type/AboutHeader";
import Stats from "../../components/sections/Stats";
import type { StatItem } from "../../components/sections/Stats";
import TripleTextBlock from "../../components/type/TripleTextBlock";
import type { TripleTextBlockColumn } from "../../components/type/TripleTextBlock";
import Book from "../../components/sections/Book";
import FaqAccordion from "../../components/sections/Accordion";
import type { FaqAccordionItem } from "../../components/sections/Accordion";
import QuoteBlock from "../../components/sections/QuoteBlock";
import AskOrganizer from "../../components/sections/AskOrganizer";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

export default function AboutPage() {
  const t = (key: string) => getTranslation(messages, key);

  const page = messages.pages.about;

  const headerSegments = asArray<AboutHeaderSegment>(page.aboutHeader.segments);
  const statsItems = asArray<StatItem>(page.stats.items);

  const statsAsOf =
    typeof page.stats.asOf === "string"
      ? page.stats.asOf
      : String(page.stats.asOf ?? "");

  const faqItems = asArray<FaqAccordionItem>(page.faq.items);
  const tripleColumns = asArray<TripleTextBlockColumn>(page.tripleTextBlock.columns);

  const askOrganizerData = {
    title: t("pages.home.askOrganizer.title"),
    subtitle: t("pages.home.askOrganizer.subtitle"),
    buttonText: t("pages.home.askOrganizer.buttonText"),
  };

  return (
    <div className="min-h-screen bg-black">
      <AboutHeader segments={headerSegments} />
      <Stats
        titlePrefix={page.stats.titlePrefix}
        titleEmphasis={page.stats.titleEmphasis}
        titleSuffix={page.stats.titleSuffix}
        items={statsItems.map((item) => ({
          ...item,
          asOf: statsAsOf,
        }))}
      />
      <TripleTextBlock columns={tripleColumns} />
      <Book
        title={page.book.title}
        description={page.book.description}
        buttonText={page.book.buttonText}
        buttonHref={page.book.buttonHref}
        imageAlt={page.book.imageAlt}
      />
      <FaqAccordion title={page.faq.title} items={faqItems} />
      <QuoteBlock
        variant="statement"
        id="about-statement-quote"
        quote={page.quote.paragraph1}
        quoteSecondary={page.quote.paragraph2}
      />
      <section className="bg-[var(--color-surface-default-primary)]">
        <AskOrganizer {...askOrganizerData} />
      </section>
    </div>
  );
}
