import path from "node:path";

/**
 * Root for committed seed JSON (`data/` in dev; `/app/seed-data` on Cloudron).
 *
 * Cloudron's localstorage addon mounts `/app/data` at runtime, so facet JSON
 * must not live there. The Dockerfile copies `data/` → `/app/seed-data` and
 * sets `SEED_DATA_DIR=/app/seed-data`.
 */
export function seedDataRoot(): string {
  const override = process.env.SEED_DATA_DIR?.trim();
  if (override) return override;
  return path.join(process.cwd(), "data");
}

export function methodFacetsJsonDir(): string {
  return path.join(seedDataRoot(), "create", "customRule");
}

export function templateFacetJsonPath(): string {
  return path.join(seedDataRoot(), "templates", "templateFacet.json");
}
