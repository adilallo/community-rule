/**
 * Client-safe slugifier that mirrors the one-time ingest that produced
 * `data/create/customRule/<section>.json` `methods[].id`. Lives in
 * `lib/create/` (not `lib/server/`) so client code — specifically the
 * template "Customize" prefill — can map template entry titles to the chip
 * ids the customize screens read out of `CreateFlowState`.
 *
 * Rules: NFKD-normalize, strip diacritics, drop apostrophes/brackets,
 * collapse non-alphanumerics to single hyphens, trim leading/trailing
 * hyphens. Server-side `lib/server/templateMethods.ts` re-exports this.
 */
export function methodSlugFromTitle(title: string): string {
  const folded = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const stripped = folded
    .toLowerCase()
    .replace(/['’`()\[\]]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return stripped;
}
