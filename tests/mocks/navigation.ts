import { vi } from "vitest";

/**
 * Shared Next.js navigation mock for tests that render components using useRouter
 * (e.g. home RuleStack) without a file-local vi.mock.
 */
export const testRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
};

export const testPathname = vi.fn(() => "/");

vi.mock("next/navigation", () => ({
  useRouter: () => testRouter,
  usePathname: () => testPathname(),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));
