import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render } from "../utils/test-utils";
import MultiSelect from "../../app/components/controls/MultiSelect";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type Props = React.ComponentProps<typeof MultiSelect>;

const defaultChipOptions = [
  { id: "1", label: "Option 1", state: "Unselected" as const },
  { id: "2", label: "Option 2", state: "Selected" as const },
];

const config: ComponentTestSuiteConfig<Props> = {
  component: MultiSelect,
  name: "MultiSelect",
  props: {
    label: "Test Label",
    showHelpIcon: false,
    size: "S",
    palette: "Default",
    options: defaultChipOptions,
    addButton: true,
    addButtonText: "",
  } as Props,
  requiredProps: ["options"],
  optionalProps: {
    label: "Optional Label",
    showHelpIcon: true,
    size: "M",
    palette: "Inverse",
    onChipClick: vi.fn(),
    onAddClick: vi.fn(),
    addButton: false,
    addButtonText: "Add",
  },
  primaryRole: undefined, // MultiSelect contains multiple interactive elements
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false, // Complex component with multiple interactive elements
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<Props>(config);

describe("MultiSelect – behaviour specifics", () => {
  it("renders label when provided", () => {
    render(<MultiSelect options={defaultChipOptions} label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders all chip options", () => {
    render(<MultiSelect options={defaultChipOptions} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("calls onChipClick when a chip is clicked", async () => {
    const handleChipClick = vi.fn();
    render(
      <MultiSelect
        options={defaultChipOptions}
        onChipClick={handleChipClick}
      />,
    );

    const chip = screen.getByText("Option 1");
    await userEvent.click(chip);

    expect(handleChipClick).toHaveBeenCalledWith("1");
  });

  it("calls onAddClick when add button is clicked", async () => {
    const handleAddClick = vi.fn();
    render(
      <MultiSelect
        options={defaultChipOptions}
        onAddClick={handleAddClick}
        addButton={true}
        addButtonText="Add option"
      />,
    );

    const addButton = screen.getByRole("button", { name: "Add option" });
    await userEvent.click(addButton);

    expect(handleAddClick).toHaveBeenCalled();
  });

  it("calls onAddClick when icon-only add button is clicked", async () => {
    const handleAddClick = vi.fn();
    render(
      <MultiSelect
        options={defaultChipOptions}
        onAddClick={handleAddClick}
        addButton={true}
        addButtonText=""
      />,
    );

    const addButton = screen.getByRole("button", { name: "Add option" });
    await userEvent.click(addButton);

    expect(handleAddClick).toHaveBeenCalled();
  });

  it("shows help icon when showHelpIcon is true", () => {
    render(
      <MultiSelect
        options={defaultChipOptions}
        label="Test Label"
        showHelpIcon={true}
      />,
    );
    const helpIcon = screen.getByAltText("Help");
    expect(helpIcon).toBeInTheDocument();
  });

  it("renders add button text when provided", () => {
    render(
      <MultiSelect
        options={defaultChipOptions}
        addButton={true}
        addButtonText="Add option"
      />,
    );
    expect(screen.getByText("Add option")).toBeInTheDocument();
  });

  it("does not render add button when addButton is false", () => {
    render(
      <MultiSelect
        options={defaultChipOptions}
        addButton={false}
      />,
    );
    expect(screen.queryByRole("button", { name: /add/i })).not.toBeInTheDocument();
  });

  it("handles custom chip confirm", async () => {
    const handleConfirm = vi.fn();
    const customOptions = [
      { id: "custom-1", label: "", state: "Custom" as const },
    ];
    render(
      <MultiSelect
        options={customOptions}
        onCustomChipConfirm={handleConfirm}
      />,
    );

    // Type into the input first (check button is disabled until there's text)
    const input = screen.getByPlaceholderText("Type to add");
    await userEvent.type(input, "NewOption");

    // Now the check button should be enabled
    const checkButton = screen.getByRole("button", { name: "Confirm" });
    expect(checkButton).not.toBeDisabled();
    
    await userEvent.click(checkButton);

    expect(handleConfirm).toHaveBeenCalledWith("custom-1", "NewOption");
  });

  it("handles custom chip close", async () => {
    const handleClose = vi.fn();
    const customOptions = [
      { id: "custom-1", label: "", state: "Custom" as const },
    ];
    render(
      <MultiSelect
        options={customOptions}
        onCustomChipClose={handleClose}
      />,
    );

    const closeButton = screen.getByRole("button", { name: "Close" });
    await userEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });
});
