"use client";

import React, { useState, useEffect, memo } from "react";

const WebVitalsDashboard = memo(() => {
  const [vitals, setVitals] = useState({
    lcp: { value: 0, rating: "unknown" },
    fid: { value: 0, rating: "unknown" },
    cls: { value: 0, rating: "unknown" },
    fcp: { value: 0, rating: "unknown" },
    ttfb: { value: 0, rating: "unknown" },
  });

  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Web Vitals data from API
    const fetchVitals = async () => {
      try {
        const response = await fetch("/api/web-vitals");
        const data = await response.json();
        setMetrics(data.metrics || {});
      } catch (error) {
        console.error("Error fetching web vitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();

    // Set up Web Vitals tracking
    if (typeof window !== "undefined") {
      import("web-vitals").then(
        ({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          // Track Largest Contentful Paint
          getLCP((metric) => {
            setVitals((prev) => ({
              ...prev,
              lcp: {
                value: Math.round(metric.value),
                rating: metric.rating,
              },
            }));
          });

          // Track First Input Delay
          getFID((metric) => {
            setVitals((prev) => ({
              ...prev,
              fid: {
                value: Math.round(metric.value),
                rating: metric.rating,
              },
            }));
          });

          // Track Cumulative Layout Shift
          getCLS((metric) => {
            setVitals((prev) => ({
              ...prev,
              cls: {
                value: Math.round(metric.value * 1000) / 1000,
                rating: metric.rating,
              },
            }));
          });

          // Track First Contentful Paint
          getFCP((metric) => {
            setVitals((prev) => ({
              ...prev,
              fcp: {
                value: Math.round(metric.value),
                rating: metric.rating,
              },
            }));
          });

          // Track Time to First Byte
          getTTFB((metric) => {
            setVitals((prev) => ({
              ...prev,
              ttfb: {
                value: Math.round(metric.value),
                rating: metric.rating,
              },
            }));
          });
        },
      );
    }
  }, []);

  const getRatingColor = (rating) => {
    switch (rating) {
      case "good":
        return "text-green-600 bg-green-50";
      case "needs-improvement":
        return "text-yellow-600 bg-yellow-50";
      case "poor":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case "good":
        return "✅";
      case "needs-improvement":
        return "⚠️";
      case "poor":
        return "❌";
      default:
        return "❓";
    }
  };

  const formatValue = (metric, value) => {
    if (metric === "cls") {
      return value.toFixed(3);
    }
    return `${value}ms`;
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-[var(--color-content-default-primary)]">
        Web Vitals Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(vitals).map(([metric, data]) => (
          <div
            key={metric}
            className={`p-4 border rounded-lg ${getRatingColor(data.rating)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{metric.toUpperCase()}</h3>
              <span className="text-2xl">{getRatingIcon(data.rating)}</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">
                Value: {formatValue(metric, data.value)}
              </div>
              <div className="capitalize">
                Rating: {data.rating.replace("-", " ")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Metrics */}
      {Object.keys(metrics).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-content-default-primary)]">
            Historical Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics).map(([metric, data]) => (
              <div
                key={metric}
                className="p-4 border rounded-lg bg-[var(--color-surface-default-secondary)]"
              >
                <h4 className="font-semibold mb-2">{metric.toUpperCase()}</h4>
                <div className="text-sm space-y-1">
                  <div>Count: {data.count}</div>
                  <div>Average: {formatValue(metric, data.average)}</div>
                  <div>
                    Range: {formatValue(metric, data.min)} -{" "}
                    {formatValue(metric, data.max)}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-green-600">
                      Good: {data.goodCount}
                    </span>
                    <span className="text-yellow-600">
                      Needs Improvement: {data.needsImprovementCount}
                    </span>
                    <span className="text-red-600">Poor: {data.poorCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Guidelines */}
      <div className="p-4 bg-[var(--color-surface-default-secondary)] rounded-lg">
        <h3 className="font-semibold mb-2 text-[var(--color-content-default-primary)]">
          Performance Guidelines
        </h3>
        <ul className="text-sm space-y-1 text-[var(--color-content-default-secondary)]">
          <li>
            • <strong>LCP:</strong> Good &lt; 2.5s, Needs Improvement 2.5-4s,
            Poor &gt; 4s
          </li>
          <li>
            • <strong>FID:</strong> Good &lt; 100ms, Needs Improvement
            100-300ms, Poor &gt; 300ms
          </li>
          <li>
            • <strong>CLS:</strong> Good &lt; 0.1, Needs Improvement 0.1-0.25,
            Poor &gt; 0.25
          </li>
          <li>
            • <strong>FCP:</strong> Good &lt; 1.8s, Needs Improvement 1.8-3s,
            Poor &gt; 3s
          </li>
          <li>
            • <strong>TTFB:</strong> Good &lt; 800ms, Needs Improvement
            800-1800ms, Poor &gt; 1800ms
          </li>
        </ul>
      </div>
    </div>
  );
});

WebVitalsDashboard.displayName = "WebVitalsDashboard";

export default WebVitalsDashboard;
