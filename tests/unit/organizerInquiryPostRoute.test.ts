import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendOrganizerInquiryNotificationMock = vi.fn();

vi.mock("../../lib/server/mail", () => ({
  sendOrganizerInquiryNotification: (...args: unknown[]) =>
    sendOrganizerInquiryNotificationMock(...args),
}));

const rateLimitKeyMock = vi.hoisted(() =>
  vi.fn(
    (_key: string, _minIntervalMs: number): { ok: true } | { ok: false; retryAfterMs: number } => ({
      ok: true,
    }),
  ),
);

vi.mock("../../lib/server/rateLimit", () => ({
  rateLimitKey: (key: string, minIntervalMs: number) =>
    rateLimitKeyMock(key, minIntervalMs),
}));

import { POST } from "../../app/api/organizer-inquiry/route";

describe("POST /api/organizer-inquiry", () => {
  beforeEach(() => {
    sendOrganizerInquiryNotificationMock.mockReset();
    sendOrganizerInquiryNotificationMock.mockResolvedValue(undefined);
    rateLimitKeyMock.mockReset();
    rateLimitKeyMock.mockImplementation(() => ({ ok: true as const }));
    process.env.ORGANIZER_INQUIRY_TO = "organizers@example.com";
  });

  afterEach(() => {
    delete process.env.ORGANIZER_INQUIRY_TO;
  });

  it("returns 200 and sends mail for a valid payload", async () => {
    const res = await POST(
      new NextRequest("https://x.test/api/organizer-inquiry", {
        method: "POST",
        body: JSON.stringify({
          email: "Visitor@Example.com",
          message: "How do we run consensus meetings?",
          company: "",
        }),
      }),
      undefined,
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(sendOrganizerInquiryNotificationMock).toHaveBeenCalledTimes(1);
    const arg = sendOrganizerInquiryNotificationMock.mock.calls[0][0];
    expect(arg.visitorEmail).toBe("visitor@example.com");
    expect(arg.message).toBe("How do we run consensus meetings?");
  });

  it("returns 200 without sending mail when honeypot is filled", async () => {
    const res = await POST(
      new NextRequest("https://x.test/api/organizer-inquiry", {
        method: "POST",
        body: JSON.stringify({
          email: "spam@example.com",
          message: "How do we run consensus meetings?",
          company: "Evil Corp",
        }),
      }),
      undefined,
    );

    expect(res.status).toBe(200);
    expect(sendOrganizerInquiryNotificationMock).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(
      new NextRequest("https://x.test/api/organizer-inquiry", {
        method: "POST",
        body: JSON.stringify({
          email: "not-an-email",
          message: "How do we run consensus meetings?",
          company: "",
        }),
      }),
      undefined,
    );

    expect(res.status).toBe(400);
    expect(sendOrganizerInquiryNotificationMock).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limited", async () => {
    rateLimitKeyMock.mockReturnValue({
      ok: false as const,
      retryAfterMs: 1000,
    });

    const res = await POST(
      new NextRequest("https://x.test/api/organizer-inquiry", {
        method: "POST",
        body: JSON.stringify({
          email: "a@b.co",
          message: "How do we run consensus meetings?",
          company: "",
        }),
      }),
      undefined,
    );

    expect(res.status).toBe(429);
    expect(sendOrganizerInquiryNotificationMock).not.toHaveBeenCalled();
  });

  it("returns 500 when ORGANIZER_INQUIRY_TO is unset", async () => {
    delete process.env.ORGANIZER_INQUIRY_TO;

    const res = await POST(
      new NextRequest("https://x.test/api/organizer-inquiry", {
        method: "POST",
        body: JSON.stringify({
          email: "a@b.co",
          message: "How do we run consensus meetings?",
          company: "",
        }),
      }),
      undefined,
    );

    expect(res.status).toBe(500);
    expect(sendOrganizerInquiryNotificationMock).not.toHaveBeenCalled();
  });
});
