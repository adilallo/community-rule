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
      author: "Author name",
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
      author: "Author name",
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

  it("renders one card per post in each layout region without duplication", () => {
    const { container } = render(<LearnPage />);

    const mobileRegion = container.querySelector(".smd\\:hidden");
    const desktopRegion = container.querySelector(".smd\\:grid");

    expect(mobileRegion).toBeTruthy();
    expect(desktopRegion).toBeTruthy();

    const mobileLinks = within(mobileRegion as HTMLElement).getAllByRole(
      "link",
    );
    const desktopLinks = within(desktopRegion as HTMLElement).getAllByRole(
      "link",
    );

    expect(mobileLinks).toHaveLength(mockPosts.length);
    expect(desktopLinks).toHaveLength(mockPosts.length);

    expect(mobileLinks[0]).toHaveAttribute(
      "href",
      "/blog/resolving-active-conflicts",
    );
    expect(desktopLinks[1]).toHaveAttribute(
      "href",
      "/blog/operational-security-mutual-aid",
    );
  });
});
