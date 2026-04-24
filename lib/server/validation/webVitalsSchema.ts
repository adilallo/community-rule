import { z } from "zod";

/** POST /api/web-vitals — browser ingest payload */
export const webVitalIngestSchema = z.object({
  metric: z.string().min(1).max(64),
  data: z.object({
    value: z.number().finite(),
    rating: z.string().min(1).max(32),
  }),
  url: z.string().min(1).max(8192),
  userAgent: z.string().max(512).optional().default(""),
  timestamp: z.union([z.string(), z.number()]),
});

export type WebVitalIngestInput = z.infer<typeof webVitalIngestSchema>;
