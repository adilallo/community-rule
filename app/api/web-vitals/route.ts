import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { logger } from "../../../lib/logger";

const WEB_VITALS_DIR = path.join(process.cwd(), ".next", "web-vitals");

interface WebVitalData {
  metric: string;
  data: {
    value: number;
    rating: string;
  };
  url: string;
  userAgent: string;
  timestamp: string;
  receivedAt: string;
}

interface WebVitalMetrics {
  [metric: string]: {
    count: number;
    average: number;
    min: number;
    max: number;
    goodCount: number;
    needsImprovementCount: number;
    poorCount: number;
    lastUpdated: string;
  };
}

// Ensure web-vitals directory exists
if (!fs.existsSync(WEB_VITALS_DIR)) {
  fs.mkdirSync(WEB_VITALS_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metric, data, url, userAgent, timestamp } = body as {
      metric: string;
      data: { value: number; rating: string };
      url: string;
      userAgent: string;
      timestamp: string;
    };

    // Store the metric data
    const vitalsData: WebVitalData = {
      metric,
      data,
      url,
      userAgent,
      timestamp: new Date(timestamp).toISOString(),
      receivedAt: new Date().toISOString(),
    };

    // Save to file (in production, you would save to a database)
    const filePath = path.join(WEB_VITALS_DIR, `${metric}.json`);
    let existingData: WebVitalData[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        existingData = JSON.parse(fileContent) as WebVitalData[];
      } catch (error) {
        const err = error as Error;
        logger.warn("Could not parse existing vitals data:", err.message);
      }
    }

    existingData.push(vitalsData);

    // Keep only last 100 entries per metric
    if (existingData.length > 100) {
      existingData = existingData.slice(-100);
    }

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    // Log for monitoring
    logger.info(
      `Web Vital received: ${metric} = ${data.value}ms (${data.rating})`,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Error processing web vital:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const metrics: WebVitalMetrics = {};

    if (fs.existsSync(WEB_VITALS_DIR)) {
      const files = fs.readdirSync(WEB_VITALS_DIR);

      files.forEach((file) => {
        if (file.endsWith(".json")) {
          const metric = file.replace(".json", "");
          const fileContent = fs.readFileSync(
            path.join(WEB_VITALS_DIR, file),
            "utf8",
          );
          const data = JSON.parse(fileContent) as WebVitalData[];

          if (data.length > 0) {
            const values = data
              .map((d) => d.data.value)
              .filter((v) => v !== undefined);
            const ratings = data
              .map((d) => d.data.rating)
              .filter((r) => r !== undefined);

            metrics[metric] = {
              count: data.length,
              average:
                values.length > 0
                  ? Math.round(
                      values.reduce((a, b) => a + b, 0) / values.length,
                    )
                  : 0,
              min: values.length > 0 ? Math.min(...values) : 0,
              max: values.length > 0 ? Math.max(...values) : 0,
              goodCount: ratings.filter((r) => r === "good").length,
              needsImprovementCount: ratings.filter(
                (r) => r === "needs-improvement",
              ).length,
              poorCount: ratings.filter((r) => r === "poor").length,
              lastUpdated: data[data.length - 1]?.receivedAt || "",
            };
          }
        }
      });
    }

    return NextResponse.json({ metrics });
  } catch (error) {
    logger.error("Error fetching web vitals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
