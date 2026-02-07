export interface CreateProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  showBackButton?: boolean;
  showNextButton?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  nextButtonDisabled?: boolean;
  currentStep?: number;
  totalSteps?: number;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  /**
   * Whether to enable Create block array content type (Figma prop).
   * @default false
   */
  createBlockArray?: boolean;
  /**
   * Whether to enable Text input content type (Figma prop).
   * @default false
   */
  textInput?: boolean;
  /**
   * Whether to enable Text area content type (Figma prop).
   * @default false
   */
  textArea?: boolean;
  /**
   * Whether to enable Multi-select content type (Figma prop).
   * @default false
   */
  multiSelect?: boolean;
  /**
   * Whether to enable Upload content type (Figma prop).
   * @default false
   */
  upload?: boolean;
  /**
   * Whether to enable Proportion content type (Figma prop).
   * @default false
   */
  proportion?: boolean;
}

export interface CreateViewProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode;
  showBackButton: boolean;
  showNextButton: boolean;
  onBack?: () => void;
  onNext?: () => void;
  backButtonText: string;
  nextButtonText: string;
  nextButtonDisabled: boolean;
  currentStep?: number;
  totalSteps?: number;
  className: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  createRef: React.RefObject<HTMLDivElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
}
