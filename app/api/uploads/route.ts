import { NextRequest, NextResponse } from "next/server";
import { isDatabaseConfigured } from "../../../lib/server/env";
import {
  dbUnavailable,
  errorJson,
  serverMisconfigured,
  unauthorized,
  rateLimited,
} from "../../../lib/server/responses";
import { getSessionUser } from "../../../lib/server/session";
import { apiRoute } from "../../../lib/server/apiRoute";
import { rateLimitKey } from "../../../lib/server/rateLimit";
import { saveCreateFlowUpload } from "../../../lib/server/uploads/saveCreateFlowUpload";
import { getUploadRootFromEnv } from "../../../lib/server/uploads/uploadRoot";
import {
  CREATE_FLOW_UPLOAD_MAX_BYTES,
  type CreateFlowUploadPurpose,
} from "../../../lib/server/uploads/uploadConstants";

function isPurpose(x: string): x is CreateFlowUploadPurpose {
  return x === "communityAvatar" || x === "customMethodAttachment";
}

export const POST = apiRoute("uploads.post", async (request: NextRequest) => {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const user = await getSessionUser();
  if (!user) {
    return unauthorized();
  }

  if (!getUploadRootFromEnv()) {
    return serverMisconfigured(
      "File uploads are not configured (UPLOAD_ROOT is unset).",
    );
  }

  const rl = rateLimitKey(`upload:${user.id}`, 5_000);
  if (rl.ok === false) {
    return rateLimited(rl.retryAfterMs);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorJson(
      "payload_too_large",
      "Upload body is too large or malformed.",
      413,
    );
  }

  const purposeRaw = formData.get("purpose");
  const file = formData.get("file");

  if (typeof purposeRaw !== "string" || !isPurpose(purposeRaw)) {
    return errorJson(
      "validation_error",
      "Invalid or missing `purpose` (expected communityAvatar | customMethodAttachment).",
      400,
    );
  }

  if (!(file instanceof File)) {
    return errorJson(
      "validation_error",
      "Missing `file` field (multipart file).",
      400,
    );
  }

  if (file.size > CREATE_FLOW_UPLOAD_MAX_BYTES) {
    return errorJson(
      "payload_too_large",
      `File exceeds maximum allowed size (${CREATE_FLOW_UPLOAD_MAX_BYTES} bytes).`,
      413,
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";

  const saved = await saveCreateFlowUpload({
    purpose: purposeRaw,
    buffer: buf,
    mimeType,
  });

  if ("error" in saved) {
    if (saved.error === "misconfigured") {
      return serverMisconfigured(
        "File uploads are not configured (UPLOAD_ROOT is unset).",
      );
    }
    return errorJson(
      "validation_error",
      "File type or size is not allowed for this upload purpose.",
      400,
    );
  }

  return NextResponse.json({
    url: saved.urlPath,
    id: saved.id,
    mimeType: saved.mimeType,
    byteLength: saved.byteLength,
  });
});
