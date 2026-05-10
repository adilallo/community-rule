import { prisma } from "./db";
import { hashSessionToken, newSessionToken } from "./hash";
import { sendRuleStakeholderInviteEmail } from "./mail";
import { logRouteError } from "./requestId";
import { STAKEHOLDER_INVITE_TTL_MS } from "./ruleStakeholders";

export function stakeholderInviteVerifyUrl(origin: string, token: string): string {
  return `${origin}/api/invites/rule-stakeholder/verify?token=${encodeURIComponent(token)}`;
}

/**
 * Creates a pending {@link RuleStakeholder} row and sends the invite email.
 * On mail failure, deletes the row and returns `ok: false`.
 */
export async function createRuleStakeholderInviteAndSendMail(opts: {
  scope: string;
  requestId: string;
  origin: string;
  ruleId: string;
  ruleTitle: string;
  email: string;
  invitedByUserId: string;
  pepper: string;
}): Promise<{ ok: true } | { ok: false }> {
  const token = newSessionToken();
  const tokenHash = hashSessionToken(token, opts.pepper);
  const expiresAt = new Date(Date.now() + STAKEHOLDER_INVITE_TTL_MS);

  const row = await prisma.ruleStakeholder.create({
    data: {
      ruleId: opts.ruleId,
      email: opts.email,
      invitedByUserId: opts.invitedByUserId,
      inviteTokenHash: tokenHash,
      inviteExpiresAt: expiresAt,
    },
  });

  const verifyUrl = stakeholderInviteVerifyUrl(opts.origin, token);
  try {
    await sendRuleStakeholderInviteEmail(opts.email, verifyUrl, opts.ruleTitle);
    return { ok: true };
  } catch (err) {
    logRouteError(opts.scope, opts.requestId, err, {
      phase: "sendRuleStakeholderInviteEmail",
      email: opts.email,
    });
    try {
      await prisma.ruleStakeholder.delete({ where: { id: row.id } });
    } catch {
      /* best-effort cleanup */
    }
    return { ok: false };
  }
}
