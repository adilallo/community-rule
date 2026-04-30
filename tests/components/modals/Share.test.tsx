import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render, screen } from "../../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import Share from "../../../app/components/modals/Share";

const noopHandlers = {
  onCopyLink: vi.fn(),
  onEmailShare: vi.fn(),
  onSignalShare: vi.fn(),
  onSlackShare: vi.fn(),
  onDiscordShare: vi.fn(),
};

describe("Share modal", () => {
  it("does not render dialog when closed", () => {
    render(
      <Share isOpen={false} onClose={vi.fn()} {...noopHandlers} />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders localized heading and copy link action when open", async () => {
    const user = userEvent.setup();
    const onCopyLink = vi.fn();
    render(
      <Share
        isOpen={true}
        onClose={vi.fn()}
        {...noopHandlers}
        onCopyLink={onCopyLink}
      />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: /Share this CommunityRule/ }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy link" }));
    expect(onCopyLink).toHaveBeenCalledTimes(1);
  });

  it("invokes channel handlers for Signal, Slack, and Discord", async () => {
    const user = userEvent.setup();
    const onSignalShare = vi.fn();
    const onSlackShare = vi.fn();
    const onDiscordShare = vi.fn();
    render(
      <Share
        isOpen={true}
        onClose={vi.fn()}
        {...noopHandlers}
        onSignalShare={onSignalShare}
        onSlackShare={onSlackShare}
        onDiscordShare={onDiscordShare}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Signal" }));
    await user.click(screen.getByRole("button", { name: "Slack" }));
    await user.click(screen.getByRole("button", { name: "Discord" }));
    expect(onSignalShare).toHaveBeenCalledTimes(1);
    expect(onSlackShare).toHaveBeenCalledTimes(1);
    expect(onDiscordShare).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Done is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Share isOpen={true} onClose={onClose} {...noopHandlers} />);
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when header overflow (more) is activated, matching modal chrome parity", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Share isOpen={true} onClose={onClose} {...noopHandlers} />);
    await user.click(screen.getByRole("button", { name: "More share options" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
