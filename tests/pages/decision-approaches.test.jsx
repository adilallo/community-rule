import {
  renderWithProviders as render,
  screen,
  cleanup,
  within,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach } from "vitest";
import { useLayoutEffect } from "react";
import { DecisionApproachesScreen } from "../../app/(app)/create/screens/right-rail/DecisionApproachesScreen";
import { useCreateFlow } from "../../app/(app)/create/context/CreateFlowContext";

const CUSTOM_APPROACH_ID = "550e8400-e29b-41d4-a716-446655440000";

function DecisionApproachesScreenWithState({ initial }) {
  const { replaceState } = useCreateFlow();
  useLayoutEffect(() => {
    replaceState(initial);
  }, [replaceState, initial]);
  return <DecisionApproachesScreen />;
}

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
      name: /^Add$/i,
    });
    expect(addControl).toBeInTheDocument();

    const description = addControl.parentElement;
    expect(description).not.toBeNull();
    expect(description?.textContent).toMatch(/Select as many as you need/);
    expect(description?.textContent).toMatch(/new decision making approaches/);
  });

  test("with a finalized custom approach, sidebar still shows add (not Remove policy)", () => {
    render(
      <DecisionApproachesScreenWithState
        initial={{
          selectedDecisionApproachIds: [CUSTOM_APPROACH_ID],
          customMethodCardMetaById: {
            [CUSTOM_APPROACH_ID]: {
              label: "My approach",
              supportText: "Desc",
            },
          },
        }}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Remove policy" }),
    ).not.toBeInTheDocument();
    const addControl = screen.getByRole("button", { name: /^Add$/i });
    expect(addControl).toBeInTheDocument();
    const description = addControl.parentElement;
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
    expect(screen.getAllByRole("button", { name: /^add$/i })).toHaveLength(2);
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

  test("re-opening a selected approach shows no modal primary; Remove is in the kebab", async () => {
    const user = userEvent.setup();
    render(<DecisionApproachesScreen />);

    const card = screen.getByRole("button", {
      name: /Lazy Consensus: A decision is assumed approved/,
    });
    await user.click(card);
    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", {
        name: "Add Approach",
      }),
    );

    await user.click(card);
    const dialogAgain = screen.getByRole("dialog");
    expect(
      within(dialogAgain).queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();
    expect(
      within(dialogAgain).queryByRole("button", { name: "Add Approach" }),
    ).not.toBeInTheDocument();

    await user.click(within(dialogAgain).getByRole("button", { name: "More options" }));
    expect(screen.getByRole("menuitem", { name: "Remove" })).toBeInTheDocument();
  });

  test("Remove from the kebab deselects the approach", async () => {
    const user = userEvent.setup();
    render(<DecisionApproachesScreen />);

    const card = screen.getByRole("button", {
      name: /Lazy Consensus: A decision is assumed approved/,
    });
    await user.click(card);
    await user.click(
      within(await screen.findByRole("dialog")).getByRole("button", {
        name: "Add Approach",
      }),
    );

    expect(card).toHaveTextContent("SELECTED");

    await user.click(card);
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", { name: "More options" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Remove" }));

    expect(card).not.toHaveTextContent("SELECTED");
  });

  test("when editing a published rule, method modal kebab has no Duplicate", async () => {
    const user = userEvent.setup();
    render(
      <DecisionApproachesScreenWithState
        initial={{
          editingPublishedRuleId: "published-rule-1",
          selectedDecisionApproachIds: ["lazy-consensus"],
        }}
      />,
    );

    const card = screen.getByRole("button", {
      name: /Lazy Consensus: A decision is assumed approved/,
    });
    await user.click(card);
    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: "More options" }),
    );
    expect(
      screen.queryByRole("menuitem", { name: "Duplicate" }),
    ).not.toBeInTheDocument();
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
