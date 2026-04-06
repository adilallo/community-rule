import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../lib/server/env";
import {
  hashSessionToken,
  newSessionToken,
} from "../../../../../lib/server/hash";
import { sendMagicLinkEmail } from "../../../../../lib/server/mail";
import { rateLimitKey } from "../../../../../lib/server/rateLimit";
import { dbUnavailable } from "../../../../../lib/server/responses";
import { logger } from "../../../../../lib/logger";
import { safeInternalPath } from "../../../../../lib/safeInternalPath";

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;
const EMAIL_MIN_INTERVAL_MS = 60 * 1000;
const IP_MIN_INTERVAL_MS = 20 * 1000;

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function readNextPath(body: unknown): string | null {
  if (!body || typeof body !== "object" || !("next" in body)) return null;
  const n = (body as { next: unknown }).next;
  if (typeof n !== "string") return null;
  return safeInternalPath(n);
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = normalizeEmail(
    body && typeof body === "object" && "email" in body
      ? (body as { email: unknown }).email
      : null,
  );
  if (!email) {
    return NextResponse.json(
      { error: "Valid email required" },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rlEmail = rateLimitKey(`magic-email:${email}`, EMAIL_MIN_INTERVAL_MS);
  if (rlEmail.ok === false) {
    return NextResponse.json(
      { error: "Too many requests", retryAfterMs: rlEmail.retryAfterMs },
      { status: 429 },
    );
  }

  const rlIp = rateLimitKey(`magic-ip:${ip}`, IP_MIN_INTERVAL_MS);
  if (rlIp.ok === false) {
    return NextResponse.json(
      { error: "Too many requests", retryAfterMs: rlIp.retryAfterMs },
      { status: 429 },
    );
  }

  let pepper: string;
  try {
    pepper = getSessionPepper();
  } catch {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const token = newSessionToken();
  const tokenHash = hashSessionToken(token, pepper);
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS);
  const nextPath = readNextPath(body);

  await prisma.magicLinkToken.deleteMany({ where: { email } });
  await prisma.magicLinkToken.create({
    data: {
      email,
      tokenHash,
      expiresAt,
      nextPath: nextPath ?? undefined,
    },
  });

  const origin = request.nextUrl.origin;
  const verifyUrl = `${origin}/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`;

  try {
    await sendMagicLinkEmail(email, verifyUrl);
  } catch (err) {
    logger.error("sendMagicLinkEmail failed:", err);
    await prisma.magicLinkToken.deleteMany({ where: { email } });
    return NextResponse.json(
      { error: "Could not send email" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
