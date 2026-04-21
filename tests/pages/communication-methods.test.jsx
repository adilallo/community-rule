import {
  renderWithProviders as render,
  screen,
  cleanup,
  within,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach } from "vitest";
import { CommunicationMethodsScreen } from "../../app/(app)/create/screens/card/CommunicationMethodsScreen";

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
    expect(screen.getByRole("button", { name: "add" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "See all communication approaches" }),
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
  });
});
