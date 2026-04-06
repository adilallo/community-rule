"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TopNav from "./TopNav.container";
import type { TopNavProps } from "./TopNav.types";
import { fetchAuthSession } from "../../../../lib/create/api";

export type TopNavWithPathnameProps = Omit<TopNavProps, "folderTop"> & {
  /** From Server Component (`getNavAuthSignedIn`); matches first HTML paint. */
  initialSignedIn?: boolean;
};

/**
 * TopNav wrapper: `folderTop` from pathname; Log in vs Profile from session.
 *
 * **SSR:** Parent passes `initialSignedIn` from `getSessionUser()` so the hydrated
 * header matches the cookie (Next.js pattern for HttpOnly session UI).
 *
 * **Client:** Refetch on pathname change (magic-link redirect, stale layout after
 * `router.refresh()`), **popstate** / **pageshow** `persisted` (bfcache / back).
 */
const TopNavWithPathname = memo<TopNavWithPathnameProps>((props) => {
  const { initialSignedIn = false, ...topNavRest } = props;
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [loggedIn, setLoggedIn] = useState(initialSignedIn);

  useEffect(() => {
    setLoggedIn(initialSignedIn);
  }, [initialSignedIn]);

  const applySessionUser = useCallback(
    (user: { id: string; email: string } | null) => {
      setLoggedIn(Boolean(user));
    },
    [],
  );

  const syncSession = useCallback(() => {
    fetchAuthSession().then(({ user }) => {
      applySessionUser(user);
    });
  }, [applySessionUser]);

  useEffect(() => {
    let cancelled = false;
    fetchAuthSession().then(({ user }) => {
      if (!cancelled) applySessionUser(user);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, applySessionUser]);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) syncSession();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [syncSession]);

  useEffect(() => {
    const onPopState = () => {
      queueMicrotask(syncSession);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [syncSession]);

  return <TopNav {...topNavRest} folderTop={isHomePage} loggedIn={loggedIn} />;
});

TopNavWithPathname.displayName = "TopNavWithPathname";

export default TopNavWithPathname;
