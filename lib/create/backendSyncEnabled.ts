/**
 * Server draft sync for the create flow.
 * Default-on: set `NEXT_PUBLIC_ENABLE_BACKEND_SYNC=false` to disable locally.
 */
export function isBackendSyncEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_BACKEND_SYNC !== "false";
}
