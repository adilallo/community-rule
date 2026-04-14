import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { CreateFlowTextFieldScreen } from "../../app/create/screens/text/CreateFlowTextFieldScreen";

describe("CreateFlowTextFieldScreen (community name)", () => {
  it("renders main heading", () => {
    render(
      <CreateFlowTextFieldScreen
        messageNamespace="create.communityName"
        stateField="title"
        maxLength={48}
      />,
    );
    expect(
      screen.getByRole("heading", {
        name: "What is your community called?",
      }),
    ).toBeInTheDocument();
  });

  it("renders description and text field", () => {
    render(
      <CreateFlowTextFieldScreen
        messageNamespace="create.communityName"
        stateField="title"
        maxLength={48}
      />,
    );
    expect(
      screen.getByText("This will be the name of your community"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter community name"),
    ).toBeInTheDocument();
  });
});
