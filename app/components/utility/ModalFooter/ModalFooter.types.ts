export interface ModalFooterProps {
  showBackButton?: boolean;
  showNextButton?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  /**
   * Custom back button text. If not provided, uses localized "Back" from common.json
   */
  backButtonText?: string;
  /**
   * Custom next button text. If not provided, uses localized "Next" from common.json
   */
  nextButtonText?: string;
  nextButtonDisabled?: boolean;
  currentStep?: number;
  totalSteps?: number;
  footerContent?: React.ReactNode;
  className?: string;
}
