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
