import {
  renderWithProviders as render,
  screen,
  cleanup,
  within,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach } from "vitest";
import { DecisionApproachesScreen } from "../../app/(app)/create/screens/right-rail/DecisionApproachesScreen";

afterEach(() => {
  cleanup();
});

describe("Create flow decision-approaches page", () => {
  test("renders without error", () => {
    render(<DecisionApproachesScreen />);

    expect(
      screen.getByRole("heading", {
        name: "How should this community make difficult decisions?",
      }),
    ).toBeInTheDocument();
  });

  test("renders sidebar description with add link", () => {
    render(<DecisionApproachesScreen />);

    const addControl = screen.getByRole("button", {
      name: /^add$/,
    });
    expect(addControl).toBeInTheDocument();

    const description = addControl.parentElement;
    expect(description).not.toBeNull();
    expect(description?.textContent).toMatch(/Select as many as you need/);
    expect(description?.textContent).toMatch(/new decision making approaches/);
  });

  test("renders message box with title and checkboxes", () => {
    render(<DecisionApproachesScreen />);

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
    render(<DecisionApproachesScreen />);

    expect(
      screen.getByRole("button", { name: "See all decision approaches" }),
    ).toBeInTheDocument();
  });

  test("renders recommended approach cards", () => {
    render(<DecisionApproachesScreen />);

    expect(
      screen.getByRole("button", {
        name: /Lazy Consensus: A decision is assumed approved/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Do-ocracy: Decisions are made by those who take initiative/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Consensus Decision-Making: All members must agree/,
      }),
    ).toBeInTheDocument();
  });

  test("toggle expands and shows Show less", async () => {
    const user = userEvent.setup();
    render(<DecisionApproachesScreen />);

    const toggle = screen.getByRole("button", {
      name: "See all decision approaches",
    });
    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: "Show less" }),
    ).toBeInTheDocument();
  });

  test("expanded view reveals additional non-recommended approaches", async () => {
    const user = userEvent.setup();
    render(<DecisionApproachesScreen />);

    expect(
      screen.queryByRole("button", { name: /^Sociocracy:/ }),
    ).not.toBeInTheDocument();

    const toggle = screen.getByRole("button", {
      name: "See all decision approaches",
    });
    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: /^Sociocracy:/ }),
    ).toBeInTheDocument();
  });

  test("clicking a card opens the create modal and confirming selects it", async () => {
    const user = userEvent.setup();
    render(<DecisionApproachesScreen />);

    const card = screen.getByRole("button", {
      name: /Lazy Consensus: A decision is assumed approved/,
    });
    await user.click(card);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const confirmButton = within(dialog).getByRole("button", {
      name: "Add Approach",
    });
    await user.click(confirmButton);

    expect(screen.getByText("SELECTED")).toBeInTheDocument();
  });

  test("message box checkboxes are interactive", async () => {
    const user = userEvent.setup();
    render(<DecisionApproachesScreen />);

    const amendCheckbox = screen.getByRole("checkbox", {
      name: "Amend your CommunityRule",
    });
    expect(amendCheckbox).not.toBeChecked();
    await user.click(amendCheckbox);
    expect(amendCheckbox).toBeChecked();
  });
});
