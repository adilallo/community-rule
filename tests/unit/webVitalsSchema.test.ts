import { describe, expect, it } from "vitest";
import { webVitalIngestSchema } from "../../lib/server/validation/webVitalsSchema";

describe("webVitalIngestSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = webVitalIngestSchema.safeParse({
      metric: "lcp",
      data: { value: 1200, rating: "good" },
      url: "https://example.com/path",
      userAgent: "jest",
      timestamp: "2026-01-01T00:00:00.000Z",
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts numeric timestamp", () => {
    const parsed = webVitalIngestSchema.safeParse({
      metric: "cls",
      data: { value: 0.05, rating: "good" },
      url: "https://example.com/",
      timestamp: 1_700_000_000_000,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects empty metric", () => {
    const parsed = webVitalIngestSchema.safeParse({
      metric: "",
      data: { value: 1, rating: "good" },
      url: "https://example.com/",
      timestamp: "2026-01-01T00:00:00.000Z",
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects empty url", () => {
    const parsed = webVitalIngestSchema.safeParse({
      metric: "lcp",
      data: { value: 1, rating: "good" },
      url: "",
      timestamp: "2026-01-01T00:00:00.000Z",
    });
    expect(parsed.success).toBe(false);
  });
});
