import {
  renderWithProviders as render,
  screen,
  cleanup,
  within,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, afterEach } from "vitest";
import { CardsScreen } from "../../app/create/screens/card/CardsScreen";

afterEach(() => {
  cleanup();
});

describe("Create flow cards page", () => {
  test("clicking a card opens the Create modal", async () => {
    const user = userEvent.setup();
    render(<CardsScreen />);

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
    render(<CardsScreen />);

    expect(
      screen.getByText(
        "How should this community communicate with each-other?",
      ),
    ).toBeInTheDocument();
  });

  test("renders HeaderLockup and CardStack content", () => {
    render(<CardsScreen />);

    expect(
      screen.getByText(
        "You can select multiple methods for different needs or add your own",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "See all communication approaches" }),
    ).toBeInTheDocument();
  });

  test("toggle expands and shows Show less", async () => {
    const user = userEvent.setup();
    render(<CardsScreen />);

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
