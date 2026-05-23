export function getSessionPepper(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET must be set (min 16 characters) for auth routes.",
    );
  }
  return secret;
}

export function getDatabaseUrl(): string | undefined {
  return process.env.CLOUDRON_POSTGRESQL_URL?.trim() || undefined;
}

export function getSmtpUrl(): string | undefined {
  const server = process.env.CLOUDRON_MAIL_SMTP_SERVER?.trim();
  const port = process.env.CLOUDRON_MAIL_SMTP_PORT?.trim();
  if (!server || !port) return undefined;

  const username = process.env.CLOUDRON_MAIL_SMTP_USERNAME?.trim() ?? "";
  const password = process.env.CLOUDRON_MAIL_SMTP_PASSWORD?.trim() ?? "";
  if (username || password) {
    const auth = `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`;
    return `smtp://${auth}${server}:${port}`;
  }
  return `smtp://${server}:${port}`;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}
