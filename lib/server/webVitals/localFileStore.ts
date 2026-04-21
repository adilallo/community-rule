import fs from "fs";
import path from "path";
import { logger } from "../../logger";

const WEB_VITALS_DIR = path.join(process.cwd(), ".next", "web-vitals");

export interface WebVitalData {
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

export interface WebVitalMetrics {
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

function ensureWebVitalsDir(): void {
  if (!fs.existsSync(WEB_VITALS_DIR)) {
    fs.mkdirSync(WEB_VITALS_DIR, { recursive: true });
  }
}

export function appendLocalWebVital(vitalsData: WebVitalData): void {
  ensureWebVitalsDir();
  const filePath = path.join(WEB_VITALS_DIR, `${vitalsData.metric}.json`);
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

  if (existingData.length > 100) {
    existingData = existingData.slice(-100);
  }

  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
}

export function readLocalAggregatedMetrics(): WebVitalMetrics {
  const metrics: WebVitalMetrics = {};

  if (!fs.existsSync(WEB_VITALS_DIR)) {
    return metrics;
  }

  const files = fs.readdirSync(WEB_VITALS_DIR);

  files.forEach((file) => {
    if (!file.endsWith(".json")) return;
    const metric = file.replace(".json", "");
    let data: WebVitalData[];
    try {
      const fileContent = fs.readFileSync(
        path.join(WEB_VITALS_DIR, file),
        "utf8",
      );
      data = JSON.parse(fileContent) as WebVitalData[];
    } catch (error) {
      logger.warn(
        `Skipping corrupt web vitals file ${file}:`,
        (error as Error).message,
      );
      return;
    }

    if (data.length === 0) return;

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
          ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          : 0,
      min: values.length > 0 ? Math.min(...values) : 0,
      max: values.length > 0 ? Math.max(...values) : 0,
      goodCount: ratings.filter((r) => r === "good").length,
      needsImprovementCount: ratings.filter((r) => r === "needs-improvement")
        .length,
      poorCount: ratings.filter((r) => r === "poor").length,
      lastUpdated: data[data.length - 1]?.receivedAt || "",
    };
  });

  return metrics;
}
