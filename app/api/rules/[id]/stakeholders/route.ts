import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/server/db";
import {
  getSessionPepper,
  isDatabaseConfigured,
} from "../../../../../lib/server/env";
import { rateLimitKey } from "../../../../../lib/server/rateLimit";
import { apiRoute } from "../../../../../lib/server/apiRoute";
import { logRouteError } from "../../../../../lib/server/requestId";
import { createRuleStakeholderInviteAndSendMail } from "../../../../../lib/server/ruleStakeholderInviteOps";
import {
  conflict,
  dbUnavailable,
  errorJson,
  notFound,
  rateLimited,
  serverMisconfigured,
  unauthorized,
} from "../../../../../lib/server/responses";
import { getSessionUser } from "../../../../../lib/server/session";
import { getPublicOrigin } from "../../../../../lib/server/publicOrigin";
import {
  MAX_STAKEHOLDER_EMAILS,
  postRuleStakeholderBodySchema,
} from "../../../../../lib/server/validation/createFlowSchemas";
import { readLimitedJson } from "../../../../../lib/server/validation/requestBody";
import { jsonFromZodError } from "../../../../../lib/server/validation/zodHttp";

type RouteContext = { params: Promise<{ id: string }> };

async function ownedRuleMeta(ruleId: string, userId: string) {
  return prisma.publishedRule.findFirst({
    where: { id: ruleId, userId },
    select: { id: true, title: true },
  });
}

export const GET = apiRoute<RouteContext>(
  "rules.stakeholders.list",
  async (_request, context) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const { id: ruleId } = await context.params;
    const rule = await ownedRuleMeta(ruleId, user.id);
    if (!rule) {
      return notFound();
    }

    const rows = await prisma.ruleStakeholder.findMany({
      where: { ruleId: rule.id },
      orderBy: [{ invitedAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        email: true,
        invitedAt: true,
        acceptedAt: true,
        inviteTokenHash: true,
      },
    });

    return NextResponse.json({
      stakeholders: rows.map((r) => ({
        id: r.id,
        email: r.email,
        invitedAt: r.invitedAt.toISOString(),
        acceptedAt: r.acceptedAt?.toISOString() ?? null,
        status:
          r.inviteTokenHash !== null ? ("pending" as const) : ("accepted" as const),
      })),
    });
  },
);

export const POST = apiRoute<RouteContext>(
  "rules.stakeholders.add",
  async (request: NextRequest, context, { requestId }) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const { id: ruleId } = await context.params;
    const rule = await ownedRuleMeta(ruleId, user.id);
    if (!rule) {
      return notFound();
    }

    const parsedBody = await readLimitedJson(request);
    if (parsedBody.ok === false) {
      return parsedBody.response;
    }

    const validated = postRuleStakeholderBodySchema.safeParse(parsedBody.value);
    if (!validated.success) {
      return jsonFromZodError(validated.error);
    }

    const email = validated.data.email;
    if (email === user.email.trim().toLowerCase()) {
      return errorJson(
        "validation_error",
        "You cannot invite your own account email",
        400,
      );
    }

    const existing = await prisma.ruleStakeholder.findFirst({
      where: { ruleId: rule.id, email },
    });
    if (existing) {
      return conflict("That email is already invited for this rule");
    }

    const count = await prisma.ruleStakeholder.count({
      where: { ruleId: rule.id },
    });
    if (count >= MAX_STAKEHOLDER_EMAILS) {
      return errorJson(
        "validation_error",
        `You can invite at most ${MAX_STAKEHOLDER_EMAILS} stakeholders per rule`,
        400,
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const rl = rateLimitKey(`rule-stakeholders-add-ip:${ip}`, 60_000);
    if (rl.ok === false) {
      return rateLimited(rl.retryAfterMs);
    }

    let pepper: string;
    try {
      pepper = getSessionPepper();
    } catch (err) {
      logRouteError("rules.stakeholders.add", requestId, err, {
        phase: "getSessionPepper",
      });
      return serverMisconfigured();
    }

    const origin = getPublicOrigin(request);
    const sent = await createRuleStakeholderInviteAndSendMail({
      scope: "rules.stakeholders.add",
      requestId,
      origin,
      ruleId: rule.id,
      ruleTitle: rule.title,
      email,
      invitedByUserId: user.id,
      pepper,
    });

    if (!sent.ok) {
      return errorJson(
        "mail_failed",
        "Could not send stakeholder invite",
        502,
      );
    }

    const created = await prisma.ruleStakeholder.findFirst({
      where: { ruleId: rule.id, email },
      select: { id: true, email: true, invitedAt: true },
    });

    return NextResponse.json(
      {
        stakeholder: created && {
          id: created.id,
          email: created.email,
          invitedAt: created.invitedAt.toISOString(),
          acceptedAt: null,
          status: "pending" as const,
        },
      },
      { status: 201 },
    );
  },
);
