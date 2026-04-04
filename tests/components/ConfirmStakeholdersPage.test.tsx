import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import ConfirmStakeholdersPage from "../../app/create/confirm-stakeholders/page";

describe("ConfirmStakeholdersPage", () => {
  it("renders title and description", () => {
    render(<ConfirmStakeholdersPage />);
    expect(
      screen.getByRole("heading", {
        name: /Do other stakeholders need to be involved/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Adding people at this step will invite them to see your proposed CommunityRule/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders Add stakeholder control", () => {
    render(<ConfirmStakeholdersPage />);
    expect(
      screen.getByRole("button", { name: "Add stakeholder" }),
    ).toBeInTheDocument();
  });

  it("shows draft toast and can dismiss it", async () => {
    const user = userEvent.setup();
    render(<ConfirmStakeholdersPage />);
    expect(
      screen.getByText(/Congratulations! You've drafted your CommunityRule!/i),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close alert" }));
    expect(
      screen.queryByText(
        /Congratulations! You've drafted your CommunityRule!/i,
      ),
    ).not.toBeInTheDocument();
  });
});
