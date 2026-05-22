import { NextRequest, NextResponse } from "next/server";
import { logger } from "../../../lib/logger";
import { apiRoute } from "../../../lib/server/apiRoute";
import { getWebVitalsStorageMode } from "../../../lib/server/webVitals/mode";
import {
  appendLocalWebVital,
  readLocalAggregatedMetrics,
  type WebVitalData,
} from "../../../lib/server/webVitals/localFileStore";
import { readLimitedJson } from "../../../lib/server/validation/requestBody";
import { webVitalIngestSchema } from "../../../lib/server/validation/webVitalsSchema";
import { jsonFromZodError } from "../../../lib/server/validation/zodHttp";

function normalizeTimestamp(raw: string | number): string {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return new Date(raw).toISOString();
  }
  return new Date(raw).toISOString();
}

function logExternalIngest(body: WebVitalData): void {
  const line = JSON.stringify({
    kind: "web_vital_ingest",
    metric: body.metric,
    value: body.data.value,
    rating: body.data.rating,
    url: body.url,
    receivedAt: body.receivedAt,
  });
  logger.info(line);
}

export const POST = apiRoute("webVitals.post", async (request: NextRequest) => {
  const limited = await readLimitedJson(request);
  if (limited.ok === false) {
    return limited.response;
  }

  const parsed = webVitalIngestSchema.safeParse(limited.value);
  if (!parsed.success) return jsonFromZodError(parsed.error);

  const body = parsed.data;

  const vitalsData: WebVitalData = {
    metric: body.metric,
    data: {
      value: body.data.value,
      rating: body.data.rating,
    },
    url: body.url,
    userAgent: body.userAgent,
    timestamp: normalizeTimestamp(body.timestamp),
    receivedAt: new Date().toISOString(),
  };

  const mode = getWebVitalsStorageMode();

  if (mode === "external") {
    logExternalIngest(vitalsData);
    return NextResponse.json({ success: true, storage: "external" });
  }

  appendLocalWebVital(vitalsData);
  logger.info(
    `Web Vital received: ${body.metric} = ${body.data.value}ms (${body.data.rating})`,
  );

  return NextResponse.json({ success: true, storage: "local" });
});

export const GET = apiRoute("webVitals.get", async () => {
  const mode = getWebVitalsStorageMode();

  if (mode === "external") {
    return NextResponse.json({
      metrics: {},
      storage: "external" as const,
    });
  }

  const metrics = readLocalAggregatedMetrics();
  return NextResponse.json({ metrics, storage: "local" as const });
});
