/**
 * Route-level fallback shown while `/create/...` RSC streams in. Mirrors the
 * create-flow chrome surface (top bar height + dark canvas) so the user sees
 * structural feedback instead of a flash of the previous page.
 */
export default function CreateFlowRouteLoading() {
  return (
    <div
      className="flex h-screen min-h-0 flex-col overflow-hidden bg-[var(--color-surface-default-primary)]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-14 w-full border-b border-[var(--color-border-default-primary)] md:h-16" />
      <div className="flex-1" />
    </div>
  );
}
