/**
 * Manual prune-expired-sessions script for CR-85 verification.
 *
 * Usage (from repo root):
 *   node --env-file=.env --import tsx scripts/prune-sessions.ts            # global sweep
 *   node --env-file=.env --import tsx scripts/prune-sessions.ts <userId>   # per-user
 *
 * Intentionally does NOT import `lib/server/session` — that module pulls in
 * `next/headers` which requires a Next request context. For ad-hoc DB
 * surgery we talk to Prisma directly.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = process.argv[2];
  const now = new Date();
  const before = await prisma.session.count();
  const { count } = await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: now },
      ...(userId ? { userId } : {}),
    },
  });
  const after = await prisma.session.count();
  console.log(
    JSON.stringify(
      {
        scope: userId ?? "global",
        now: now.toISOString(),
        sessionsBefore: before,
        pruned: count,
        sessionsAfter: after,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
