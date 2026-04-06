import { unstable_noStore as noStore } from "next/cache";
import { isDatabaseConfigured } from "./env";
import { getSessionUser } from "./session";

/**
 * Whether the current request has a valid session, for marketing shell SSR.
 * Aligns with GET /api/auth/session: no DB → treat as signed out; errors → signed out.
 *
 * `noStore()` avoids any static/prerender reuse where HTML was built without the request cookie
 * but the client still receives `initialSignedIn: true` (hydration mismatch on Log in vs Profile).
 */
export async function getNavAuthSignedIn(): Promise<boolean> {
  noStore();
  if (!isDatabaseConfigured()) return false;
  try {
    const user = await getSessionUser();
    return user != null;
  } catch {
    return false;
  }
}
