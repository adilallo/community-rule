"use client";

/**
 * Figma: Community Rule System — Modal / Ask an Organizer (22078-587823)
 * File: agv0VBLiBlcnSAaiAORgPR, node 22078-587823
 */

import { memo, useCallback, useEffect, useState, type FormEvent } from "react";
import { AskOrganizerInquiryModalView } from "./AskOrganizerInquiryModal.view";
import type { AskOrganizerInquiryModalProps } from "./AskOrganizerInquiryModal.types";
import { ORGANIZER_INQUIRY_HONEYPOT_FIELD } from "../../../../lib/organizerInquiryConstants";
import { useTranslation } from "../../../contexts/MessagesContext";

const AskOrganizerInquiryModalContainer = memo<AskOrganizerInquiryModalProps>(
  ({ isOpen, onClose }) => {
    const t = useTranslation("modals.askOrganizerInquiry");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState(false);
    const [questionError, setQuestionError] = useState(false);

    useEffect(() => {
      if (!isOpen) {
        setEmail("");
        setMessage("");
        setHoneypot("");
        setSubmitting(false);
        setSuccess(false);
        setFormError(null);
        setEmailError(false);
        setQuestionError(false);
      }
    }, [isOpen]);

    const onSubmit = useCallback(
      async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        setEmailError(false);
        setQuestionError(false);
        setSubmitting(true);

        try {
          const res = await fetch("/api/organizer-inquiry", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              email,
              message,
              [ORGANIZER_INQUIRY_HONEYPOT_FIELD]: honeypot,
            }),
          });

          const data: unknown = await res.json().catch(() => null);

          if (res.ok) {
            setSuccess(true);
            return;
          }

          if (res.status === 429) {
            setFormError(t("rateLimitedError"));
            return;
          }

          if (
            data &&
            typeof data === "object" &&
            "error" in data &&
            data.error &&
            typeof data.error === "object" &&
            "message" in data.error &&
            typeof (data.error as { message: unknown }).message === "string"
          ) {
            const msg = (data.error as { message: string }).message;
            const lower = msg.toLowerCase();
            if (lower.includes("email")) {
              setEmailError(true);
            }
            if (lower.includes("character") || lower.includes("question")) {
              setQuestionError(true);
            }
            setFormError(msg);
            return;
          }

          setFormError(t("genericError"));
        } catch {
          setFormError(t("genericError"));
        } finally {
          setSubmitting(false);
        }
      },
      [email, message, honeypot, t],
    );

    return (
      <AskOrganizerInquiryModalView
        isOpen={isOpen}
        onClose={onClose}
        email={email}
        message={message}
        honeypot={honeypot}
        submitting={submitting}
        success={success}
        formError={formError}
        emailError={emailError}
        questionError={questionError}
        onEmailChange={setEmail}
        onMessageChange={setMessage}
        onHoneypotChange={setHoneypot}
        onSubmit={onSubmit}
      />
    );
  },
);

AskOrganizerInquiryModalContainer.displayName = "AskOrganizerInquiryModal";

export default AskOrganizerInquiryModalContainer;
