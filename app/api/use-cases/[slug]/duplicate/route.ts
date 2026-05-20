import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import messages from "../../../../../messages/en/index";
import { prisma } from "../../../../../lib/server/db";
import { isDatabaseConfigured } from "../../../../../lib/server/env";
import {
  dbUnavailable,
  notFound,
  unauthorized,
} from "../../../../../lib/server/responses";
import { getSessionUser } from "../../../../../lib/server/session";
import { apiRoute } from "../../../../../lib/server/apiRoute";
import { resolveUseCaseCompletedRule } from "../../../../../lib/useCaseCompletedRule";
import { isUseCaseDetailSlug } from "../../../../../lib/useCaseSyntheticPost";
import { normalizePublishedDocumentForEdit } from "../../../../../lib/create/normalizePublishedDocumentForEdit";
import { useCaseTemplateDuplicateTitle } from "../../../../../lib/useCaseTemplateDuplicate";

type RouteContext = { params: Promise<{ slug: string }> };

export const POST = apiRoute<RouteContext>(
  "useCases.bySlug.duplicate",
  async (_request, context) => {
    if (!isDatabaseConfigured()) {
      return dbUnavailable();
    }

    const user = await getSessionUser();
    if (!user) {
      return unauthorized();
    }

    const { slug } = await context.params;
    if (!isUseCaseDetailSlug(slug)) {
      return notFound();
    }

    const resolved = resolveUseCaseCompletedRule(
      slug,
      messages.pages.useCasesCompletedRules,
    );
    if (!resolved) {
      return notFound();
    }

    const { fixture } = resolved;
    const newRule = await prisma.publishedRule.create({
      data: {
        userId: user.id,
        title: useCaseTemplateDuplicateTitle(fixture.title),
        summary: fixture.summary,
        document: normalizePublishedDocumentForEdit(
          fixture.document,
        ) as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({
      rule: {
        id: newRule.id,
        title: newRule.title,
        summary: newRule.summary,
        createdAt: newRule.createdAt,
        updatedAt: newRule.updatedAt,
      },
    });
  },
);
