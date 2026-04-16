import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { renderWithProviders } from "../utils/test-utils";
import { CoreValuesSelectScreen } from "../../app/create/screens/select/CoreValuesSelectScreen";

describe("CoreValuesSelectScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens core value detail modal when a preset chip is clicked", async () => {
    renderWithProviders(<CoreValuesSelectScreen />);
    fireEvent.click(screen.getByText("Accessibility"));
    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByRole("button", { name: "Add Value" }),
    ).toBeInTheDocument();
  });

  it("closes modal and reverts pending selection when Escape is pressed", async () => {
    renderWithProviders(<CoreValuesSelectScreen />);
    fireEvent.click(screen.getByText("Accessibility"));
    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("saves details when Add Value is clicked", async () => {
    renderWithProviders(<CoreValuesSelectScreen />);
    fireEvent.click(screen.getByText("Accessibility"));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Add Value" }),
    );
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
