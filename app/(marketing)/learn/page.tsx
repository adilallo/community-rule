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

      <div className="smd:hidden sm:pt-[var(--spacing-scale-024)] sm:pb-[var(--spacing-scale-024)] sm:px-[var(--spacing-scale-020)] space-y-[var(--spacing-scale-002)] sm:space-y-[var(--spacing-scale-008)]">
        {allPosts.map((post) => (
          <ContentThumbnailTemplate
            key={`${post.slug}-horizontal`}
            post={post}
            variant="horizontal"
          />
        ))}
      </div>

      <div className="hidden smd:grid smd:grid-cols-2 xmd:grid-cols-3 lg:grid-cols-3 lg2:grid-cols-4 xl:grid-cols-5 smd:gap-[var(--spacing-scale-008)] md:gap-[var(--spacing-scale-016)] xmd:gap-[var(--spacing-scale-012)] lg:gap-[var(--spacing-scale-016)] lg2:gap-x-[var(--spacing-scale-016)] lg2:gap-y-[var(--spacing-scale-024)] xl:gap-x-[var(--spacing-scale-016)] xl:gap-y-[var(--spacing-scale-016)] smd:pt-[var(--spacing-scale-024)] smd:pb-[var(--spacing-scale-024)] smd:px-[var(--spacing-scale-020)] md:px-[var(--spacing-scale-032)] lg:pt-[var(--spacing-scale-032)] lg:pb-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)] [&>*]:min-w-0">
        {allPosts.map((post) => (
          <ContentThumbnailTemplate
            key={`${post.slug}-vertical`}
            post={post}
            variant="vertical"
          />
        ))}
      </div>

      <AskOrganizer {...askOrganizerData} />
    </div>
  );
}
