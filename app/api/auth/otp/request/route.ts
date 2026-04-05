import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../lib/server/env";
import { hashOtpCode } from "../../../../../lib/server/hash";
import { sendOtpEmail } from "../../../../../lib/server/mail";
import { rateLimitKey } from "../../../../../lib/server/rateLimit";
import { dbUnavailable } from "../../../../../lib/server/responses";
import { logger } from "../../../../../lib/logger";

const OTP_TTL_MS = 10 * 60 * 1000;
const EMAIL_MIN_INTERVAL_MS = 60 * 1000;
const IP_MIN_INTERVAL_MS = 20 * 1000;

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
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
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rlEmail = rateLimitKey(`otp-email:${email}`, EMAIL_MIN_INTERVAL_MS);
  if (rlEmail.ok === false) {
    return NextResponse.json(
      { error: "Too many requests", retryAfterMs: rlEmail.retryAfterMs },
      { status: 429 },
    );
  }

  const rlIp = rateLimitKey(`otp-ip:${ip}`, IP_MIN_INTERVAL_MS);
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

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = hashOtpCode(code, pepper);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  await prisma.otpChallenge.deleteMany({ where: { email } });
  await prisma.otpChallenge.create({
    data: { email, codeHash, expiresAt },
  });

  try {
    await sendOtpEmail(email, code);
  } catch (err) {
    logger.error("sendOtpEmail failed:", err);
    await prisma.otpChallenge.deleteMany({ where: { email } });
    return NextResponse.json(
      { error: "Could not send email" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
