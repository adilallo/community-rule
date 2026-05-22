import type { AddCustomFieldType } from "../../../../components/controls/AddCustomField/AddCustomField.types";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";
import type { DragEvent } from "react";

export interface CustomMethodCardWizardBlocksListProps {
  blocks: CustomMethodCardFieldBlock[];
  fieldTypeLabels: Record<AddCustomFieldType, string>;
  dragHandleAriaLabel: string;
  listLabel: string;
  onBlocksReorder: (_next: CustomMethodCardFieldBlock[]) => void;
}

export interface CustomMethodCardWizardBlocksListViewProps
  extends CustomMethodCardWizardBlocksListProps {
  draggingIndex: number | null;
  overIndex: number | null;
  onDragStart: (_index: number) => (_e: DragEvent) => void;
  onDragOver: (_index: number) => (_e: DragEvent) => void;
  onDrop: (_index: number) => (_e: DragEvent) => void;
  onDragEnd: () => void;
}
