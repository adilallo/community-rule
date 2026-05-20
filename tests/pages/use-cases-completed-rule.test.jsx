import { describe, test, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render } from "../utils/test-utils";
import UseCaseCompletedRulePage from "../../app/(marketing-case-study)/use-cases/[slug]/rule/page";
import messages from "../../messages/en/index";
import { USE_CASE_DETAIL_SLUGS } from "../../lib/useCaseSyntheticPost";

const mockPush = vi.fn();
const mockOpenLogin = vi.fn();
const mockFetchAuthSession = vi.fn();
const mockDuplicateUseCaseTemplate = vi.fn();

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/use-cases/food-not-bombs/rule",
}));

vi.mock("../../app/contexts/AuthModalContext", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuthModal: () => ({
      openLogin: mockOpenLogin,
      closeLogin: vi.fn(),
    }),
  };
});

vi.mock("../../lib/create/api", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fetchAuthSession: () => mockFetchAuthSession(),
    duplicateUseCaseTemplate: (slug) => mockDuplicateUseCaseTemplate(slug),
  };
});

vi.mock(
  "../../app/(app)/create/hooks/useCreateFlowMdUp",
  () => ({
    useCreateFlowMdUp: () => true,
  }),
);

describe("UseCaseCompletedRulePage", () => {
  test.each(USE_CASE_DETAIL_SLUGS)(
    "renders completed rule for %s",
    async (slug) => {
      const contentKey =
        slug === "mutual-aid-colorado"
          ? "mutualAidColorado"
          : slug === "food-not-bombs"
            ? "foodNotBombs"
            : "boulderCountyStreetMedics";
      const fixture = messages.pages.useCasesCompletedRules[contentKey];

      render(
        await UseCaseCompletedRulePage({
          params: Promise.resolve({ slug }),
        }),
      );

      expect(
        screen.getByRole("heading", { name: fixture.title }),
      ).toBeInTheDocument();
      if (slug === "mutual-aid-colorado") {
        expect(
          screen.getByText(/Food Not Bombs is not a charity/),
        ).toBeInTheDocument();
      }
      if (slug === "boulder-county-street-medics") {
        expect(screen.getByText("Membership")).toBeInTheDocument();
        expect(screen.getByText(/Tiered Membership/)).toBeInTheDocument();
      }
      expect(screen.getByText("Values")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /return/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: messages.pages.useCasesCompletedRule.topNav.duplicateAriaLabel,
        }),
      ).toBeInTheDocument();
    },
  );

  test("Duplicate opens login when signed out", async () => {
    const user = userEvent.setup();
    mockOpenLogin.mockClear();
    mockFetchAuthSession.mockResolvedValue({ user: null });

    render(
      await UseCaseCompletedRulePage({
        params: Promise.resolve({ slug: "food-not-bombs" }),
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: messages.pages.useCasesCompletedRule.topNav.duplicateAriaLabel,
      }),
    );
    expect(mockOpenLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        nextPath: "/use-cases/food-not-bombs/rule",
      }),
    );
    expect(mockDuplicateUseCaseTemplate).not.toHaveBeenCalled();
  });

  test("Duplicate saves to profile when signed in", async () => {
    const user = userEvent.setup();
    mockPush.mockClear();
    mockFetchAuthSession.mockResolvedValue({
      user: { id: "u1", email: "a@b.c" },
    });
    mockDuplicateUseCaseTemplate.mockResolvedValue({
      ok: true,
      id: "rule-copy",
      title: "Food Not Bombs Boulder Template (Copy)",
    });

    render(
      await UseCaseCompletedRulePage({
        params: Promise.resolve({ slug: "food-not-bombs" }),
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: messages.pages.useCasesCompletedRule.topNav.duplicateAriaLabel,
      }),
    );
    expect(mockDuplicateUseCaseTemplate).toHaveBeenCalledWith("food-not-bombs");
    expect(mockPush).toHaveBeenCalledWith("/profile");
  });

  test("Return navigates to use case detail", async () => {
    const user = userEvent.setup();
    mockPush.mockClear();

    render(
      await UseCaseCompletedRulePage({
        params: Promise.resolve({ slug: "mutual-aid-colorado" }),
      }),
    );

    await user.click(screen.getByRole("button", { name: /return/i }));
    expect(mockPush).toHaveBeenCalledWith("/use-cases/mutual-aid-colorado");
  });
});
