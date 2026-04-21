"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "../../contexts/MessagesContext";
import Button from "../../components/buttons/Button";
import { fetchAuthSession, logout } from "../../../lib/create/api";

export default function ProfilePageClient() {
  const t = useTranslation("pages.profile");
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchAuthSession().then(({ user: u }) => {
      if (!cancelled) {
        setUser(u);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    await logout();
    setUser(null);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <h1 className="font-bricolage text-3xl font-extrabold text-[var(--color-content-default-primary)] md:text-4xl">
        {t("placeholderTitle")}
      </h1>
      <p className="mt-4 font-inter text-lg leading-relaxed text-[var(--color-content-default-secondary)]">
        {t("placeholderBody")}
      </p>
      {loaded && user ? (
        <div className="mt-8">
          <Button
            buttonType="outline"
            palette="default"
            size="small"
            type="button"
            onClick={() => void handleSignOut()}
            ariaLabel={t("signOut")}
          >
            {t("signOut")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
