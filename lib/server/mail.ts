import nodemailer from "nodemailer";
import { logger } from "../logger";

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const url = process.env.SMTP_URL;

  if (!url) {
    if (process.env.NODE_ENV === "development") {
      logger.info(`[dev] OTP for ${to}: ${code}`);
      return;
    }
    throw new Error("SMTP_URL is not configured");
  }

  const transporter = nodemailer.createTransport(url);
  const from = process.env.SMTP_FROM ?? "noreply@localhost";

  await transporter.sendMail({
    from,
    to,
    subject: "Your Community Rule sign-in code",
    text: `Your sign-in code is: ${code}\n\nIt expires in 10 minutes.`,
  });
}
