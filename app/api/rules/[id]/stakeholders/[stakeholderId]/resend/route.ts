import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../../../lib/server/env";
import { hashSessionToken, newSessionToken } from "../../../../../../../lib/server/hash";
import { sendRuleStakeholderInviteEmail } from "../../../../../../../lib/server/mail";
import { apiRoute } from "../../../../../../../lib/server/apiRoute";
import { logRouteError } from "../../../../../../../lib/server/requestId";
import { stakeholderInviteVerifyUrl } from "../../../../../../../lib/server/ruleStakeholderInviteOps";
import { STAKEHOLDER_INVITE_TTL_MS } from "../../../../../../../lib/server/ruleStakeholders";
import {
  dbUnavailable,
  errorJson,
  forbidden,
  notFound,
  rateLimited,
  serverMisconfigured,
  unauthorized,
} from "../../../../../../../lib/server/responses";
import { getSessionUser } from "../../../../../../../lib/server/session";
import { rateLimitKey } from "../../../../../../../lib/server/rateLimit";
import { getPublicOrigin } from "../../../../../../../lib/server/publicOrigin";

type RouteContext = { params: Promise<{ id: string; stakeholderId: string }> };

export const POST = apiRoute<RouteContext>(
  "rules.stakeholders.resend",
  async (request: NextRequest, context, { requestId }) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const { id: ruleId, stakeholderId } = await context.params;

    const row = await prisma.ruleStakeholder.findFirst({
      where: { id: stakeholderId, ruleId },
      select: {
        id: true,
        email: true,
        inviteTokenHash: true,
        inviteExpiresAt: true,
        rule: { select: { userId: true, title: true } },
      },
    });

    if (!row) {
      return notFound();
    }
    if (row.rule.userId !== user.id) {
      return forbidden();
    }
    if (row.inviteTokenHash === null) {
      return errorJson(
        "validation_error",
        "This stakeholder has already accepted the invite",
        400,
      );
    }

    const rl = rateLimitKey(`rule-stakeholders-resend:${row.id}`, 60_000);
    if (rl.ok === false) {
      return rateLimited(rl.retryAfterMs);
    }

    let pepper: string;
    try {
      pepper = getSessionPepper();
    } catch (err) {
      logRouteError("rules.stakeholders.resend", requestId, err, {
        phase: "getSessionPepper",
      });
      return serverMisconfigured();
    }

    const prevHash = row.inviteTokenHash;
    const prevExp = row.inviteExpiresAt;
    const token = newSessionToken();
    const newHash = hashSessionToken(token, pepper);
    const newExp = new Date(Date.now() + STAKEHOLDER_INVITE_TTL_MS);

    await prisma.ruleStakeholder.update({
      where: { id: row.id },
      data: {
        inviteTokenHash: newHash,
        inviteExpiresAt: newExp,
      },
    });

    const verifyUrl = stakeholderInviteVerifyUrl(getPublicOrigin(request), token);
    try {
      await sendRuleStakeholderInviteEmail(row.email, verifyUrl, row.rule.title);
    } catch (err) {
      logRouteError("rules.stakeholders.resend", requestId, err, {
        phase: "sendRuleStakeholderInviteEmail",
      });
      await prisma.ruleStakeholder
        .update({
          where: { id: row.id },
          data: {
            inviteTokenHash: prevHash,
            inviteExpiresAt: prevExp,
          },
        })
        .catch(() => {});
      return errorJson(
        "mail_failed",
        "Could not resend stakeholder invite",
        502,
      );
    }

    return NextResponse.json({ ok: true });
  },
);
