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
  nextDisabled: boolean;
  nextLabel: string;
  showBackButton: boolean;
  onBack: () => void;
  onNext: () => void;
  stepper: boolean;
}
