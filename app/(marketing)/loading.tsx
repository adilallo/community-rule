/**
 * Lightweight skeleton shown while the next marketing route streams. Matches
 * the page background so navigations feel instant on the user's phone instead
 * of stalling on the previous page until RSC payload arrives.
 */
export default function MarketingRouteLoading() {
  return (
    <div
      className="min-h-screen w-full bg-[var(--color-surface-default-primary)]"
      aria-busy="true"
      aria-live="polite"
    />
  );
}
