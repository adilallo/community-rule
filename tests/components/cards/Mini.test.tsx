import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import Mini from "../../../app/components/cards/Mini";
import { getAssetPath, featurePanelPath } from "../../../lib/assetUtils";
import { renderWithProviders, screen } from "../../utils/test-utils";

describe("Mini", () => {
  it("renders label lines", () => {
    renderWithProviders(
      <Mini
        labelLine1="Decision-making"
        labelLine2="support"
        panelContent={getAssetPath(featurePanelPath("support"))}
      />,
    );

    expect(screen.getByText("Decision-making")).toBeInTheDocument();
    expect(screen.getByText("support")).toBeInTheDocument();
  });
});
