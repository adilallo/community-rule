import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/server/db";
import { getSessionPepper, isDatabaseConfigured } from "../../../lib/server/env";
import {
  hashSessionToken,
  newSessionToken,
} from "../../../lib/server/hash";
import { sendRuleStakeholderInviteEmail } from "../../../lib/server/mail";
import { rateLimitKey } from "../../../lib/server/rateLimit";
import {
  dbUnavailable,
  errorJson,
  rateLimited,
  serverMisconfigured,
  unauthorized,
} from "../../../lib/server/responses";
import { logRouteError } from "../../../lib/server/requestId";
import { stakeholderInviteVerifyUrl } from "../../../lib/server/ruleStakeholderInviteOps";
import { STAKEHOLDER_INVITE_TTL_MS } from "../../../lib/server/ruleStakeholders";
import { getSessionUser } from "../../../lib/server/session";
import { apiRoute } from "../../../lib/server/apiRoute";
import { getPublicOrigin } from "../../../lib/server/publicOrigin";
import {
  publishRuleBodySchema,
  uniqueStakeholderEmailsForPublish,
} from "../../../lib/server/validation/createFlowSchemas";
import { readLimitedJson } from "../../../lib/server/validation/requestBody";
import { jsonFromZodError } from "../../../lib/server/validation/zodHttp";

export const GET = apiRoute("rules.list", async (request: NextRequest) => {
  if (!isDatabaseConfigured()) {
    return dbUnavailable();
  }

  const { searchParams } = new URL(request.url);
  const take = Math.min(Number(searchParams.get("limit") ?? "50") || 50, 100);

  /** Public catalog: mirror profile “my rules” recency semantics (last touched first). */
  const rules = await prisma.publishedRule.findMany({
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    take,
    select: {
      id: true,
      title: true,
      summary: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ rules });
});

export const POST = apiRoute(
  "rules.publish",
  async (request: NextRequest, _ctx, { requestId }) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const parsedBody = await readLimitedJson(request);
    if (parsedBody.ok === false) {
      return parsedBody.response;
    }

    const validated = publishRuleBodySchema.safeParse(parsedBody.value);
    if (!validated.success) {
      return jsonFromZodError(validated.error);
    }

    const { title, summary, document, stakeholderEmails } = validated.data;
    const inviteEmails = uniqueStakeholderEmailsForPublish(
      stakeholderEmails,
      user.email,
    );

    if (inviteEmails.length > 0) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown";
      const rl = rateLimitKey(`publish-stakeholders-ip:${ip}`, 60_000);
      if (rl.ok === false) {
        return rateLimited(rl.retryAfterMs);
      }
    }

    if (inviteEmails.length === 0) {
      const rule = await prisma.publishedRule.create({
        data: {
          userId: user.id,
          title,
          summary,
          document: document as Prisma.InputJsonValue,
        },
      });

      return NextResponse.json({
        rule: {
          id: rule.id,
          title: rule.title,
          summary: rule.summary,
          createdAt: rule.createdAt,
        },
      });
    }

    let pepper: string;
    try {
      pepper = getSessionPepper();
    } catch (err) {
      logRouteError("rules.publish", requestId, err, {
        phase: "getSessionPepper",
      });
      return serverMisconfigured();
    }

    const expiresAt = new Date(Date.now() + STAKEHOLDER_INVITE_TTL_MS);
    const { rule, invites } = await prisma.$transaction(async (tx) => {
      const created = await tx.publishedRule.create({
        data: {
          userId: user.id,
          title,
          summary,
          document: document as Prisma.InputJsonValue,
        },
      });
      const toSend: { email: string; token: string }[] = [];
      for (const email of inviteEmails) {
        const token = newSessionToken();
        const tokenHash = hashSessionToken(token, pepper);
        await tx.ruleStakeholder.create({
          data: {
            ruleId: created.id,
            email,
            invitedByUserId: user.id,
            inviteTokenHash: tokenHash,
            inviteExpiresAt: expiresAt,
          },
        });
        toSend.push({ email, token });
      }
      return { rule: created, invites: toSend };
    });

    const origin = getPublicOrigin(request);
    try {
      for (const inv of invites) {
        const verifyUrl = stakeholderInviteVerifyUrl(origin, inv.token);
        await sendRuleStakeholderInviteEmail(inv.email, verifyUrl, title);
      }
    } catch (err) {
      logRouteError("rules.publish", requestId, err, {
        phase: "sendRuleStakeholderInviteEmail",
      });
      try {
        await prisma.publishedRule.delete({ where: { id: rule.id } });
      } catch (delErr) {
        logRouteError("rules.publish", requestId, delErr, {
          phase: "rollbackPublishAfterMailFailure",
        });
      }
      return errorJson(
        "mail_failed",
        "Could not send stakeholder invites",
        502,
      );
    }

    return NextResponse.json({
      rule: {
        id: rule.id,
        title: rule.title,
        summary: rule.summary,
        createdAt: rule.createdAt,
      },
    });
  },
);
