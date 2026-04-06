"use client";

import { useTranslation } from "../contexts/MessagesContext";

export default function ProfilePageClient() {
  const t = useTranslation("pages.profile");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <h1 className="font-bricolage text-3xl font-extrabold text-[var(--color-content-default-primary)] md:text-4xl">
        {t("placeholderTitle")}
      </h1>
      <p className="mt-4 font-inter text-lg leading-relaxed text-[var(--color-content-default-secondary)]">
        {t("placeholderBody")}
      </p>
    </div>
  );
}
