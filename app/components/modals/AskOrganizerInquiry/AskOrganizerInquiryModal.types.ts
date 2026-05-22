export interface AskOrganizerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AskOrganizerInquiryModalCopy {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  questionLabel: string;
  questionPlaceholder: string;
  submitButton: string;
  closeAfterSuccess: string;
  successTitle: string;
  successDescription: string;
  ariaDialog: string;
  honeypotLabel: string;
}

export interface AskOrganizerInquiryModalViewProps
  extends AskOrganizerInquiryModalProps {
  copy: AskOrganizerInquiryModalCopy;
  email: string;
  message: string;
  honeypot: string;
  submitting: boolean;
  success: boolean;
  formError: string | null;
  emailError: boolean;
  questionError: boolean;
  onEmailChange: (_v: string) => void;
  onMessageChange: (_v: string) => void;
  onHoneypotChange: (_v: string) => void;
  onSubmit: (_e: import("react").FormEvent<HTMLFormElement>) => void;
}
