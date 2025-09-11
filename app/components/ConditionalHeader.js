"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import HomeHeader from "./HomeHeader";

export default function ConditionalHeader() {
  const pathname = usePathname();

  // Show HomeHeader only on the homepage (/)
  if (pathname === "/") {
    return <HomeHeader />;
  }

  // Show regular Header on all other pages
  return <Header />;
}
