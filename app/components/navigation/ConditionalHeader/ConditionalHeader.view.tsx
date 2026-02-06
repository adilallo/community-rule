import TopNav from "../TopNav";
import type { ConditionalHeaderViewProps } from "./ConditionalHeader.types";

export function ConditionalHeaderView({
  isHomePage,
}: ConditionalHeaderViewProps) {
  return <TopNav folderTop={isHomePage} />;
}
