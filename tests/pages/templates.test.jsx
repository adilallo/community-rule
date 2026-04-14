import {
  renderWithProviders as render,
  screen,
  cleanup,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach, beforeEach } from "vitest";
import TemplatesPageClient from "../../app/(marketing)/templates/TemplatesPageClient";
import { testRouter } from "../mocks/navigation";
import { GOVERNANCE_TEMPLATE_CATALOG } from "../../lib/templates/governanceTemplateCatalog";

beforeEach(() => {
  testRouter.push.mockClear();
});

afterEach(() => {
  cleanup();
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
});
