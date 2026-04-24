"use client";

import WebVitalsDashboard from "../../components/sections/WebVitalsDashboard";
import TopNav from "../../components/navigation/TopNav";
import Footer from "../../components/navigation/Footer";
import { useMessages } from "../../contexts/MessagesContext";

export default function MonitorPageContent() {
  const m = useMessages();
  const p = m.pages.monitor;

  return (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <TopNav folderTop={false} />

      <main className="container mx-auto px-[var(--spacing-scale-024)] py-[var(--spacing-scale-032)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-[var(--spacing-scale-032)]">
            <h1 className="text-4xl font-bold text-[var(--color-content-default-primary)] mb-[var(--spacing-scale-016)]">
              {p.title}
            </h1>
            <p className="text-[var(--font-size-body-large)] text-[var(--color-content-default-secondary)]">
              {p.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-scale-032)] mb-[var(--spacing-scale-032)]">
            <div className="p-[var(--spacing-scale-024)] bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-measures-radius-medium)]">
              <h2 className="text-2xl font-semibold mb-[var(--spacing-scale-016)] text-[var(--color-content-default-primary)]">
                {p.performanceTargets.title}
              </h2>
              <div className="space-y-[var(--spacing-scale-012)]">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.performanceTargets.loadTime}
                  </span>
                  <span className="font-semibold text-green-600">
                    {p.performanceTargets.loadTimeTarget}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.performanceTargets.lcp}
                  </span>
                  <span className="font-semibold text-green-600">
                    {p.performanceTargets.lcpTarget}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.performanceTargets.fid}
                  </span>
                  <span className="font-semibold text-green-600">
                    {p.performanceTargets.fidTarget}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.performanceTargets.cls}
                  </span>
                  <span className="font-semibold text-green-600">
                    {p.performanceTargets.clsTarget}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.performanceTargets.lighthouse}
                  </span>
                  <span className="font-semibold text-green-600">
                    {p.performanceTargets.lighthouseTarget}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-[var(--spacing-scale-024)] bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-measures-radius-medium)]">
              <h2 className="text-2xl font-semibold mb-[var(--spacing-scale-016)] text-[var(--color-content-default-primary)]">
                {p.optimizationStatus.title}
              </h2>
              <div className="space-y-[var(--spacing-scale-012)]">
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.optimizationStatus.codeSplitting}
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.optimizationStatus.reactMemo}
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.optimizationStatus.imageOptimization}
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.optimizationStatus.fontPreloading}
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.optimizationStatus.bundleAnalysis}
                  </span>
                </div>
                <div className="flex items-center gap-[var(--spacing-scale-008)]">
                  <span className="text-green-600">✅</span>
                  <span className="text-[var(--font-size-body-medium)]">
                    {p.optimizationStatus.errorBoundaries}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <WebVitalsDashboard />

          <div className="mt-[var(--spacing-scale-032)] p-[var(--spacing-scale-024)] bg-[var(--color-surface-default-secondary)] rounded-[var(--radius-measures-radius-medium)]">
            <h2 className="text-2xl font-semibold mb-[var(--spacing-scale-016)] text-[var(--color-content-default-primary)]">
              {p.monitoringCommands.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-scale-016)]">
              <div>
                <h3 className="font-semibold mb-[var(--spacing-scale-008)] text-[var(--color-content-default-primary)]">
                  {p.monitoringCommands.bundleAnalyze.title}
                </h3>
                <code className="block p-[var(--spacing-scale-008)] bg-[var(--color-surface-inverse-brand-primary)] text-[var(--color-content-inverse-primary)] rounded-[var(--radius-measures-radius-small)] text-sm">
                  {p.monitoringCommands.bundleAnalyze.command}
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-[var(--spacing-scale-008)] text-[var(--color-content-default-primary)]">
                  {p.monitoringCommands.e2ePerformance.title}
                </h3>
                <code className="block p-[var(--spacing-scale-008)] bg-[var(--color-surface-inverse-brand-primary)] text-[var(--color-content-inverse-primary)] rounded-[var(--radius-measures-radius-small)] text-sm">
                  {p.monitoringCommands.e2ePerformance.command}
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-[var(--spacing-scale-008)] text-[var(--color-content-default-primary)]">
                  {p.monitoringCommands.lhciDesktop.title}
                </h3>
                <code className="block p-[var(--spacing-scale-008)] bg-[var(--color-surface-inverse-brand-primary)] text-[var(--color-content-inverse-primary)] rounded-[var(--radius-measures-radius-small)] text-sm">
                  {p.monitoringCommands.lhciDesktop.command}
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-[var(--spacing-scale-008)] text-[var(--color-content-default-primary)]">
                  {p.monitoringCommands.performanceBudget.title}
                </h3>
                <code className="block p-[var(--spacing-scale-008)] bg-[var(--color-surface-inverse-brand-primary)] text-[var(--color-content-inverse-primary)] rounded-[var(--radius-measures-radius-small)] text-sm">
                  {p.monitoringCommands.performanceBudget.command}
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
