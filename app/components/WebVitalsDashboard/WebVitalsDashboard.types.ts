export interface VitalData {
  value: number;
  rating: "good" | "needs-improvement" | "poor" | "unknown";
}

export interface Vitals {
  lcp: VitalData;
  fid: VitalData;
  cls: VitalData;
  fcp: VitalData;
  ttfb: VitalData;
}

export interface MetricData {
  count: number;
  average: number;
  min: number;
  max: number;
  goodCount: number;
  needsImprovementCount: number;
  poorCount: number;
  lastUpdated?: string;
}

export interface Metrics {
  [key: string]: MetricData;
}

export interface WebVitalsDashboardViewProps {
  vitals: Vitals;
  metrics: Metrics;
  loading: boolean;
}

