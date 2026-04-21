"use client";

import { memo, useEffect, useState } from "react";
import { useMessages } from "../../../contexts/MessagesContext";
import { logger } from "../../../../lib/logger";
import WebVitalsDashboardView from "./WebVitalsDashboard.view";
import type { Metrics, Vitals, VitalData } from "./WebVitalsDashboard.types";

const createInitialVital = (): VitalData => ({
  value: 0,
  rating: "unknown",
});

const createInitialVitals = (): Vitals => ({
  lcp: createInitialVital(),
  fid: createInitialVital(),
  cls: createInitialVital(),
  fcp: createInitialVital(),
  ttfb: createInitialVital(),
});

function reportWebVitalToApi(
  metric: keyof Vitals,
  value: number,
  rating: VitalData["rating"],
): void {
  if (typeof window === "undefined") return;
  if (rating === "unknown") return;

  const body = {
    metric,
    data: { value, rating },
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };

  void fetch("/api/web-vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch((err: unknown) => {
    logger.error("Web vitals ingest failed:", err);
  });
}

const WebVitalsDashboardContainer = memo(() => {
  const m = useMessages();
  const copy = m.webVitalsDashboard;
  const [vitals, setVitals] = useState<Vitals>(createInitialVitals);
  const [metrics, setMetrics] = useState<Metrics>({});
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState<"external" | "local">("local");

  const rumDashboardUrl =
    typeof process.env.NEXT_PUBLIC_RUM_DASHBOARD_URL === "string" &&
    process.env.NEXT_PUBLIC_RUM_DASHBOARD_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_RUM_DASHBOARD_URL.trim()
      : null;

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await fetch("/api/web-vitals");
        const data = (await response.json()) as {
          metrics?: Metrics;
          storage?: "external" | "local";
        };
        setMetrics(data.metrics || {});
        setStorage(data.storage === "external" ? "external" : "local");
      } catch (error) {
        logger.error("Error fetching web vitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();

    if (typeof window !== "undefined") {
      // web-vitals v4+ exposes onLCP / onCLS / … — legacy getLCP was removed.
      import("web-vitals").then(
        ({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
          onLCP((metric) => {
            const rating = metric.rating as VitalData["rating"];
            setVitals((prev) => ({
              ...prev,
              lcp: {
                value: Math.round(metric.value),
                rating,
              },
            }));
            reportWebVitalToApi("lcp", Math.round(metric.value), rating);
          });

          onFID((metric) => {
            const rating = metric.rating as VitalData["rating"];
            setVitals((prev) => ({
              ...prev,
              fid: {
                value: Math.round(metric.value),
                rating,
              },
            }));
            reportWebVitalToApi("fid", Math.round(metric.value), rating);
          });

          onCLS((metric) => {
            const rounded = Math.round(metric.value * 1000) / 1000;
            const rating = metric.rating as VitalData["rating"];
            setVitals((prev) => ({
              ...prev,
              cls: {
                value: rounded,
                rating,
              },
            }));
            reportWebVitalToApi("cls", rounded, rating);
          });

          onFCP((metric) => {
            const rating = metric.rating as VitalData["rating"];
            setVitals((prev) => ({
              ...prev,
              fcp: {
                value: Math.round(metric.value),
                rating,
              },
            }));
            reportWebVitalToApi("fcp", Math.round(metric.value), rating);
          });

          onTTFB((metric) => {
            const rating = metric.rating as VitalData["rating"];
            setVitals((prev) => ({
              ...prev,
              ttfb: {
                value: Math.round(metric.value),
                rating,
              },
            }));
            reportWebVitalToApi("ttfb", Math.round(metric.value), rating);
          });
        },
      );
    }
  }, []);

  return (
    <WebVitalsDashboardView
      vitals={vitals}
      metrics={metrics}
      loading={loading}
      storage={storage}
      copy={copy}
      rumDashboardUrl={rumDashboardUrl}
    />
  );
});

WebVitalsDashboardContainer.displayName = "WebVitalsDashboard";

export default WebVitalsDashboardContainer;
