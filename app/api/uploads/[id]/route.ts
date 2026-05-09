import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { apiRoute } from "../../../../lib/server/apiRoute";
import {
  notFound,
  serverMisconfigured,
} from "../../../../lib/server/responses";
import { resolveUploadedFileById } from "../../../../lib/server/uploads/resolveUploadedFile";
import { getUploadRootFromEnv } from "../../../../lib/server/uploads/uploadRoot";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Public read for opaque upload ids (no auth). Unguessable UUID stem;
 * do not use for sensitive documents without revisiting policy.
 */
export const GET = apiRoute<RouteContext>(
  "uploads.byId",
  async (_request, context) => {
    if (!getUploadRootFromEnv()) {
      return serverMisconfigured(
        "File uploads are not configured (UPLOAD_ROOT is unset).",
      );
    }

    const { id } = await context.params;
    const resolved = await resolveUploadedFileById(id);
    if (!resolved) {
      return notFound("Upload not found");
    }

    const body = await readFile(resolved.absolutePath);
    return new NextResponse(new Uint8Array(body), {
      status: 200,
      headers: {
        "Content-Type": resolved.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  },
);
