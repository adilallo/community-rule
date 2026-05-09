import type { CreateFlowUploadPurpose } from "../../create/createFlowUploadPurpose";

export type { CreateFlowUploadPurpose };
export { CREATE_FLOW_UPLOAD_PURPOSES } from "../../create/createFlowUploadPurpose";

/** Max body size for multipart upload (bytes). */
export const CREATE_FLOW_UPLOAD_MAX_BYTES = 12 * 1024 * 1024;

const COMMUNITY_MAX = 5 * 1024 * 1024;
const CUSTOM_MAX = 10 * 1024 * 1024;

const IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const CUSTOM_EXTRA_MIMES = new Set(["application/pdf"]);

export function maxBytesForPurpose(purpose: CreateFlowUploadPurpose): number {
  return purpose === "communityAvatar" ? COMMUNITY_MAX : CUSTOM_MAX;
}

export function isAllowedMime(
  purpose: CreateFlowUploadPurpose,
  mime: string,
): boolean {
  const m = mime.toLowerCase().split(";")[0]?.trim() ?? "";
  if (IMAGE_MIMES.has(m)) return true;
  if (purpose === "customMethodAttachment" && CUSTOM_EXTRA_MIMES.has(m)) {
    return true;
  }
  return false;
}

/** Extension including dot, from normalized mime (lowercase). */
export function extensionForMime(mime: string): string {
  const m = mime.toLowerCase().split(";")[0]?.trim() ?? "";
  switch (m) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "application/pdf":
      return ".pdf";
    default:
      return ".bin";
  }
}

/** Strict id: uuid v4 filename stem (no extension in id param for GET). */
const UPLOAD_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUploadFileId(id: string): boolean {
  return UPLOAD_ID_RE.test(id);
}
