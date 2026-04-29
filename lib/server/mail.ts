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

