"use client";

import type { FormEvent } from "react";
import Create from "../Create";
import TextInput from "../../controls/TextInput";
import TextArea from "../../controls/TextArea";
import Button from "../../buttons/Button";
import { useTranslation } from "../../../contexts/MessagesContext";
import {
  ASK_ORGANIZER_INQUIRY_FORM_ID,
  ORGANIZER_INQUIRY_HONEYPOT_FIELD,
} from "../../../../lib/organizerInquiryConstants";
import type { AskOrganizerInquiryModalProps } from "./AskOrganizerInquiryModal.types";

export type AskOrganizerInquiryModalViewProps = AskOrganizerInquiryModalProps & {
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
  onSubmit: (_e: FormEvent<HTMLFormElement>) => void;
};

/**
 * Figma: Community Rule System — Modal / Ask an Organizer (22078-587823)
 */
export function AskOrganizerInquiryModalView({
  isOpen,
  onClose,
  email,
  message,
  honeypot,
  submitting,
  success,
  formError,
  emailError,
  questionError,
  onEmailChange,
  onMessageChange,
  onHoneypotChange,
  onSubmit,
}: AskOrganizerInquiryModalViewProps) {
  const t = useTranslation("modals.askOrganizerInquiry");

  const footer = success ? (
    <div className="w-full px-1">
      <Button
        type="button"
        buttonType="filled"
        palette="default"
        size="large"
        className="w-full !justify-center"
        onClick={onClose}
      >
        {t("closeAfterSuccess")}
      </Button>
    </div>
  ) : (
    <div className="w-full px-1">
      <Button
        type="submit"
        form={ASK_ORGANIZER_INQUIRY_FORM_ID}
        buttonType="filled"
        palette="default"
        size="large"
        className="w-full !justify-center"
        disabled={submitting}
      >
        {t("submitButton")}
      </Button>
    </div>
  );

  return (
    <Create
      isOpen={isOpen}
      onClose={onClose}
      title={t("title")}
      description={t("description")}
      showBackButton={false}
      showNextButton={false}
      stepper={false}
      ariaLabel={t("ariaDialog")}
      footerContent={footer}
      footerClassName="!h-auto min-h-[112px] shrink-0 flex flex-col justify-end pb-8 pt-3 px-4"
    >
      {success ? (
        <div className="flex flex-col gap-3 py-2">
          <p className="font-inter text-[18px] font-semibold leading-[24px] text-[var(--color-content-default-primary)]">
            {t("successTitle")}
          </p>
          <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)]">
            {t("successDescription")}
          </p>
        </div>
      ) : (
        <form
          id={ASK_ORGANIZER_INQUIRY_FORM_ID}
          className="relative flex flex-col gap-6 pb-2"
          onSubmit={onSubmit}
          noValidate
        >
          {formError ? (
            <p
              role="alert"
              className="font-inter text-[14px] leading-[20px] text-[var(--color-border-default-negative-primary)]"
            >
              {formError}
            </p>
          ) : null}

          <TextInput
            type="email"
            name="email"
            autoComplete="email"
            label={t("emailLabel")}
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            error={emailError}
            inputSize="medium"
            showHelpIcon={false}
          />

          <TextArea
            name="message"
            label={t("questionLabel")}
            placeholder={t("questionPlaceholder")}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            error={questionError}
            size="medium"
            appearance="embedded"
            rows={4}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
          >
            <label htmlFor={`${ASK_ORGANIZER_INQUIRY_FORM_ID}-${ORGANIZER_INQUIRY_HONEYPOT_FIELD}`}>
              {t("honeypotLabel")}
            </label>
            <input
              id={`${ASK_ORGANIZER_INQUIRY_FORM_ID}-${ORGANIZER_INQUIRY_HONEYPOT_FIELD}`}
              type="text"
              name={ORGANIZER_INQUIRY_HONEYPOT_FIELD}
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => onHoneypotChange(e.target.value)}
            />
          </div>
        </form>
      )}
    </Create>
  );
}
