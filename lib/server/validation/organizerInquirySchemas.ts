import { z } from "zod";
import { ORGANIZER_INQUIRY_HONEYPOT_FIELD } from "../../organizerInquiryConstants";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254)
  .transform((s) => s.toLowerCase())
  .pipe(z.string().email("Enter a valid email address"));

const messageSchema = z
  .string()
  .trim()
  .min(10, "Please enter at least 10 characters")
  .max(10_000, "Message is too long");

/** Optional honeypot; non-empty after trim indicates a bot. */
const honeypotSchema = z
  .union([z.string(), z.undefined()])
  .optional()
  .transform((v) => (typeof v === "string" ? v.trim() : ""));

export const organizerInquiryBodySchema = z.object({
  email: emailSchema,
  message: messageSchema,
  [ORGANIZER_INQUIRY_HONEYPOT_FIELD]: honeypotSchema,
});

export type OrganizerInquiryBody = z.infer<typeof organizerInquiryBodySchema>;
