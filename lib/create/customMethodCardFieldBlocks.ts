import { z } from "zod";

/** Serializable custom field blocks for a user-authored method card (wizard step 3). */
export type CustomMethodCardFieldBlock =
  | {
      kind: "text";
      id: string;
      blockTitle: string;
      placeholderText: string;
    }
  | {
      kind: "badges";
      id: string;
      blockTitle: string;
      options: string[];
    }
  | {
      kind: "upload";
      id: string;
      blockTitle: string;
      fileName?: string;
      /** App path from `POST /api/uploads` (e.g. `/api/uploads/{uuid}`). */
      assetUrl?: string;
    }
  | {
      kind: "proportion";
      id: string;
      blockTitle: string;
      defaultPercent: number;
    };

const customMethodTextBlockSchema = z
  .object({
    kind: z.literal("text"),
    id: z.string().max(80),
    blockTitle: z.string().max(200),
    placeholderText: z.string().max(8000),
  })
  .strict();

const customMethodBadgesBlockSchema = z
  .object({
    kind: z.literal("badges"),
    id: z.string().max(80),
    blockTitle: z.string().max(200),
    options: z.array(z.string().max(200)).max(50),
  })
  .strict();

const customMethodUploadBlockSchema = z
  .object({
    kind: z.literal("upload"),
    id: z.string().max(80),
    blockTitle: z.string().max(200),
    fileName: z.string().max(500).optional(),
    assetUrl: z.string().max(512).optional(),
  })
  .strict();

const customMethodProportionBlockSchema = z
  .object({
    kind: z.literal("proportion"),
    id: z.string().max(80),
    blockTitle: z.string().max(200),
    defaultPercent: z.number().int().min(1).max(100),
  })
  .strict();

export const customMethodCardFieldBlockSchema = z.discriminatedUnion("kind", [
  customMethodTextBlockSchema,
  customMethodBadgesBlockSchema,
  customMethodUploadBlockSchema,
  customMethodProportionBlockSchema,
]);

export const customMethodCardFieldBlocksByIdSchema = z
  .record(z.string().max(80), z.array(customMethodCardFieldBlockSchema).max(30))
  .optional();
