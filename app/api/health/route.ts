import { NextResponse } from "next/server";
import { prisma } from "../../../lib/server/db";
import { isDatabaseConfigured } from "../../../lib/server/env";
import { apiRoute } from "../../../lib/server/apiRoute";

export const GET = apiRoute("health.get", async () => {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      database: "not_configured",
    });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, database: "connected" });
  } catch {
    return NextResponse.json({ ok: false, database: "error" }, { status: 503 });
  }
});
