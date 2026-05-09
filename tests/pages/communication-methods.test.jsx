import {
  renderWithProviders as render,
  screen,
  cleanup,
  within,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach } from "vitest";
import { useLayoutEffect } from "react";
import { CommunicationMethodsScreen } from "../../app/(app)/create/screens/card/CommunicationMethodsScreen";
import { useCreateFlow } from "../../app/(app)/create/context/CreateFlowContext";

const CUSTOM_POLICY_ID = "550e8400-e29b-41d4-a716-446655440000";

function CommunicationMethodsScreenWithState({ initial }) {
  const { replaceState } = useCreateFlow();
  useLayoutEffect(() => {
    replaceState(initial);
  }, [replaceState, initial]);
  return <CommunicationMethodsScreen />;
}

afterEach(() => {
  cleanup();
});

describe("Create flow communication-methods page", () => {
  test("clicking a card opens the Create modal", async () => {
    const user = userEvent.setup();
    render(<CommunicationMethodsScreen />);

    const signalCards = screen.getAllByRole("button", {
      name: /Signal: Encrypted messaging/,
    });
    await user.click(signalCards[0]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("Signal")).toBeInTheDocument();
    expect(within(dialog).getByText("Add Platform")).toBeInTheDocument();
  });

  test("re-opening a selected method shows no modal primary; Remove is in the kebab", async () => {
    const user = userEvent.setup();
    render(<CommunicationMethodsScreen />);

    const signalCards = screen.getAllByRole("button", {
      name: /Signal: Encrypted messaging/,
    });
    await user.click(signalCards[0]);
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Add Platform" }));

    await user.click(signalCards[0]);
    const dialogAgain = screen.getByRole("dialog");
    expect(
      within(dialogAgain).queryByRole("button", { name: "Remove" }),
    ).not.toBeInTheDocument();
    expect(
      within(dialogAgain).queryByRole("button", { name: "Add Platform" }),
    ).not.toBeInTheDocument();

    await user.click(within(dialogAgain).getByRole("button", { name: "More options" }));
    expect(screen.getByRole("menuitem", { name: "Remove" })).toBeInTheDocument();
  });

  test("Remove from the kebab deselects the method", async () => {
    const user = userEvent.setup();
    render(<CommunicationMethodsScreen />);

    const signalCards = screen.getAllByRole("button", {
      name: /Signal: Encrypted messaging/,
    });
    await user.click(signalCards[0]);
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Add Platform",
      }),
    );

    expect(signalCards[0]).toHaveTextContent("SELECTED");

    await user.click(signalCards[0]);
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "More options",
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Remove" }));

    expect(signalCards[0]).not.toHaveTextContent("SELECTED");
  });

  test("kebab menu does not include Close", async () => {
    const user = userEvent.setup();
    render(<CommunicationMethodsScreen />);

    const signalCards = screen.getAllByRole("button", {
      name: /Signal: Encrypted messaging/,
    });
    await user.click(signalCards[0]);
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "More options" }));
    expect(
      screen.queryByRole("menuitem", { name: "Close" }),
    ).not.toBeInTheDocument();
  });

  test("unselected preset method fields are disabled until Customize", async () => {
    const user = userEvent.setup();
    render(<CommunicationMethodsScreen />);

    const signalCards = screen.getAllByRole("button", {
      name: /Signal: Encrypted messaging/,
    });
    await user.click(signalCards[0]);

    const dialog = screen.getByRole("dialog");
    const textbox = within(dialog).getAllByRole("textbox")[0];
    expect(textbox).toBeDisabled();

    await user.click(within(dialog).getByRole("button", { name: "More options" }));
    await user.click(screen.getByRole("menuitem", { name: "Customize" }));
    expect(
      within(screen.getByRole("dialog")).getAllByRole("textbox")[0],
    ).not.toBeDisabled();
  });

  test("renders without error", () => {
    render(<CommunicationMethodsScreen />);

    expect(
      screen.getByText(
        "How should this community communicate with each-other?",
      ),
    ).toBeInTheDocument();
  });

  test("renders HeaderLockup and CardStack content", () => {
    render(<CommunicationMethodsScreen />);

    expect(
      screen.getByText(/You can select multiple methods for different needs or/),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^add$/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "See all communication approaches" }),
    ).toBeInTheDocument();
  });

  test("with a finalized custom policy, inline add link still opens the custom wizard", async () => {
    const user = userEvent.setup();
    render(
      <CommunicationMethodsScreenWithState
        initial={{
          selectedCommunicationMethodIds: [CUSTOM_POLICY_ID],
          customMethodCardMetaById: {
            [CUSTOM_POLICY_ID]: { label: "My policy", supportText: "Desc" },
          },
        }}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Remove policy" }),
    ).not.toBeInTheDocument();
    const addButtons = screen.getAllByRole("button", { name: /^add$/i });
    expect(addButtons.length).toBeGreaterThanOrEqual(1);
    await user.click(addButtons[0]);

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText("What do you call your group's new policy?"),
    ).toBeInTheDocument();
  });

  test("toggle expands and shows Show less", async () => {
    const user = userEvent.setup();
    render(<CommunicationMethodsScreen />);

    const toggle = screen.getByRole("button", {
      name: "See all communication approaches",
    });
    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: "Show less" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "What method should this community use to communicate with eachother?",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^add$/i }),
    ).toBeInTheDocument();
  });

  test("opening Create modal for custom policy shows saved field blocks read-only until Customize", async () => {
    const user = userEvent.setup();
    const initial = {
      selectedCommunicationMethodIds: [CUSTOM_POLICY_ID],
      methodSectionsPinCommitted: { communication: true },
      customMethodCardMetaById: {
        [CUSTOM_POLICY_ID]: { label: "My policy", supportText: "Support copy" },
      },
      customMethodCardFieldBlocksById: {
        [CUSTOM_POLICY_ID]: [
          {
            kind: "text",
            id: "f1",
            blockTitle: "Guidelines",
            placeholderText: "Enter norms here",
          },
        ],
      },
    };
    render(<CommunicationMethodsScreenWithState initial={initial} />);

    const policyTiles = screen.getAllByRole("button", {
      name: /My policy: Support copy/,
    });
    await user.click(policyTiles[0]);

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Guidelines")).toBeInTheDocument();
    const textboxesBefore = within(dialog).getAllByRole("textbox");
    expect(textboxesBefore).toHaveLength(1);
    const textarea = textboxesBefore[0];
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveValue("Enter norms here");

    await user.click(within(dialog).getByRole("button", { name: "More options" }));
    await user.click(screen.getByRole("menuitem", { name: "Customize" }));

    const guidelinesAfter = within(screen.getByRole("dialog")).getAllByRole(
      "textbox",
    )[2];
    expect(guidelinesAfter).not.toBeDisabled();
    expect(guidelinesAfter).toHaveValue("Enter norms here");
  });

  test("opening Create modal for custom policy shows badge options as chips read-only until Customize", async () => {
    const user = userEvent.setup();
    const initial = {
      selectedCommunicationMethodIds: [CUSTOM_POLICY_ID],
      methodSectionsPinCommitted: { communication: true },
      customMethodCardMetaById: {
        [CUSTOM_POLICY_ID]: { label: "My policy", supportText: "Support copy" },
      },
      customMethodCardFieldBlocksById: {
        [CUSTOM_POLICY_ID]: [
          {
            kind: "badges",
            id: "b1",
            blockTitle: "Choose channels",
            options: ["Alpha", "Beta"],
          },
        ],
      },
    };
    render(<CommunicationMethodsScreenWithState initial={initial} />);

    const policyTiles = screen.getAllByRole("button", {
      name: /My policy: Support copy/,
    });
    await user.click(policyTiles[0]);

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Choose channels")).toBeInTheDocument();
    const alpha = within(dialog).getByRole("button", { name: /^Alpha$/ });
    const beta = within(dialog).getByRole("button", { name: /^Beta$/ });
    expect(alpha).toBeDisabled();
    expect(beta).toBeDisabled();

    await user.click(within(dialog).getByRole("button", { name: "More options" }));
    await user.click(screen.getByRole("menuitem", { name: "Customize" }));

    const alphaAfter = within(screen.getByRole("dialog")).getByRole("button", {
      name: /Deselect Alpha/,
    });
    const betaAfter = within(screen.getByRole("dialog")).getByRole("button", {
      name: /Deselect Beta/,
    });
    expect(alphaAfter).not.toBeDisabled();
    expect(betaAfter).not.toBeDisabled();
  });

  test("editing custom policy field blocks updates draft state after Save", async () => {
    const user = userEvent.setup();
    let latest = {};
    function Probe({ initial }) {
      const { replaceState, state } = useCreateFlow();
      useLayoutEffect(() => {
        replaceState(initial);
      }, [replaceState, initial]);
      useLayoutEffect(() => {
        latest = state;
      }, [state]);
      return <CommunicationMethodsScreen />;
    }
    const initial = {
      selectedCommunicationMethodIds: [CUSTOM_POLICY_ID],
      customMethodCardMetaById: {
        [CUSTOM_POLICY_ID]: { label: "My policy", supportText: "Support copy" },
      },
      customMethodCardFieldBlocksById: {
        [CUSTOM_POLICY_ID]: [
          {
            kind: "text",
            id: "f1",
            blockTitle: "Guidelines",
            placeholderText: "Original",
          },
        ],
      },
    };
    render(<Probe initial={initial} />);

    const policyTiles = screen.getAllByRole("button", {
      name: /My policy: Support copy/,
    });
    await user.click(policyTiles[0]);
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "More options" }));
    await user.click(screen.getByRole("menuitem", { name: "Customize" }));

    const textarea = within(dialog).getAllByRole("textbox")[2];
    await user.clear(textarea);
    await user.type(textarea, "Updated norms");

    await user.click(within(dialog).getByRole("button", { name: "Save" }));

    const row = latest.customMethodCardFieldBlocksById?.[CUSTOM_POLICY_ID]?.[0];
    expect(row).toMatchObject({
      kind: "text",
      placeholderText: "Updated norms",
    });
  });

  test("duplicate staged copy is unselected; closing modal drops ephemeral card; duplicate again works", async () => {
    const user = userEvent.setup();
    let latest = {};
    function Probe({ initial }) {
      const { replaceState, state } = useCreateFlow();
      useLayoutEffect(() => {
        replaceState(initial);
      }, [replaceState, initial]);
      useLayoutEffect(() => {
        latest = state;
      }, [state]);
      return <CommunicationMethodsScreen />;
    }
    const initial = {
      selectedCommunicationMethodIds: [CUSTOM_POLICY_ID],
      customMethodCardMetaById: {
        [CUSTOM_POLICY_ID]: { label: "My policy", supportText: "Support copy" },
      },
      customMethodCardFieldBlocksById: {
        [CUSTOM_POLICY_ID]: [
          {
            kind: "text",
            id: "f1",
            blockTitle: "Guidelines",
            placeholderText: "Enter norms here",
          },
        ],
      },
    };
    render(<Probe initial={initial} />);

    const policyTiles = screen.getAllByRole("button", {
      name: /My policy: Support copy/,
    });
    await user.click(policyTiles[0]);
    const dialog = screen.getByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: "More options" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Duplicate" }));

    const metaAfterDup = latest.customMethodCardMetaById ?? {};
    const dupIds = Object.keys(metaAfterDup).filter(
      (id) => id !== CUSTOM_POLICY_ID,
    );
    expect(dupIds).toHaveLength(1);
    const dupId = dupIds[0];
    expect(latest.selectedCommunicationMethodIds).toEqual([CUSTOM_POLICY_ID]);
    expect(
      within(dialog).getByRole("button", { name: "Add Platform" }),
    ).toBeInTheDocument();
    expect(metaAfterDup[dupId].label.endsWith(" (copy)")).toBe(true);
    expect(within(dialog).getByRole("heading", { level: 1 })).toHaveTextContent(
      /^My policy \(copy\)$/,
    );
    expect(within(dialog).getByText("Support copy")).toBeInTheDocument();
    expect(within(dialog).getByText("Guidelines")).toBeInTheDocument();
    expect(within(dialog).getByRole("textbox")).toHaveValue("Enter norms here");
    await user.click(
      within(dialog).getByRole("button", { name: "Close dialog" }),
    );

    const metaAfterClose = latest.customMethodCardMetaById ?? {};
    expect(metaAfterClose[dupId]).toBeUndefined();
    expect(Object.keys(metaAfterClose)).toEqual([CUSTOM_POLICY_ID]);

    await user.click(policyTiles[0]);
    const dialog2 = screen.getByRole("dialog");
    await user.click(
      within(dialog2).getByRole("button", { name: "More options" }),
    );
    await user.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    const metaSecond = latest.customMethodCardMetaById ?? {};
    const dupIds2 = Object.keys(metaSecond).filter(
      (id) => id !== CUSTOM_POLICY_ID,
    );
    expect(dupIds2).toHaveLength(1);
  });

});
