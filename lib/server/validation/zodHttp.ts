import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function jsonFromZodError(error: ZodError): NextResponse {
  const issue = error.issues[0];
  const message = issue?.message ?? "Validation failed";
  return NextResponse.json(
    {
      error: {
        code: "validation_error",
        message,
      },
      details: error.flatten(),
    },
    { status: 400 },
  );
}
