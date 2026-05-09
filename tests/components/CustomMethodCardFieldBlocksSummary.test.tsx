import { useState } from "react";
import { describe, it, expect, afterEach, vi } from "vitest";
import {
  renderWithProviders as render,
  screen,
  cleanup,
  fireEvent,
} from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import CustomMethodCardFieldBlocksSummary from "../../app/(app)/create/components/CustomMethodCardFieldBlocksSummary";
import messages from "../../messages/en/index";
import type { CustomMethodCardFieldBlock } from "../../lib/create/customMethodCardFieldBlocks";

afterEach(() => {
  cleanup();
});

const uploadCopy =
  messages.create.customRule.customMethodCardWizard.fieldModals.upload;

describe("CustomMethodCardFieldBlocksSummary", () => {
  it("hides Upload when an upload block already has assetUrl; shows preview and remove control", () => {
    const onBlocksChange = vi.fn();
    render(
      <CustomMethodCardFieldBlocksSummary
        blocks={[
          {
            kind: "upload",
            id: "u1",
            blockTitle: "Attachment",
            fileName: "photo.png",
            assetUrl: "/api/uploads/test-id",
          },
        ]}
        onBlocksChange={onBlocksChange}
      />,
    );

    expect(
      screen.getByRole("img", { name: uploadCopy.uploadPreviewImageAlt }),
    ).toHaveAttribute("src", "/api/uploads/test-id");
    expect(
      screen.getByRole("button", {
        name: uploadCopy.clearPendingUploadAriaLabel,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Upload" })).not.toBeInTheDocument();
  });

  it("after remove, parent can pass cleared blocks and Upload shows again", () => {
    function Harness() {
      const [blocks, setBlocks] = useState<CustomMethodCardFieldBlock[]>([
        {
          kind: "upload",
          id: "u1",
          blockTitle: "Attachment",
          fileName: "photo.png",
          assetUrl: "/api/uploads/test-id",
        },
      ]);
      return (
        <CustomMethodCardFieldBlocksSummary
          blocks={blocks}
          onBlocksChange={setBlocks}
        />
      );
    }

    render(<Harness />);

    fireEvent.click(
      screen.getByRole("button", {
        name: uploadCopy.clearPendingUploadAriaLabel,
      }),
    );

    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: uploadCopy.clearPendingUploadAriaLabel,
      }),
    ).not.toBeInTheDocument();
  });
});
