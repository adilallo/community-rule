import { useSearchParams } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { CompletedScreen } from "../../app/(app)/create/screens/completed/CompletedScreen";
import { CREATE_FLOW_LAST_PUBLISHED_KEY } from "../../lib/create/lastPublishedRule";
import {
  CREATE_FLOW_COMPLETED_CELEBRATE_QUERY,
  CREATE_FLOW_COMPLETED_CELEBRATE_VALUE,
} from "../../app/(app)/create/utils/flowSteps";

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

function mockSearchParams(record?: Record<string, string>) {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(record ?? undefined) as NonNullable<
      ReturnType<typeof useSearchParams>
    >,
  );
}

describe("CompletedScreen", () => {
  beforeEach(() => {
    sessionStorage.removeItem(CREATE_FLOW_LAST_PUBLISHED_KEY);
    mockSearchParams();
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

  it("does not show post-finalize toast without celebrate query", () => {
    render(<CompletedScreen />);
    expect(
      screen.queryByText(
        "This is what folks see when you share your CommunityRule",
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Your group can use this document as an operating manual.",
      ),
    ).not.toBeInTheDocument();
  });

  it("shows post-finalize toast in status region when celebrate query is set", () => {
    mockSearchParams({
      [CREATE_FLOW_COMPLETED_CELEBRATE_QUERY]:
        CREATE_FLOW_COMPLETED_CELEBRATE_VALUE,
    });
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
    const statusRegions = screen.getAllByRole("status");
    expect(statusRegions.length).toBeGreaterThanOrEqual(1);
    expect(
      statusRegions.some((el) =>
        el.textContent?.includes("This is what folks see when you share"),
      ),
    ).toBe(true);
  });
});
