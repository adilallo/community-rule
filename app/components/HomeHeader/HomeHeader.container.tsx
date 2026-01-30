"use client";

import { memo, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSchemaData } from "../../hooks";
import HomeHeaderView from "./HomeHeader.view";
import type { HomeHeaderProps } from "./HomeHeader.types";

const HomeHeaderContainer = memo<HomeHeaderProps>(() => {
  const pathname = usePathname();
  const { schemaData } = useSchemaData();

  // Navigation items configuration
  const navigationItems = useMemo(
    () => [
      {
        label: "Home",
        href: "/",
        isActive: pathname === "/",
      },
      {
        label: "Learn",
        href: "/learn",
        isActive: pathname === "/learn",
      },
      {
        label: "Monitor",
        href: "/monitor",
        isActive: pathname === "/monitor",
      },
      {
        label: "Blog",
        href: "/blog",
        isActive: pathname?.startsWith("/blog") ?? false,
      },
    ],
    [pathname],
  );

  // Avatar images configuration
  const avatarImages = useMemo(
    () => [
      {
        src: "/assets/avatar-1.svg",
        alt: "User avatar 1",
      },
      {
        src: "/assets/avatar-2.svg",
        alt: "User avatar 2",
      },
      {
        src: "/assets/avatar-3.svg",
        alt: "User avatar 3",
      },
    ],
    [],
  );

  // Logo configuration
  const logoConfig = useMemo(
    () => ({
      src: "/assets/logo.svg",
      alt: "Community Rule Logo",
      width: 120,
      height: 32,
    }),
    [],
  );

  return (
    <HomeHeaderView
      pathname={pathname}
      schemaData={schemaData}
      navigationItems={navigationItems}
      avatarImages={avatarImages}
      logoConfig={logoConfig}
    />
  );
});

HomeHeaderContainer.displayName = "HomeHeader";

export default HomeHeaderContainer;
