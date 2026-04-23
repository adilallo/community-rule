import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sessionCreateMock = vi.fn();
const sessionDeleteManyMock = vi.fn();
const getSessionPepperMock = vi.fn();
const newSessionTokenMock = vi.fn();
const hashSessionTokenMock = vi.fn();
const loggerWarnMock = vi.fn();

vi.mock("../../lib/server/db", () => ({
  prisma: {
    session: {
      create: (...args: unknown[]) => sessionCreateMock(...args),
      deleteMany: (...args: unknown[]) => sessionDeleteManyMock(...args),
    },
  },
}));

vi.mock("../../lib/server/env", () => ({
  getSessionPepper: () => getSessionPepperMock(),
}));

vi.mock("../../lib/server/hash", () => ({
  hashSessionToken: (...args: unknown[]) => hashSessionTokenMock(...args),
  newSessionToken: () => newSessionTokenMock(),
}));

vi.mock("../../lib/logger", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: (...args: unknown[]) => loggerWarnMock(...args),
    error: vi.fn(),
  },
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import {
  createSessionForUser,
  pruneExpiredSessions,
} from "../../lib/server/session";

beforeEach(() => {
  sessionCreateMock.mockReset();
  sessionDeleteManyMock.mockReset();
  getSessionPepperMock.mockReset();
  newSessionTokenMock.mockReset();
  hashSessionTokenMock.mockReset();
  loggerWarnMock.mockReset();

  getSessionPepperMock.mockReturnValue("test-pepper");
  newSessionTokenMock.mockReturnValue("token-raw");
  hashSessionTokenMock.mockReturnValue("token-hash");
  sessionCreateMock.mockResolvedValue({});
  sessionDeleteManyMock.mockResolvedValue({ count: 0 });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("pruneExpiredSessions", () => {
  it("deletes globally expired rows when no userId is supplied", async () => {
    sessionDeleteManyMock.mockResolvedValueOnce({ count: 7 });

    const count = await pruneExpiredSessions();

    expect(count).toBe(7);
    expect(sessionDeleteManyMock).toHaveBeenCalledTimes(1);
    const arg = sessionDeleteManyMock.mock.calls[0]?.[0] as {
      where: { expiresAt: { lt: Date }; userId?: string };
    };
    expect(arg.where.userId).toBeUndefined();
    expect(arg.where.expiresAt.lt).toBeInstanceOf(Date);
  });

  it("scopes the prune to a single user when userId is supplied", async () => {
    sessionDeleteManyMock.mockResolvedValueOnce({ count: 2 });

    const count = await pruneExpiredSessions({ userId: "user-1" });

    expect(count).toBe(2);
    const arg = sessionDeleteManyMock.mock.calls[0]?.[0] as {
      where: { expiresAt: { lt: Date }; userId?: string };
    };
    expect(arg.where.userId).toBe("user-1");
    expect(arg.where.expiresAt.lt).toBeInstanceOf(Date);
  });

  it("never matches non-expired rows (multi-device safety)", async () => {
    await pruneExpiredSessions({ userId: "user-1" });

    const arg = sessionDeleteManyMock.mock.calls[0]?.[0] as {
      where: { expiresAt: { lt: Date } };
    };
    expect(Object.keys(arg.where.expiresAt)).toEqual(["lt"]);
  });
});

describe("createSessionForUser cleanup behaviour", () => {
  it("creates the new session and prunes the same user's expired rows", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);

    const result = await createSessionForUser("user-1");

    expect(result.token).toBe("token-raw");
    expect(result.expiresAt).toBeInstanceOf(Date);
    expect(sessionCreateMock).toHaveBeenCalledTimes(1);
    expect(sessionDeleteManyMock).toHaveBeenCalledTimes(1);
    const arg = sessionDeleteManyMock.mock.calls[0]?.[0] as {
      where: { userId?: string; expiresAt: { lt: Date } };
    };
    expect(arg.where.userId).toBe("user-1");
    expect(arg.where.expiresAt.lt).toBeInstanceOf(Date);
  });

  it("runs an additional global sweep when the probability roll succeeds", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.01);

    await createSessionForUser("user-1");

    expect(sessionDeleteManyMock).toHaveBeenCalledTimes(2);
    const userScoped = sessionDeleteManyMock.mock.calls[0]?.[0] as {
      where: { userId?: string };
    };
    const globalSweep = sessionDeleteManyMock.mock.calls[1]?.[0] as {
      where: { userId?: string };
    };
    expect(userScoped.where.userId).toBe("user-1");
    expect(globalSweep.where.userId).toBeUndefined();
  });

  it("skips the global sweep when the probability roll fails", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.06);

    await createSessionForUser("user-1");

    expect(sessionDeleteManyMock).toHaveBeenCalledTimes(1);
  });

  it("does not throw out of sign-in when cleanup fails", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.01);
    sessionDeleteManyMock.mockRejectedValue(new Error("db down"));

    const result = await createSessionForUser("user-1");

    expect(result.token).toBe("token-raw");
    expect(sessionCreateMock).toHaveBeenCalledTimes(1);
    expect(loggerWarnMock).toHaveBeenCalledTimes(1);
  });

  it("never deletes the user's other still-valid sessions (multi-device policy)", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.99);

    await createSessionForUser("user-1");

    for (const call of sessionDeleteManyMock.mock.calls) {
      const arg = call[0] as { where: { expiresAt?: { lt: Date } } };
      expect(arg.where.expiresAt?.lt).toBeInstanceOf(Date);
    }
  });
});
