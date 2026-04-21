import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { renderWithProviders } from "../utils/test-utils";
import { CoreValuesSelectScreen } from "../../app/(app)/create/screens/select/CoreValuesSelectScreen";

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

  // The "Add value" → custom-chip → modal flow uses a `customPending`
  // session: dismissing the modal must drop the brand-new chip entirely
  // (not just unselect it), because the user never confirmed it via
  // the modal's Add Value button. Clicking Add Value keeps the chip
  // as a selected entry. These two tests pin both halves of the
  // contract so the screens stay in sync with the create-flow draft.
  describe("custom chip — confirmed vs dismissed", () => {
    // Use a label guaranteed to NOT collide with any preset value
    // (we'd otherwise get two matching chips and false positives).
    const CUSTOM_LABEL = "ZZTopBespokeValue";

    async function addCustomChipNamed(label: string) {
      fireEvent.click(screen.getByRole("button", { name: "Add value" }));
      const input = await screen.findByPlaceholderText("Type to add");
      fireEvent.change(input, { target: { value: label } });
      fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
      return screen.findByRole("dialog");
    }

    /**
     * The label can also appear in the modal header while the modal
     * is open, and as the chip's "Remove" button aria-label. Scope to
     * chip-row buttons by excluding both.
     */
    function countCustomChips(label: string) {
      return screen
        .queryAllByRole("button", { name: label })
        .filter(
          (el) =>
            !el.closest('[role="dialog"]') &&
            (el.getAttribute("aria-label") ?? "") !== `Remove ${label}`,
        ).length;
    }

    it("removes the custom chip when its modal is dismissed without Add Value", async () => {
      renderWithProviders(<CoreValuesSelectScreen />);
      await addCustomChipNamed(CUSTOM_LABEL);
      expect(countCustomChips(CUSTOM_LABEL)).toBe(1);

      fireEvent.keyDown(document, { key: "Escape" });
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
      // Chip must be gone — not just unselected. If it were merely
      // unselected the chip button would still render. Wrap in waitFor
      // because the chip removal flushes through `updateState` →
      // `useEffect` → `setCoreValueOptions` and isn't synchronous with
      // the dialog close.
      await waitFor(() => {
        expect(countCustomChips(CUSTOM_LABEL)).toBe(0);
      });
    });

    it("keeps the custom chip selected when Add Value is clicked", async () => {
      renderWithProviders(<CoreValuesSelectScreen />);
      const dialog = await addCustomChipNamed(CUSTOM_LABEL);
      fireEvent.click(
        within(dialog).getByRole("button", { name: "Add Value" }),
      );
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
      expect(countCustomChips(CUSTOM_LABEL)).toBe(1);
    });
  });
});
