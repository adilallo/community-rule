import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render, screen } from "../../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import ListItem from "../../../app/components/layout/ListItem";

describe("ListItem", () => {
  it("renders as a menu item with label and icon", () => {
    render(
      <div role="menu" aria-label="Test menu">
        <ListItem
          showDivider
          leadingIcon="markdown_copy"
          label="Download Markdown"
          onClick={vi.fn()}
        />
      </div>,
    );
    expect(screen.getByRole("menuitem", { name: "Download Markdown" })).toBeTruthy();
  });

  it("invokes onClick when activated", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <div role="menu" aria-label="Test menu">
        <ListItem
          showDivider={false}
          leadingIcon="csv"
          label="Download CSV"
          onClick={onClick}
        />
      </div>,
    );
    await user.click(screen.getByRole("menuitem", { name: "Download CSV" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
