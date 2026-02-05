import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "../utils/test-utils";
import InputLabel from "../../app/components/InputLabel";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";

type Props = React.ComponentProps<typeof InputLabel>;

const config: ComponentTestSuiteConfig<Props> = {
  component: InputLabel,
  name: "InputLabel",
  props: {
    label: "Test Label",
    helpIcon: false,
    asterisk: false,
    helperText: false,
    size: "S",
    palette: "Default",
  } as Props,
  requiredProps: ["label"],
  optionalProps: {
    helpIcon: true,
    asterisk: true,
    helperText: true,
    size: "M",
    palette: "Inverse",
  },
  primaryRole: undefined, // InputLabel is not directly interactive
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false, // Not directly interactive
    disabledState: false,
    errorState: false,
  },
};

componentTestSuite<Props>(config);

describe("InputLabel – behaviour specifics", () => {
  it("renders label text", () => {
    render(<InputLabel label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("shows help icon when helpIcon is true", () => {
    render(<InputLabel label="Test Label" helpIcon={true} />);
    const helpIcon = screen.getByAltText("Help");
    expect(helpIcon).toBeInTheDocument();
  });

  it("shows asterisk when asterisk is true", () => {
    render(<InputLabel label="Test Label" asterisk={true} />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows helper text when helperText is true", () => {
    render(<InputLabel label="Test Label" helperText={true} />);
    expect(screen.getByText("Optional text")).toBeInTheDocument();
  });

  it("shows custom helper text when helperText is a string", () => {
    render(<InputLabel label="Test Label" helperText="Custom helper" />);
    expect(screen.getByText("Custom helper")).toBeInTheDocument();
  });

  it("applies size S styling", () => {
    render(<InputLabel label="Test Label" size="S" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("text-[length:var(--sizing-350,14px)]");
  });

  it("applies size M styling", () => {
    render(<InputLabel label="Test Label" size="M" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("text-[length:var(--sizing-400,16px)]");
  });

  it("applies Default palette styling", () => {
    render(<InputLabel label="Test Label" palette="Default" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass(
      "text-[color:var(--color-content-default-secondary,#d2d2d2)]",
    );
  });

  it("applies Inverse palette styling", () => {
    render(<InputLabel label="Test Label" palette="Inverse" />);
    const label = screen.getByText("Test Label");
    expect(label).toHaveClass(
      "text-[color:var(--color-content-inverse-secondary,#1f1f1f)]",
    );
  });
});
