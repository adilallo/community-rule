import HomeHeader from "../navigation/HomeHeader";
import Header from "../navigation/Header";
import type { ConditionalHeaderViewProps } from "./ConditionalHeader.types";

export function ConditionalHeaderView({
  isHomePage,
}: ConditionalHeaderViewProps) {
  if (isHomePage) {
    return <HomeHeader />;
  }
  return <Header />;
}
