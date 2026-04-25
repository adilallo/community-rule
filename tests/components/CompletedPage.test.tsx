import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { CompletedScreen } from "../../app/(app)/create/screens/completed/CompletedScreen";
import { CREATE_FLOW_LAST_PUBLISHED_KEY } from "../../lib/create/lastPublishedRule";

const storedRuleFixture = {
  id: "rule-fixture-1",
  title: "Fixture Community Rule",
  summary: "A short summary for tests.",
  document: {
    sections: [
      {
        categoryName: "Values",
        entries: [
          {
            title: "Fixture value title",
            body: "Fixture value body text for the test document.",
          },
        ],
      },
      {
        categoryName: "Communication",
        entries: [
          {
            title: "Fixture channel",
            body: "How we talk to each other.",
          },
        ],
      },
    ],
  },
};

describe("CompletedScreen", () => {
  beforeEach(() => {
    sessionStorage.removeItem(CREATE_FLOW_LAST_PUBLISHED_KEY);
  });

  afterEach(() => {
    sessionStorage.removeItem(CREATE_FLOW_LAST_PUBLISHED_KEY);
  });

  it("renders without crashing", () => {
    render(<CompletedScreen />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("shows no placeholder title or document when session is empty", () => {
    render(<CompletedScreen />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("");
    expect(screen.queryByText("Values")).not.toBeInTheDocument();
  });

  it("renders header and document from sessionStorage", () => {
    sessionStorage.setItem(
      CREATE_FLOW_LAST_PUBLISHED_KEY,
      JSON.stringify(storedRuleFixture),
    );
    render(<CompletedScreen />);
    expect(
      screen.getByRole("heading", {
        name: "Fixture Community Rule",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("A short summary for tests.")).toBeInTheDocument();
    expect(screen.getByText("Values")).toBeInTheDocument();
    expect(screen.getByText("Communication")).toBeInTheDocument();
    expect(screen.getByText("Fixture value title")).toBeInTheDocument();
  });

  it("renders toast alert when page loads", () => {
    render(<CompletedScreen />);
    expect(
      screen.getByText(
        "This is what folks see when you share your CommunityRule",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your group can use this document as an operating manual.",
      ),
    ).toBeInTheDocument();
  });

  it("renders toast with role status", () => {
    render(<CompletedScreen />);
    const statusRegions = screen.getAllByRole("status");
    expect(statusRegions.length).toBeGreaterThanOrEqual(1);
    expect(
      statusRegions.some((el) =>
        el.textContent?.includes("This is what folks see when you share"),
      ),
    ).toBe(true);
  });
});
