import { mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Directory for persisted user uploads (Cloudron localstorage mount in prod).
 * When unset, upload routes return `server_misconfigured`.
 */
export function getUploadRootFromEnv(): string | null {
  const raw = process.env.UPLOAD_ROOT?.trim();
  if (!raw) return null;
  return path.resolve(raw);
}

export async function ensureUploadRootExists(root: string): Promise<void> {
  await mkdir(root, { recursive: true });
}
