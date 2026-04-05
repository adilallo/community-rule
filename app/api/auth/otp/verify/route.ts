import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../lib/server/env";
import { hashOtpCode } from "../../../../../lib/server/hash";
import {
  createSessionForUser,
  setSessionCookie,
} from "../../../../../lib/server/session";
import { dbUnavailable } from "../../../../../lib/server/responses";

const MAX_ATTEMPTS = 5;

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

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { email: rawEmail, code: rawCode } = body as {
    email?: unknown;
    code?: unknown;
  };

  const email = normalizeEmail(rawEmail);
  const code =
    typeof rawCode === "string"
      ? rawCode.replace(/\s/g, "")
      : String(rawCode ?? "");

  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { error: "Valid email and 6-digit code required" },
      { status: 400 },
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

  const challenge = await prisma.otpChallenge.findFirst({
    where: {
      email,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  if (challenge.attempts >= MAX_ATTEMPTS) {
    await prisma.otpChallenge.delete({ where: { id: challenge.id } });
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const expectedHash = hashOtpCode(code, pepper);
  if (expectedHash !== challenge.codeHash) {
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  await prisma.otpChallenge.deleteMany({ where: { email } });

  const user = await prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  const { token, expiresAt } = await createSessionForUser(user.id);
  await setSessionCookie(token, expiresAt);

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email },
  });
}
