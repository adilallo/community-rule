import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import InfoMessageBox from "../../app/components/utility/InfoMessageBox";

describe("InfoMessageBox", () => {
  const items = [
    { id: "a", label: "Option A" },
    { id: "b", label: "Option B" },
  ];

  it("renders title and item labels", () => {
    render(
      <InfoMessageBox title="Important" items={items} />,
    );
    expect(screen.getByRole("region", { name: "Important" })).toBeInTheDocument();
    expect(screen.getByText("Important")).toBeInTheDocument();
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("calls onCheckboxChange when toggling", async () => {
    const u = userEvent.setup();
    const onCheckboxChange = vi.fn();
    render(
      <InfoMessageBox
        title="Pick one"
        items={[{ id: "x", label: "Choice X" }]}
        onCheckboxChange={onCheckboxChange}
      />,
    );
    const checkbox = screen.getByRole("checkbox", { name: /Choice X/i });
    await u.click(checkbox);
    expect(onCheckboxChange).toHaveBeenCalled();
  });
});
