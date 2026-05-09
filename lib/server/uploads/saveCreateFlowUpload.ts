import { writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { CreateFlowUploadPurpose } from "./uploadConstants";
import {
  extensionForMime,
  isAllowedMime,
  maxBytesForPurpose,
} from "./uploadConstants";
import { ensureUploadRootExists, getUploadRootFromEnv } from "./uploadRoot";

export type SaveCreateFlowUploadResult = {
  /** Filename stem (UUID) without extension — used in GET URL. */
  id: string;
  /** Full relative URL path for clients, e.g. `/api/uploads/abc`. */
  urlPath: string;
  mimeType: string;
  byteLength: number;
};

/**
 * Writes bytes under `UPLOAD_ROOT/{id}{ext}` and returns a stable app URL path.
 */
export async function saveCreateFlowUpload(params: {
  purpose: CreateFlowUploadPurpose;
  buffer: Buffer;
  /** Declared MIME from the client `File.type` (validated server-side). */
  mimeType: string;
}): Promise<SaveCreateFlowUploadResult | { error: "misconfigured" | "validation" }> {
  const root = getUploadRootFromEnv();
  if (!root) {
    return { error: "misconfigured" };
  }

  const { purpose, buffer, mimeType } = params;
  if (buffer.length > maxBytesForPurpose(purpose)) {
    return { error: "validation" };
  }
  if (!isAllowedMime(purpose, mimeType)) {
    return { error: "validation" };
  }

  const id = randomUUID();
  const ext = extensionForMime(mimeType);
  const fileName = `${id}${ext}`;
  const absolutePath = path.join(root, fileName);

  await ensureUploadRootExists(root);
  await writeFile(absolutePath, buffer, { mode: 0o644 });

  return {
    id,
    urlPath: `/api/uploads/${id}`,
    mimeType: mimeType.toLowerCase().split(";")[0]?.trim() ?? "application/octet-stream",
    byteLength: buffer.length,
  };
}
