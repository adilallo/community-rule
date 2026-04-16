export interface CreateProps {
  isOpen: boolean;
  onClose: () => void;
  /** Default header: title + description. Omit to use title/description. */
  title?: string;
  description?: string;
  /** Custom header slot. When set, replaces title/description for full control. */
  headerContent?: React.ReactNode;
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
  /** Figma / design alignment (unused in implementation). */
  createBlockArray?: boolean;
  textInput?: boolean;
  textArea?: boolean;
  multiSelect?: boolean;
  upload?: boolean;
  proportion?: boolean;
  /**
   * Backdrop behind the dialog. `loginYellow` matches the Login modal’s blurred brand overlay.
   * @default "default"
   */
  backdropVariant?: "default" | "loginYellow";
}

export interface CreateViewProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  headerContent?: React.ReactNode;
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
  backdropVariant: "default" | "loginYellow";
}
