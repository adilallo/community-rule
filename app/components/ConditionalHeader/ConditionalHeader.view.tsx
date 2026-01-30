import HomeHeader from "../HomeHeader";
import Header from "../Header";
import type { ConditionalHeaderViewProps } from "./ConditionalHeader.types";

export function ConditionalHeaderView({
  isHomePage,
}: ConditionalHeaderViewProps) {
  if (isHomePage) {
    return <HomeHeader />;
  }
  return <Header />;
}
