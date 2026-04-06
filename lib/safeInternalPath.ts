/** Allow only same-origin relative paths for open redirects after auth. */
export function safeInternalPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}
