import { getNavAuthSignedIn } from "../../../lib/server/navAuth";
import ConditionalNavigationClient from "./ConditionalNavigationClient";

/**
 * Resolves the session on the server so the header matches the HttpOnly cookie on the
 * first HTML response (no “Log in” flash before `/api/auth/session`).
 */
export default async function ConditionalNavigation() {
  const initialSignedIn = await getNavAuthSignedIn();
  return <ConditionalNavigationClient initialSignedIn={initialSignedIn} />;
}
