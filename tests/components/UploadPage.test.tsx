import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { CommunityUploadScreen } from "../../app/create/screens/upload/CommunityUploadScreen";

describe("CommunityUploadScreen", () => {
  it("renders HeaderLockup", () => {
    render(<CommunityUploadScreen />);
    expect(
      screen.getByRole("heading", {
        name: "How should conflicts be resolved?",
      }),
    ).toBeInTheDocument();
  });

  it("renders Upload control and helper copy", () => {
    render(<CommunityUploadScreen />);
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
    expect(
      screen.getByText(/Add images, PDFs, and other files to the policy/i),
    ).toBeInTheDocument();
  });
});
