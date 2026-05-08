import { constants as fsConstants } from "node:fs";
import { access, readdir } from "node:fs/promises";
import path from "node:path";
import { getUploadRootFromEnv } from "./uploadRoot";
import { isValidUploadFileId } from "./uploadConstants";

export type ResolvedUploadFile = {
  absolutePath: string;
  /** MIME inferred from extension (no sidecar file in v1). */
  contentType: string;
};

function contentTypeForFilename(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

/**
 * Resolves `id` (UUID stem) to the single matching file `{id}.*` under UPLOAD_ROOT.
 * Returns null if missing, ambiguous, or invalid id.
 */
export async function resolveUploadedFileById(
  id: string,
): Promise<ResolvedUploadFile | null> {
  if (!isValidUploadFileId(id)) return null;
  const root = getUploadRootFromEnv();
  if (!root) return null;

  const entries = await readdir(root);
  const prefix = `${id}.`;
  const matches = entries.filter((e) => e.startsWith(prefix));
  if (matches.length !== 1) return null;

  const absolutePath = path.join(root, matches[0]!);
  try {
    await access(absolutePath, fsConstants.R_OK);
  } catch {
    return null;
  }

  return {
    absolutePath,
    contentType: contentTypeForFilename(matches[0]!),
  };
}
