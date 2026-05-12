import nodemailer from "nodemailer";
import { logger } from "../logger";

export async function sendMagicLinkEmail(
  to: string,
  verifyUrl: string,
): Promise<void> {
  const url = process.env.SMTP_URL;

  if (!url) {
    if (process.env.NODE_ENV === "development") {
      logger.info(`[dev] Magic link for ${to}: ${verifyUrl}`);
      return;
    }
    throw new Error("SMTP_URL is not configured");
  }

  const transporter = nodemailer.createTransport(url);
  const from = process.env.SMTP_FROM ?? "noreply@localhost";

  await transporter.sendMail({
    from,
    to,
    subject: "Sign in to Community Rule",
    text: `Open this link to sign in (it expires in 15 minutes):\n\n${verifyUrl}\n\nIf you did not request this, you can ignore this email.`,
  });
}

/** CR-103: confirm control of the new inbox before `User.email` is updated. */
/** Stakeholder invite after rule publish (one-time link, same dev/Mailhog pattern as magic link). */
export async function sendRuleStakeholderInviteEmail(
  to: string,
  verifyUrl: string,
  ruleTitle: string,
): Promise<void> {
  const url = process.env.SMTP_URL;

  if (!url) {
    if (process.env.NODE_ENV === "development") {
      logger.info(
        `[dev] Rule stakeholder invite (${ruleTitle}) for ${to}: ${verifyUrl}`,
      );
      return;
    }
    throw new Error("SMTP_URL is not configured");
  }

  const transporter = nodemailer.createTransport(url);
  const from = process.env.SMTP_FROM ?? "noreply@localhost";

  await transporter.sendMail({
    from,
    to,
    subject: `You're invited to view a Community Rule: ${ruleTitle}`,
    text: `You've been invited to view "${ruleTitle}" on Community Rule.\n\nOpen this link to create your account (or sign in) and open the rule. The link expires in 15 minutes and works once:\n\n${verifyUrl}\n\nIf you did not expect this, you can ignore this email.`,
  });
}

/** CR-107: notify support/organizers when a visitor submits the Ask an organizer form. */
export async function sendOrganizerInquiryNotification(params: {
  /** Destination inbox (e.g. from ORGANIZER_INQUIRY_TO). */
  to: string;
  fromEmail: string;
  visitorEmail: string;
  message: string;
  requestId: string;
}): Promise<void> {
  const { to, fromEmail, visitorEmail, message, requestId } = params;
  const url = process.env.SMTP_URL;

  if (!url) {
    if (process.env.NODE_ENV === "development") {
      logger.info(
        `[dev] Organizer inquiry (request ${requestId}) from ${visitorEmail} to ${to}:\n${message}`,
      );
      return;
    }
    throw new Error("SMTP_URL is not configured");
  }

  const transporter = nodemailer.createTransport(url);

  await transporter.sendMail({
    from: fromEmail,
    to,
    replyTo: visitorEmail,
    subject: `Ask an organizer inquiry from ${visitorEmail}`,
    text: `Request ID: ${requestId}\nFrom: ${visitorEmail}\n\n${message}\n`,
  });
}

export async function sendEmailChangeEmail(
  to: string,
  verifyUrl: string,
): Promise<void> {
  const url = process.env.SMTP_URL;

  if (!url) {
    if (process.env.NODE_ENV === "development") {
      logger.info(`[dev] Email change verify for ${to}: ${verifyUrl}`);
      return;
    }
    throw new Error("SMTP_URL is not configured");
  }

  const transporter = nodemailer.createTransport(url);
  const from = process.env.SMTP_FROM ?? "noreply@localhost";

  await transporter.sendMail({
    from,
    to,
    subject: "Confirm your new Community Rule email",
    text: `You asked to change the email on your Community Rule account.\n\nOpen this link to confirm the new address (it expires in 15 minutes):\n\n${verifyUrl}\n\nIf you did not request this change, you can ignore this email. Your current login is unchanged until you confirm.`,
  });
}

