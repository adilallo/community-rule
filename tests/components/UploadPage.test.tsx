import { describe, it, expect } from "vitest";
import { renderWithProviders as render, screen } from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import { CommunityUploadScreen } from "../../app/(app)/create/screens/upload/CommunityUploadScreen";

describe("CommunityUploadScreen", () => {
  it("renders HeaderLockup", () => {
    render(<CommunityUploadScreen />);
    expect(
      screen.getByRole("heading", {
        name: "Add a photo to identify your group",
      }),
    ).toBeInTheDocument();
  });

  it("renders Upload control and helper copy", () => {
    render(<CommunityUploadScreen />);
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
    expect(
      screen.getByText(
        /This photo be used as a profile picture for your group/i,
      ),
    ).toBeInTheDocument();
  });
});
