import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  getDatabaseUrl,
  getSmtpUrl,
  isDatabaseConfigured,
} from "../../lib/server/env";

const ENV_KEYS = [
  "CLOUDRON_POSTGRESQL_URL",
  "CLOUDRON_MAIL_SMTP_SERVER",
  "CLOUDRON_MAIL_SMTP_PORT",
  "CLOUDRON_MAIL_SMTP_USERNAME",
  "CLOUDRON_MAIL_SMTP_PASSWORD",
] as const;

const ORIGINAL_ENV = Object.fromEntries(
  ENV_KEYS.map((key) => [key, process.env[key]]),
) as Record<(typeof ENV_KEYS)[number], string | undefined>;

function clearEnv(): void {
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
}

function restoreEnv(): void {
  for (const key of ENV_KEYS) {
    const originalValue = ORIGINAL_ENV[key];
    if (originalValue === undefined) {
      delete process.env[key];
      continue;
    }
    process.env[key] = originalValue;
  }
}

beforeEach(() => {
  clearEnv();
});

afterEach(() => {
  restoreEnv();
});

describe("getDatabaseUrl / isDatabaseConfigured", () => {
  it("returns the URL when CLOUDRON_POSTGRESQL_URL is set", () => {
    process.env.CLOUDRON_POSTGRESQL_URL =
      "postgresql://user:pass@localhost:5432/db";
    expect(getDatabaseUrl()).toBe(
      "postgresql://user:pass@localhost:5432/db",
    );
    expect(isDatabaseConfigured()).toBe(true);
  });

  it("returns undefined when unset", () => {
    expect(getDatabaseUrl()).toBeUndefined();
    expect(isDatabaseConfigured()).toBe(false);
  });

  it("treats whitespace-only as unset", () => {
    process.env.CLOUDRON_POSTGRESQL_URL = "   ";
    expect(getDatabaseUrl()).toBeUndefined();
    expect(isDatabaseConfigured()).toBe(false);
  });
});

describe("getSmtpUrl", () => {
  it("returns undefined when server or port is missing", () => {
    process.env.CLOUDRON_MAIL_SMTP_SERVER = "localhost";
    expect(getSmtpUrl()).toBeUndefined();

    clearEnv();
    process.env.CLOUDRON_MAIL_SMTP_PORT = "1025";
    expect(getSmtpUrl()).toBeUndefined();
  });

  it("builds a no-auth URL for Mailhog-style local SMTP", () => {
    process.env.CLOUDRON_MAIL_SMTP_SERVER = "localhost";
    process.env.CLOUDRON_MAIL_SMTP_PORT = "1025";
    expect(getSmtpUrl()).toBe("smtp://localhost:1025");
  });

  it("builds an authenticated URL with encoded credentials", () => {
    process.env.CLOUDRON_MAIL_SMTP_SERVER = "smtp.example.com";
    process.env.CLOUDRON_MAIL_SMTP_PORT = "587";
    process.env.CLOUDRON_MAIL_SMTP_USERNAME = "user@domain";
    process.env.CLOUDRON_MAIL_SMTP_PASSWORD = "p@ss:word";
    expect(getSmtpUrl()).toBe(
      "smtp://user%40domain:p%40ss%3Aword@smtp.example.com:587",
    );
  });

  it("includes auth when only username is set", () => {
    process.env.CLOUDRON_MAIL_SMTP_SERVER = "smtp.example.com";
    process.env.CLOUDRON_MAIL_SMTP_PORT = "25";
    process.env.CLOUDRON_MAIL_SMTP_USERNAME = "apikey";
    expect(getSmtpUrl()).toBe("smtp://apikey:@smtp.example.com:25");
  });
});
