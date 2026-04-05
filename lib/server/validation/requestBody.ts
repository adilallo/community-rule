import { NextRequest, NextResponse } from "next/server";

export const MAX_JSON_BODY_BYTES = 512 * 1024;

export type LimitedJsonResult =
  | { ok: true; value: unknown }
  | { ok: false; response: NextResponse };

/**
 * Read the body as text (bounded by maxBytes), then JSON.parse.
 * Returns 413 when over limit; 400 when JSON is invalid.
 */
export async function readLimitedJson(
  request: NextRequest,
  maxBytes: number = MAX_JSON_BODY_BYTES,
): Promise<LimitedJsonResult> {
  const text = await request.text();
  if (text.length > maxBytes) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "payload_too_large",
            message: `Request body must be at most ${maxBytes} bytes`,
          },
        },
        { status: 413 },
      ),
    };
  }
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "invalid_json",
            message: "Invalid JSON",
          },
        },
        { status: 400 },
      ),
    };
  }
}
