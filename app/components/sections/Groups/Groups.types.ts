import type { ReactNode } from "react";

export interface GroupsItem {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface GroupsProps {
  title: string;
  items: GroupsItem[];
  className?: string;
}

export interface GroupsViewProps extends GroupsProps {
  headingId: string;
}
