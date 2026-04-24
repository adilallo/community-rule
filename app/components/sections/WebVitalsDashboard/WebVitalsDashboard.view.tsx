import type { WebVitalsDashboardViewProps } from "./WebVitalsDashboard.types";

const getRatingColor = (rating: string): string => {
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

const getRatingIcon = (rating: string): string => {
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

function formatValue(metric: string, value: number): string {
  if (metric === "cls") {
    return value.toFixed(3);
  }
  return `${value}ms`;
}

function WebVitalsDashboardView({
  vitals,
  metrics,
  loading,
  storage,
  copy,
  rumDashboardUrl,
}: WebVitalsDashboardViewProps) {
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
        {copy.title}
      </h2>

      {storage === "external" && (
        <div
          className="mb-6 p-4 rounded-lg border border-[var(--color-border-default-primary)] bg-[var(--color-surface-default-secondary)] text-[var(--font-size-body-medium)] text-[var(--color-content-default-secondary)]"
          role="status"
        >
          <p className="font-semibold text-[var(--color-content-default-primary)] mb-2">
            {copy.externalNoticeTitle}
          </p>
          <p className="mb-3">{copy.externalNoticeBody}</p>
          {rumDashboardUrl ? (
            <a
              href={rumDashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-content-default-primary)] underline font-medium"
            >
              {copy.externalDashboardLinkLabel}
            </a>
          ) : null}
        </div>
      )}

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
                {copy.valueLabel}: {formatValue(metric, data.value)}
              </div>
              <div className="capitalize">
                {copy.ratingLabel}: {data.rating.replace("-", " ")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(metrics).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-content-default-primary)]">
            {copy.historicalMetricsTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics).map(([metric, data]) => (
              <div
                key={metric}
                className="p-4 border rounded-lg bg-[var(--color-surface-default-secondary)]"
              >
                <h4 className="font-semibold mb-2">{metric.toUpperCase()}</h4>
                <div className="text-sm space-y-1">
                  <div>
                    {copy.countLabel}: {data.count}
                  </div>
                  <div>
                    {copy.averageLabel}: {formatValue(metric, data.average)}
                  </div>
                  <div>
                    {copy.rangeLabel}: {formatValue(metric, data.min)} -{" "}
                    {formatValue(metric, data.max)}
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="text-green-600">
                      {copy.goodLabel}: {data.goodCount}
                    </span>
                    <span className="text-yellow-600">
                      {copy.needsImprovementLabel}: {data.needsImprovementCount}
                    </span>
                    <span className="text-red-600">
                      {copy.poorLabel}: {data.poorCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-[var(--color-surface-default-secondary)] rounded-lg">
        <h3 className="font-semibold mb-2 text-[var(--color-content-default-primary)]">
          {copy.performanceGuidelinesTitle}
        </h3>
        <ul className="text-sm space-y-1 text-[var(--color-content-default-secondary)]">
          <li>• {copy.guidelines.lcp}</li>
          <li>• {copy.guidelines.fid}</li>
          <li>• {copy.guidelines.cls}</li>
          <li>• {copy.guidelines.fcp}</li>
          <li>• {copy.guidelines.ttfb}</li>
        </ul>
      </div>
    </div>
  );
}

export default WebVitalsDashboardView;
