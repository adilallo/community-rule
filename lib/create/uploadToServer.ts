import type { CreateFlowUploadPurpose } from "./createFlowUploadPurpose";

export type UploadToServerResult = {
  url: string;
  id: string;
  mimeType: string;
  byteLength: number;
};

/**
 * Authenticated multipart upload to `POST /api/uploads`.
 * Caller must have a session cookie (same-origin fetch).
 */
export async function uploadCreateFlowFile(
  file: File,
  purpose: CreateFlowUploadPurpose,
): Promise<UploadToServerResult> {
  const formData = new FormData();
  formData.append("purpose", purpose);
  formData.append("file", file);

  const res = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
    credentials: "same-origin",
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = {};
  }

  const errParts = (() => {
    if (body && typeof body === "object" && "error" in body) {
      const e = (body as {
        error?: { message?: string; code?: string };
      }).error;
      if (!e) return { message: null as string | null, code: null as string | null };
      return {
        message: typeof e.message === "string" ? e.message : null,
        code: typeof e.code === "string" ? e.code : null,
      };
    }
    return { message: null, code: null };
  })();

  if (!res.ok) {
    const fallback =
      res.status === 413
        ? "FILE_TOO_LARGE"
        : res.status === 401
          ? "UNAUTHORIZED"
          : "UPLOAD_FAILED";
    const code = errParts.code ?? errParts.message ?? fallback;
    throw new UploadToServerError(res.status, code);
  }

  const data = body as {
    url?: string;
    id?: string;
    mimeType?: string;
    byteLength?: number;
  };
  if (
    typeof data.url !== "string" ||
    typeof data.id !== "string" ||
    typeof data.mimeType !== "string" ||
    typeof data.byteLength !== "number"
  ) {
    throw new UploadToServerError(res.status, "INVALID_RESPONSE");
  }

  return {
    url: data.url,
    id: data.id,
    mimeType: data.mimeType,
    byteLength: data.byteLength,
  };
}

export class UploadToServerError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string) {
    super(code);
    this.name = "UploadToServerError";
    this.status = status;
    this.code = code;
  }
}
