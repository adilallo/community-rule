import WebVitalsDashboard from "../components/WebVitalsDashboard";
import TopNav from "../components/navigation/TopNav";
import Footer from "../components/navigation/Footer";

export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <TopNav folderTop={false} />

      <main className="container mx-auto px-[var(--spacing-scale-024)] py-[var(--spacing-scale-032)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-[var(--spacing-scale-032)]">
            <h1 className="text-4xl font-bold text-[var(--color-content-default-primary)] mb-[var(--spacing-scale-016)]">
              Performance Monitoring
            </h1>
            <p className="text-[var(--font-size-body-large)] text-[var(--color-content-default-secondary)]">
              Real-time monitoring of Core Web Vitals and performance metrics
              for Community Rule 3.0
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-scale-032)] mb-[var(--spacing-scale-032)]">
            <div className="p-[var(--spacing-scale-024)] bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-measures-radius-medium)]">
              <h2 className="text-2xl font-semibold mb-[var(--spacing-scale-016)] text-[var(--color-content-default-primary)]">
                Performance Targets
              </h2>
              <div className="space-y-[var(--spacing-scale-012)]">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    Load Time
                  </span>
                  <span className="font-semibold text-green-600">
                    &lt; 2 seconds
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    LCP
                  </span>
                  <span className="font-semibold text-green-600">
                    &lt; 2.5s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    FID
                  </span>
                  <span className="font-semibold text-green-600">
                    &lt; 100ms
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    CLS
                  </span>
                  <span className="font-semibold text-green-600">&lt; 0.1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    Lighthouse Score
                  </span>
                  <span className="font-semibold text-green-600">&gt; 90</span>
                </div>
              </div>
            </div>

            <div className="p-[var(--spacing-scale-024)] bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-measures-radius-medium)]">
              <h2 className="text-2xl font-semibold mb-[var(--spacing-scale-016)] text-[var(--color-content-default-primary)]">
                Optimization Status
              </h2>
              <div className="space-y-[var(--spacing-scale-012)]">
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    Code Splitting & Dynamic Imports
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    React.memo Optimizations
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    Image Optimization
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    Font Preloading
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    Bundle Analysis
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    Error Boundaries
                  </span>
                </div>
              </div>
            </div>
          </div>

          <WebVitalsDashboard />

          <div className="mt-[var(--spacing-scale-032)] p-[var(--spacing-scale-024)] bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-measures-radius-medium)]">
            <h2 className="text-2xl font-semibold mb-[var(--spacing-scale-016)] text-[var(--color-content-default-primary)]">
              Monitoring Commands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-scale-016)]">
              <div>
                <h3 className="font-semibold mb-[var(--spacing-scale-008)] text-[var(--color-content-default-primary)]">
                  Bundle Analysis
                </h3>
                <code className="block p-[var(--spacing-scale-008)] bg-[var(--color-surface-inverse-brand-primary)] text-[var(--color-content-inverse-primary)] rounded-[var(--radius-measures-radius-small)] text-sm">
                  npm run bundle:analyze
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-[var(--spacing-scale-008)] text-[var(--color-content-default-primary)]">
                  Performance Monitor
                </h3>
                <code className="block p-[var(--spacing-scale-008)] bg-[var(--color-surface-inverse-brand-primary)] text-[var(--color-content-inverse-primary)] rounded-[var(--radius-measures-radius-small)] text-sm">
                  npm run performance:monitor
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-[var(--spacing-scale-008)] text-[var(--color-content-default-primary)]">
                  Web Vitals Tracking
                </h3>
                <code className="block p-[var(--spacing-scale-008)] bg-[var(--color-surface-inverse-brand-primary)] text-[var(--color-content-inverse-primary)] rounded-[var(--radius-measures-radius-small)] text-sm">
                  npm run web-vitals:track
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-[var(--spacing-scale-008)] text-[var(--color-content-default-primary)]">
                  All Monitoring
                </h3>
                <code className="block p-[var(--spacing-scale-008)] bg-[var(--color-surface-inverse-brand-primary)] text-[var(--color-content-inverse-primary)] rounded-[var(--radius-measures-radius-small)] text-sm">
                  npm run monitor:all
                </code>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
