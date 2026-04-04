"use client";

import { memo, useEffect, useState } from "react";
import { logger } from "../../../lib/logger";
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

const WebVitalsDashboardContainer = memo(() => {
  const [vitals, setVitals] = useState<Vitals>(createInitialVitals);
  const [metrics, setMetrics] = useState<Metrics>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await fetch("/api/web-vitals");
        const data = (await response.json()) as { metrics?: Metrics };
        setMetrics(data.metrics || {});
      } catch (error) {
        logger.error("Error fetching web vitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();

    if (typeof window !== "undefined") {
      import("web-vitals").then((webVitals) => {
        // web-vitals v4 typings don't expose legacy get* names the same way; runtime bundle still provides them for this dashboard.
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals as unknown as {
          getCLS: (
            _fn: (_m: { value: number; rating: string }) => void,
          ) => void;
          getFID: (
            _fn: (_m: { value: number; rating: string }) => void,
          ) => void;
          getFCP: (
            _fn: (_m: { value: number; rating: string }) => void,
          ) => void;
          getLCP: (
            _fn: (_m: { value: number; rating: string }) => void,
          ) => void;
          getTTFB: (
            _fn: (_m: { value: number; rating: string }) => void,
          ) => void;
        };

        getLCP((metric: { value: number; rating: VitalData["rating"] }) => {
          setVitals((prev) => ({
            ...prev,
            lcp: {
              value: Math.round(metric.value),
              rating: metric.rating,
            },
          }));
        });

        getFID((metric: { value: number; rating: VitalData["rating"] }) => {
          setVitals((prev) => ({
            ...prev,
            fid: {
              value: Math.round(metric.value),
              rating: metric.rating,
            },
          }));
        });

        getCLS((metric: { value: number; rating: VitalData["rating"] }) => {
          setVitals((prev) => ({
            ...prev,
            cls: {
              value: Math.round(metric.value * 1000) / 1000,
              rating: metric.rating,
            },
          }));
        });

        getFCP((metric: { value: number; rating: VitalData["rating"] }) => {
          setVitals((prev) => ({
            ...prev,
            fcp: {
              value: Math.round(metric.value),
              rating: metric.rating,
            },
          }));
        });

        getTTFB((metric: { value: number; rating: VitalData["rating"] }) => {
          setVitals((prev) => ({
            ...prev,
            ttfb: {
              value: Math.round(metric.value),
              rating: metric.rating,
            },
          }));
        });
      });
    }
  }, []);

  return (
    <WebVitalsDashboardView
      vitals={vitals}
      metrics={metrics}
      loading={loading}
    />
  );
});

WebVitalsDashboardContainer.displayName = "WebVitalsDashboard";

export default WebVitalsDashboardContainer;
