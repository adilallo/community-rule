import {
  renderWithProviders as render,
  screen,
  cleanup,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach, beforeEach, vi } from "vitest";
import { useSearchParams } from "next/navigation";
import TemplatesPageClient from "../../app/(marketing)/templates/TemplatesPageClient";
import { testRouter } from "../mocks/navigation";
import { GOVERNANCE_TEMPLATE_CATALOG } from "../../lib/templates/governanceTemplateCatalog";
import { CREATE_FLOW_ANONYMOUS_KEY } from "../../app/(app)/create/utils/anonymousDraftStorage";
import { CORE_VALUE_DETAILS_STORAGE_KEY } from "../../app/(app)/create/utils/coreValueDetailsLocalStorage";

/** Seed localStorage as if a stale anonymous draft were already in place. */
function seedStaleDraft() {
  window.localStorage.setItem(
    CREATE_FLOW_ANONYMOUS_KEY,
    JSON.stringify({ title: "Stale Community" }),
  );
  window.localStorage.setItem(
    CORE_VALUE_DETAILS_STORAGE_KEY,
    JSON.stringify({ "1": { meaning: "stale", signals: "stale" } }),
  );
}

beforeEach(() => {
  testRouter.push.mockClear();
  vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams());
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("Templates page (/templates)", () => {
  test("renders title, intro, and full catalog", () => {
    render(
      <TemplatesPageClient initialGridEntries={GOVERNANCE_TEMPLATE_CATALOG} />,
    );

    expect(
      screen.getByRole("heading", { name: "Templates", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/mutual aid and open source communities/i),
    ).toBeInTheDocument();

    for (const entry of GOVERNANCE_TEMPLATE_CATALOG) {
      expect(screen.getByText(entry.title)).toBeInTheDocument();
    }
  });

  test("each template card navigates to review flow for its slug", async () => {
    const user = userEvent.setup();
    render(
      <TemplatesPageClient initialGridEntries={GOVERNANCE_TEMPLATE_CATALOG} />,
    );

    const consensusCard = screen.getByText("Consensus").closest("div");
    await user.click(consensusCard);
    expect(testRouter.push).toHaveBeenCalledWith(
      "/create/review-template/consensus",
    );

    testRouter.push.mockClear();
    const solidarity = screen.getByText("Solidarity Network").closest("div");
    await user.click(solidarity);
    expect(testRouter.push).toHaveBeenCalledWith(
      "/create/review-template/solidarity-network",
    );
  });

  test("direct entry (no ?fromFlow=1): wipes anonymous draft before navigating", async () => {
    seedStaleDraft();
    const user = userEvent.setup();
    render(
      <TemplatesPageClient initialGridEntries={GOVERNANCE_TEMPLATE_CATALOG} />,
    );

    const consensusCard = screen.getByText("Consensus").closest("div");
    await user.click(consensusCard);

    expect(window.localStorage.getItem(CREATE_FLOW_ANONYMOUS_KEY)).toBeNull();
    expect(
      window.localStorage.getItem(CORE_VALUE_DETAILS_STORAGE_KEY),
    ).toBeNull();
    expect(testRouter.push).toHaveBeenCalledWith(
      "/create/review-template/consensus",
    );
  });

  test("in-flow entry (?fromFlow=1): preserves the anonymous draft", async () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams("fromFlow=1"),
    );
    seedStaleDraft();
    const user = userEvent.setup();
    render(
      <TemplatesPageClient initialGridEntries={GOVERNANCE_TEMPLATE_CATALOG} />,
    );

    const consensusCard = screen.getByText("Consensus").closest("div");
    await user.click(consensusCard);

    expect(window.localStorage.getItem(CREATE_FLOW_ANONYMOUS_KEY)).toBe(
      JSON.stringify({ title: "Stale Community" }),
    );
    expect(
      window.localStorage.getItem(CORE_VALUE_DETAILS_STORAGE_KEY),
    ).toBe(
      JSON.stringify({ "1": { meaning: "stale", signals: "stale" } }),
    );
    // No `?fromFlow=1` on the outbound review-template URL — the marker
    // only disambiguates /templates' own click behavior.
    expect(testRouter.push).toHaveBeenCalledWith(
      "/create/review-template/consensus",
    );
  });
});
