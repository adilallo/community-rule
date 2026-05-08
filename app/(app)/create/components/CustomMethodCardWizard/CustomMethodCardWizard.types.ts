import type { RefObject } from "react";
import type { AddCustomFieldType } from "../../../../components/controls/AddCustomField/AddCustomField.types";
import type { CustomMethodCardFieldBlock } from "../../../../../lib/create/customMethodCardFieldBlocks";

export interface CustomMethodCardWizardFieldBodiesCopy {
  requiredHint: string;
  text: {
    blockTitleLabel: string;
    blockTitlePlaceholder: string;
    placeholderLabel: string;
    placeholderFieldPlaceholder: string;
  };
  badges: {
    blockTitleLabel: string;
    blockTitlePlaceholder: string;
    optionsLabel: string;
    addOptionLabel: string;
  };
  upload: {
    blockTitleLabel: string;
    blockTitlePlaceholder: string;
    uploadFileInputAriaLabel: string;
    uploadHint: string;
    uploadPreviewImageAlt: string;
    clearPendingUploadAriaLabel: string;
    clearPendingUploadTooltip: string;
  };
  proportion: {
    blockTitleLabel: string;
    blockTitlePlaceholder: string;
    defaultLabel: string;
    decrementAriaLabel: string;
    incrementAriaLabel: string;
  };
}

export interface CustomMethodCardWizardCopy {
  step1: { title: string; description: string; fieldPlaceholder: string };
  step2: { title: string; description: string; fieldPlaceholder: string };
  step3: { title: string; description: string };
  step3BlocksList: {
    listLabel: string;
    dragHandleAriaLabel: string;
  };
  fieldTypeLabels: Record<AddCustomFieldType, string>;
  footerFinalize: string;
  fieldModals: {
    addField: string;
    requiredHint: string;
    text: CustomMethodCardWizardFieldBodiesCopy["text"] & {
      title: string;
      description: string;
    };
    badges: CustomMethodCardWizardFieldBodiesCopy["badges"] & {
      title: string;
      description: string;
    };
    upload: CustomMethodCardWizardFieldBodiesCopy["upload"] & {
      title: string;
      description: string;
    };
    proportion: CustomMethodCardWizardFieldBodiesCopy["proportion"] & {
      title: string;
      description: string;
    };
  };
}

export interface CustomMethodCardWizardProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user completes step 3; parent assigns id and persists state. */
  onFinalize: (payload: {
    title: string;
    description: string;
    fieldBlocks: CustomMethodCardFieldBlock[];
  }) => void;
  /**
   * Persists custom-method upload files to `POST /api/uploads` (purpose
   * `customMethodAttachment`). When omitted, upload field only stores `fileName`.
   */
  onPersistCustomUploadFile?: (file: File) => Promise<{ url: string }>;
}

export interface CustomMethodCardWizardFieldBodiesViewProps {
  fieldType: AddCustomFieldType;
  copy: CustomMethodCardWizardFieldBodiesCopy;
  textBlockTitle: string;
  textPlaceholderBody: string;
  onTextBlockTitleChange: (_v: string) => void;
  onTextPlaceholderBodyChange: (_v: string) => void;
  badgeBlockTitle: string;
  badgeOptions: string[];
  onBadgeBlockTitleChange: (_v: string) => void;
  onBadgeAddOption: (_v: string) => void;
  uploadBlockTitle: string;
  onUploadBlockTitleChange: (_v: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChosen: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Clears chosen file, preview URL, and related errors so the user can pick again. */
  onClearPendingUpload: () => void;
  /** When set after a successful upload, shows an inline image preview in the modal. */
  uploadAssetPreviewUrl?: string | null;
  /** Shown under the upload control while saving to the server. */
  uploadPersisting?: boolean;
  /** Replaces upload hint text while `uploadPersisting` is true. */
  uploadBusyHint?: string;
  uploadErrorMessage?: string | null;
  proportionBlockTitle: string;
  proportionDefault: number;
  onProportionBlockTitleChange: (_v: string) => void;
  onProportionDefaultChange: (_v: number) => void;
}

export interface CustomMethodCardWizardViewProps {
  isOpen: boolean;
  onDismiss: () => void;
  wizardStep: 1 | 2 | 3;
  title: string;
  description: string;
  policyTitle: string;
  policyDescription: string;
  addFieldExpanded: boolean;
  copy: CustomMethodCardWizardCopy;
  maxChars: number;
  onPolicyTitleChange: (v: string) => void;
  onPolicyDescriptionChange: (v: string) => void;
  onPressAddCustomField: () => void;
  onSelectFieldType: (t: AddCustomFieldType) => void;
  fieldTypeModal: AddCustomFieldType | null;
  fieldBodiesCopy: CustomMethodCardWizardFieldBodiesCopy;
  fieldBodiesProps: Omit<
    CustomMethodCardWizardFieldBodiesViewProps,
    "fieldType" | "copy"
  >;
  draftFieldBlocks: CustomMethodCardFieldBlock[];
  onDraftFieldBlocksReorder: (_next: CustomMethodCardFieldBlock[]) => void;
  nextDisabled: boolean;
  nextLabel: string;
  showBackButton: boolean;
  onBack: () => void;
  onNext: () => void;
  stepper: boolean;
}
