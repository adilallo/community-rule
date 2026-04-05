import { NextResponse } from "next/server";

export function dbUnavailable(): NextResponse {
  return NextResponse.json(
    { error: "Database is not configured (DATABASE_URL)." },
    { status: 503 },
  );
}
