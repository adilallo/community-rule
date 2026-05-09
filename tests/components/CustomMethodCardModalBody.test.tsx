import { describe, it, expect, afterEach } from "vitest";
import {
  renderWithProviders as render,
  screen,
  cleanup,
} from "../utils/test-utils";
import "@testing-library/jest-dom/vitest";
import CustomMethodCardModalBody from "../../app/(app)/create/components/CustomMethodCardModalBody";
import messages from "../../messages/en/index";

afterEach(() => {
  cleanup();
});

const wizard = messages.create.customRule.customMethodCardWizard;

describe("CustomMethodCardModalBody", () => {
  it("with meta and no blocks, shows policy title, description, and no-fields hint", () => {
    render(
      <CustomMethodCardModalBody
        cardId="c1"
        blocksById={{}}
        policyMeta={{ label: "Our policy", supportText: "How we work" }}
      />,
    );

    expect(screen.getByText("Our policy")).toBeInTheDocument();
    expect(screen.getByText("How we work")).toBeInTheDocument();
    expect(screen.getByText(wizard.editModal.noCustomFieldsYet)).toBeInTheDocument();
  });

  it("with meta and no blocks in customize mode, omits duplicate ContentLockup but keeps hint", () => {
    render(
      <CustomMethodCardModalBody
        cardId="c1"
        blocksById={{}}
        policyMeta={{ label: "T", supportText: "D" }}
        showPolicyContentLockupWhenNoBlocks={false}
      />,
    );

    expect(screen.queryByText("T")).not.toBeInTheDocument();
    expect(screen.queryByText("D")).not.toBeInTheDocument();
    expect(screen.getByText(wizard.editModal.noCustomFieldsYet)).toBeInTheDocument();
  });

  it("without meta, falls back to placeholder", () => {
    render(<CustomMethodCardModalBody cardId="c1" blocksById={{}} />);

    expect(screen.getByText(wizard.editModal.placeholderBody)).toBeInTheDocument();
  });
});
