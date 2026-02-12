import {
  renderWithProviders as render,
  screen,
  cleanup,
  fireEvent,
} from "../utils/test-utils";
import userEvent from "@testing-library/user-event";
import { vi, describe, test, expect, afterEach } from "vitest";
import CardStack from "../../app/components/utility/CardStack";

const SAMPLE_CARDS = [
  { id: "1", label: "Option A", supportText: "Description A", recommended: true },
  { id: "2", label: "Option B", supportText: "Description B", recommended: false },
  { id: "3", label: "Option C", supportText: "Description C", recommended: true },
];

afterEach(() => {
  cleanup();
});

describe("CardStack Component", () => {
  test("renders header when title is provided", () => {
    render(
      <CardStack
        cards={SAMPLE_CARDS}
        title="How should this community communicate?"
        description="Pick one or more."
      />,
    );

    expect(
      screen.getByText("How should this community communicate?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Pick one or more.")).toBeInTheDocument();
  });

  test("renders up to 5 recommended cards in compact (grid) mode", () => {
    render(<CardStack cards={SAMPLE_CARDS} expanded={false} />);

    expect(screen.getAllByText("Option A").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Option C").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Option B")).not.toBeInTheDocument();
  });

  test("renders all cards in expanded (list) mode", () => {
    render(<CardStack cards={SAMPLE_CARDS} expanded={true} />);

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  test("shows See all toggle when hasMore is true", () => {
    render(<CardStack cards={SAMPLE_CARDS} hasMore={true} />);

    expect(
      screen.getByRole("button", { name: "See all communication approaches" }),
    ).toBeInTheDocument();
  });

  test("does not show toggle when hasMore is false", () => {
    render(<CardStack cards={SAMPLE_CARDS} hasMore={false} />);

    expect(
      screen.queryByRole("button", { name: "See all communication approaches" }),
    ).not.toBeInTheDocument();
  });

  test("toggle expands when clicked", async () => {
    const user = userEvent.setup();
    render(<CardStack cards={SAMPLE_CARDS} hasMore={true} />);

    const toggle = screen.getByRole("button", {
      name: "See all communication approaches",
    });
    await user.click(toggle);

    expect(
      screen.getByRole("button", { name: "Show less" }),
    ).toBeInTheDocument();
  });

  test("calls onCardSelect when a card is clicked", () => {
    const onCardSelect = vi.fn();
    render(
      <CardStack cards={SAMPLE_CARDS} onCardSelect={onCardSelect} />,
    );

    const cardButtons = screen.getAllByRole("button", {
      name: "Option A: Description A",
    });
    fireEvent.click(cardButtons[0]);
    expect(onCardSelect).toHaveBeenCalledWith("1");
  });

  test("renders with selectedId", () => {
    render(<CardStack cards={SAMPLE_CARDS} selectedId="1" />);

    expect(screen.getAllByText("SELECTED").length).toBeGreaterThanOrEqual(1);
  });
});
