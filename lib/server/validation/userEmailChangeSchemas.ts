import { z } from "zod";

/** POST `/api/user/email-change/request` body (CR-103). */
export const emailChangeRequestBodySchema = z.object({
  newEmail: z
    .string()
    .trim()
    .min(1, "Email is required")
    .transform((s) => s.toLowerCase())
    .pipe(z.string().email({ message: "Valid email required" })),
});

export type EmailChangeRequestBody = z.infer<
  typeof emailChangeRequestBodySchema
>;
