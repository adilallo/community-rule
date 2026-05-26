import messages from "../../../messages/en/index";
import { getTranslation } from "../../../lib/i18n/getTranslation";
import ContentThumbnailTemplate from "../../components/content/ContentThumbnailTemplate";
import ContentLockup from "../../components/type/ContentLockup";
import AskOrganizer from "../../components/sections/AskOrganizer";
import { getAllBlogPosts } from "../../../lib/content";

export default function LearnPage() {
  const allPosts = getAllBlogPosts();

  const t = (key: string) => getTranslation(messages, key);

  const contentLockupData = {
    title: t("pages.learn.contentLockup.title"),
    subtitle: t("pages.learn.contentLockup.subtitle"),
    variant: "learn" as const,
    alignment: "left" as const,
  };

  const askOrganizerData = {
    title: t("pages.learn.askOrganizer.title"),
    subtitle: t("pages.learn.askOrganizer.subtitle"),
    description: t("pages.learn.askOrganizer.description"),
    buttonText: t("pages.learn.askOrganizer.buttonText"),
    variant: "centered" as const,
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <ContentLockup {...contentLockupData} />

      {/*
       * Single responsive render: ContentThumbnailTemplate variant="responsive"
       * uses <picture> to swap horizontal/vertical art at smd (530px). The
       * container switches from a vertical flex stack (<smd) to a grid (≥smd),
       * matching the prior twin-region layout without doubling the DOM.
       */}
      <div className="flex flex-col space-y-[var(--spacing-scale-002)] sm:space-y-[var(--spacing-scale-008)] sm:px-[var(--spacing-scale-020)] sm:pt-[var(--spacing-scale-024)] sm:pb-[var(--spacing-scale-024)] smd:grid smd:grid-cols-2 smd:gap-[var(--spacing-scale-008)] smd:space-y-0 smd:px-[var(--spacing-scale-020)] smd:pt-[var(--spacing-scale-024)] smd:pb-[var(--spacing-scale-024)] md:gap-[var(--spacing-scale-016)] md:px-[var(--spacing-scale-032)] xmd:grid-cols-3 xmd:gap-[var(--spacing-scale-012)] lg:grid-cols-3 lg:gap-[var(--spacing-scale-016)] lg:px-[var(--spacing-scale-064)] lg:pt-[var(--spacing-scale-032)] lg:pb-[var(--spacing-scale-064)] lg2:grid-cols-4 lg2:gap-x-[var(--spacing-scale-016)] lg2:gap-y-[var(--spacing-scale-024)] xl:grid-cols-5 xl:gap-x-[var(--spacing-scale-016)] xl:gap-y-[var(--spacing-scale-016)] [&>*]:min-w-0">
        {allPosts.map((post) => (
          <ContentThumbnailTemplate
            key={post.slug}
            post={post}
            variant="responsive"
          />
        ))}
      </div>

      <AskOrganizer {...askOrganizerData} />
    </div>
  );
}
