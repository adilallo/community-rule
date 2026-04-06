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
