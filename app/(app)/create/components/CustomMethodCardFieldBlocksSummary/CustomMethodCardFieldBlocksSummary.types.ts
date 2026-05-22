import type { ChangeEventHandler, RefObject } from "react";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";

export interface CustomMethodCardFieldBlocksSummaryProps {
  blocks: CustomMethodCardFieldBlock[];
  /** When set, fields update the draft via immutable block-array replacements. */
  onBlocksChange?: (_next: CustomMethodCardFieldBlock[]) => void;
}

export type CustomMethodCardFieldBlocksSummaryFieldModalsCopy = {
  badges: { addOptionLabel: string };
  upload: {
    uploadFileInputAriaLabel: string;
    uploadHint: string;
    clearPendingUploadAriaLabel: string;
    clearPendingUploadTooltip: string;
    uploadPreviewImageAlt: string;
  };
  proportion: {
    decrementAriaLabel: string;
    incrementAriaLabel: string;
  };
};

export interface CustomMethodCardFieldBlocksSummaryViewProps {
  blocks: CustomMethodCardFieldBlock[];
  readOnly: boolean;
  emptyValue: string;
  noFileChosen: string;
  fieldModalsCopy: CustomMethodCardFieldBlocksSummaryFieldModalsCopy;
  onPatch: (_next: CustomMethodCardFieldBlock[]) => void;
}

export type CustomMethodCardUploadBlockRowProps = {
  block: Extract<CustomMethodCardFieldBlock, { kind: "upload" }>;
  blocks: CustomMethodCardFieldBlock[];
  onPatch: (_next: CustomMethodCardFieldBlock[]) => void;
  uploadFileInputAriaLabel: string;
  uploadHint: string;
  clearPendingUploadAriaLabel: string;
  clearPendingUploadTooltip: string;
  uploadPreviewImageAlt: string;
  noFileChosen: string;
};

export type CustomMethodCardUploadBlockRowViewProps =
  CustomMethodCardUploadBlockRowProps & {
    uploadInputRef: RefObject<HTMLInputElement | null>;
    busy: boolean;
    uploadingHint: string;
    errorMessage: string | null;
    onClearUpload: () => void;
    onFileInputChange: ChangeEventHandler<HTMLInputElement>;
    onUploadClick: () => void;
  };
