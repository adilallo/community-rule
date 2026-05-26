"use client";

import Link from "next/link";
import Create from "../Create";
import TextInput from "../../controls/TextInput";
import TextArea from "../../controls/TextArea";
import Button from "../../buttons/Button";
import {
  ASK_ORGANIZER_INQUIRY_FORM_ID,
  ORGANIZER_INQUIRY_HONEYPOT_FIELD,
} from "../../../../lib/organizerInquiryConstants";
import type { AskOrganizerInquiryModalViewProps } from "./AskOrganizerInquiryModal.types";

/**
 * Figma: Community Rule System — Modal / Ask an Organizer (22078-587823)
 */
export function AskOrganizerInquiryModalView({
  isOpen,
  onClose,
  copy,
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
        {copy.closeAfterSuccess}
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
        {copy.submitButton}
      </Button>
    </div>
  );

  return (
    <Create
      isOpen={isOpen}
      onClose={onClose}
      backdropVariant="blurredYellow"
      title={copy.title}
      description={copy.description}
      showBackButton={false}
      showNextButton={false}
      stepper={false}
      ariaLabel={copy.ariaDialog}
      footerContent={footer}
      footerClassName="!h-auto min-h-[112px] shrink-0 flex flex-col justify-end pb-8 pt-3 px-4"
      belowCard={
        <Link
          href="/"
          className="font-inter font-normal text-[14px] leading-[20px] text-[var(--color-content-invert-tertiary,#2d2d2d)] text-center hover:opacity-90"
          onClick={() => onClose()}
        >
          {copy.backToHome}
        </Link>
      }
    >
      {success ? (
        <div className="flex flex-col gap-3 py-2">
          <p className="font-inter text-[18px] font-semibold leading-[24px] text-[var(--color-content-default-primary)]">
            {copy.successTitle}
          </p>
          <p className="font-inter text-[14px] leading-[20px] text-[var(--color-content-default-secondary)]">
            {copy.successDescription}
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
            label={copy.emailLabel}
            placeholder={copy.emailPlaceholder}
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            error={emailError}
            inputSize="medium"
            showHelpIcon={false}
          />

          <TextArea
            name="message"
            label={copy.questionLabel}
            placeholder={copy.questionPlaceholder}
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
              {copy.honeypotLabel}
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
