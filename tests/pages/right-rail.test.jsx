import {
  renderWithProviders as render,
  screen,
  cleanup,
  within,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach } from "vitest";
import { RightRailScreen } from "../../app/create/screens/right-rail/RightRailScreen";

afterEach(() => {
  cleanup();
});

describe("Create flow right-rail page", () => {
  test("renders without error", () => {
    render(<RightRailScreen />);

    expect(
      screen.getByRole("heading", {
        name: "How should conflicts be resolved?",
      }),
    ).toBeInTheDocument();
  });

  test("renders sidebar description with add link", () => {
    render(<RightRailScreen />);

    const description = screen.getByText((content, element) => {
      if (element?.tagName !== "P") return false;
      const text = element.textContent ?? "";
      return (
        text.includes("You can also combine or") &&
        text.includes("add") &&
        text.includes("new approaches to the list")
      );
    });
    expect(description).toBeInTheDocument();
  });

  test("renders message box with title and checkboxes", () => {
    render(<RightRailScreen />);

    const region = screen.getByRole("region", {
      name: "Consider defining approaches to steward key resources:",
    });
    expect(region).toBeInTheDocument();

    expect(
      within(region).getByRole("checkbox", {
        name: "Amend your CommunityRule",
      }),
    ).toBeInTheDocument();
    expect(
      within(region).getByRole("checkbox", { name: "Steward finances" }),
    ).toBeInTheDocument();
    expect(
      within(region).getByRole("checkbox", { name: "Project level decisions" }),
    ).toBeInTheDocument();
    expect(
      within(region).getByRole("checkbox", {
        name: "Discipline and member termination",
      }),
    ).toBeInTheDocument();
  });

  test("renders card stack with See all decision approaches toggle", () => {
    render(<RightRailScreen />);

    expect(
      screen.getByRole("button", { name: "See all decision approaches" }),
    ).toBeInTheDocument();
  });

  test("renders recommended approach cards", () => {
    render(<RightRailScreen />);

    expect(
      screen.getByRole("button", {
        name: /Mediation: Collaborative work to reach a resolution/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Facilitated dialogue: Structured sessions/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Invite-only: Private discussions with selected participants/,
      }),
    ).toBeInTheDocument();
  });

  test("toggle expands and shows Show less", async () => {
    const user = userEvent.setup();
    render(<RightRailScreen />);

    const toggle = screen.getByRole("button", {
      name: "See all decision approaches",
    });
    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: "Show less" }),
    ).toBeInTheDocument();
  });

  test("expanded view shows Label cards", async () => {
    const user = userEvent.setup();
    render(<RightRailScreen />);

    const toggle = screen.getByRole("button", {
      name: "See all decision approaches",
    });
    await user.click(toggle);

    const labelButtons = screen.getAllByRole("button", { name: /^Label/ });
    expect(labelButtons.length).toBeGreaterThanOrEqual(1);
  });

  test("clicking a card toggles selection", async () => {
    const user = userEvent.setup();
    render(<RightRailScreen />);

    const mediationCard = screen.getByRole("button", {
      name: /Mediation: Collaborative work to reach a resolution/,
    });
    await user.click(mediationCard);

    expect(screen.getByText("SELECTED")).toBeInTheDocument();
  });

  test("message box checkboxes are interactive", async () => {
    const user = userEvent.setup();
    render(<RightRailScreen />);

    const amendCheckbox = screen.getByRole("checkbox", {
      name: "Amend your CommunityRule",
    });
    expect(amendCheckbox).not.toBeChecked();
    await user.click(amendCheckbox);
    expect(amendCheckbox).toBeChecked();
  });
});
