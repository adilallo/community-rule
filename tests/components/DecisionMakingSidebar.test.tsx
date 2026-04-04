import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import DecisionMakingSidebar from "../../app/components/utility/DecisionMakingSidebar";

describe("DecisionMakingSidebar", () => {
  const messageBoxItems = [{ id: "1", label: "Consensus" }];

  it("renders title and description", () => {
    render(
      <DecisionMakingSidebar
        title="How are decisions made?"
        description="Pick approaches for your group."
        messageBoxTitle="Select methods"
        messageBoxItems={messageBoxItems}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "How are decisions made?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Pick approaches for your group."),
    ).toBeInTheDocument();
  });

  it("renders InfoMessageBox section", () => {
    render(
      <DecisionMakingSidebar
        title="Decisions"
        description="Desc"
        messageBoxTitle="Select methods"
        messageBoxItems={messageBoxItems}
      />,
    );
    expect(screen.getByText("Select methods")).toBeInTheDocument();
    expect(screen.getByText("Consensus")).toBeInTheDocument();
  });
});
