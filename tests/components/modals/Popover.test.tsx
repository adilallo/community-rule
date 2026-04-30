import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render, screen } from "../../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import ListItem from "../../../app/components/layout/ListItem";
import Popover from "../../../app/components/modals/Popover";

describe("Popover (export menu)", () => {
  it("exposes a menu landmark with localized label", () => {
    render(
      <Popover id="export-menu" menuAriaLabel="Export format">
        <ListItem
          showDivider
          leadingIcon="markdown_copy"
          label="Download Markdown"
          onClick={vi.fn()}
        />
      </Popover>,
    );
    expect(screen.getByRole("menu", { name: "Export format" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Download Markdown" })).toBeTruthy();
  });

  it("invokes handler when list item clicked", async () => {
    const user = userEvent.setup();
    const onCsv = vi.fn();
    render(
      <Popover id="popover-csv" menuAriaLabel="Pick format">
        <ListItem
          showDivider={false}
          leadingIcon="csv"
          label="Download CSV"
          onClick={onCsv}
        />
      </Popover>,
    );
    await user.click(screen.getByRole("menuitem", { name: "Download CSV" }));
    expect(onCsv).toHaveBeenCalledTimes(1);
  });
});
