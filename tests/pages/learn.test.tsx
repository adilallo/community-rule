import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders as render } from "../utils/test-utils";
import LearnPage from "../../app/(marketing)/learn/page";

vi.mock("../../lib/content", () => ({
  getAllBlogPosts: vi.fn(),
}));

vi.mock("../../app/components/sections/AskOrganizer", () => ({
  default: ({
    title,
    subtitle,
    buttonText,
  }: {
    title: string;
    subtitle: string;
    buttonText: string;
  }) => (
    <div data-testid="ask-organizer">
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <button type="button">{buttonText}</button>
    </div>
  ),
}));

const mockPosts = [
  {
    slug: "resolving-active-conflicts",
    frontmatter: {
      title: "Resolving Active Conflicts",
      description: "Practical steps for resolving conflicts",
      author: "CommunityRule",
      date: "2025-04-15",
      thumbnail: {
        vertical: "resolving-active-conflicts-vertical.svg",
        horizontal: "resolving-active-conflicts-horizontal.svg",
      },
    },
    content: "",
    htmlContent: "",
    filePath: "resolving-active-conflicts.md",
    lastModified: new Date(),
  },
  {
    slug: "operational-security-mutual-aid",
    frontmatter: {
      title: "Operational Security for Mutual Aid",
      description: "Tactics to protect members",
      author: "CommunityRule",
      date: "2025-04-10",
      thumbnail: {
        vertical: "operational-security-mutual-aid-vertical.svg",
        horizontal: "operational-security-mutual-aid-horizontal.svg",
      },
    },
    content: "",
    htmlContent: "",
    filePath: "operational-security-mutual-aid.md",
    lastModified: new Date(),
  },
];

describe("LearnPage", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { getAllBlogPosts } = await import("../../lib/content");
    vi.mocked(getAllBlogPosts).mockReturnValue(mockPosts);
  });

  it("renders content lockup and ask organizer copy", () => {
    render(<LearnPage />);

    expect(screen.getByText("Organizing is hard")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Find answers to your questions and see how other groups/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("ask-organizer")).toBeInTheDocument();
    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
  });

  it("renders one card per post (single responsive grid, no duplication)", () => {
    const { container } = render(<LearnPage />);

    const grid = container.querySelector(".smd\\:grid");
    expect(grid).toBeTruthy();

    const links = within(grid as HTMLElement).getAllByRole("link");
    expect(links).toHaveLength(mockPosts.length);

    expect(links[0]).toHaveAttribute(
      "href",
      "/blog/resolving-active-conflicts",
    );
    expect(links[1]).toHaveAttribute(
      "href",
      "/blog/operational-security-mutual-aid",
    );

    // <picture> with a smd source provides the orientation swap without a
    // duplicate card per breakpoint.
    const sources = grid?.querySelectorAll(
      "picture source[media='(min-width: 530px)']",
    );
    expect(sources?.length).toBe(mockPosts.length);
  });
});
