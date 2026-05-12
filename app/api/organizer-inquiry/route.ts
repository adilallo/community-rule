import { NextRequest, NextResponse } from "next/server";
import { sendOrganizerInquiryNotification } from "../../../lib/server/mail";
import { rateLimitKey } from "../../../lib/server/rateLimit";
import {
  errorJson,
  rateLimited,
  serverMisconfigured,
} from "../../../lib/server/responses";
import { logRouteError } from "../../../lib/server/requestId";
import { apiRoute } from "../../../lib/server/apiRoute";
import { ORGANIZER_INQUIRY_HONEYPOT_FIELD } from "../../../lib/organizerInquiryConstants";
import { organizerInquiryBodySchema } from "../../../lib/server/validation/organizerInquirySchemas";
import { readLimitedJson } from "../../../lib/server/validation/requestBody";
import { jsonFromZodError } from "../../../lib/server/validation/zodHttp";

const SCOPE = "organizer-inquiry.submit";
const EMAIL_MIN_INTERVAL_MS = 60 * 1000;
const IP_MIN_INTERVAL_MS = 20 * 1000;

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function organizerInquiryTo(): string | null {
  const raw = process.env.ORGANIZER_INQUIRY_TO?.trim();
  return raw && raw.length > 0 ? raw : null;
}

export const POST = apiRoute(SCOPE, async (request: NextRequest, _ctx, { requestId }) => {
  const parsedBody = await readLimitedJson(request);
  if (parsedBody.ok === false) {
    return parsedBody.response;
  }

  const validated = organizerInquiryBodySchema.safeParse(parsedBody.value);
  if (!validated.success) {
    return jsonFromZodError(validated.error);
  }

  const { email, message } = validated.data;
  const honeypot = validated.data[ORGANIZER_INQUIRY_HONEYPOT_FIELD];

  if (honeypot.length > 0) {
    // Silent success for bots — do not send mail or reveal rejection.
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(request);

  const rlEmail = rateLimitKey(`organizer-inquiry-email:${email}`, EMAIL_MIN_INTERVAL_MS);
  if (rlEmail.ok === false) {
    return rateLimited(rlEmail.retryAfterMs);
  }

  const rlIp = rateLimitKey(`organizer-inquiry-ip:${ip}`, IP_MIN_INTERVAL_MS);
  if (rlIp.ok === false) {
    return rateLimited(rlIp.retryAfterMs);
  }

  const to = organizerInquiryTo();
  if (!to) {
    return serverMisconfigured("ORGANIZER_INQUIRY_TO is not configured");
  }

  const from = process.env.SMTP_FROM ?? "noreply@localhost";

  try {
    await sendOrganizerInquiryNotification({
      to,
      fromEmail: from,
      visitorEmail: email,
      message,
      requestId,
    });
  } catch (err) {
    logRouteError(SCOPE, requestId, err, { phase: "sendOrganizerInquiryNotification" });
    return errorJson(
      "mail_failed",
      "We could not send your message. Please try again later.",
      502,
    );
  }

  return NextResponse.json({ ok: true });
});
