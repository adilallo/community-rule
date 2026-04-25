import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Divider from "../../../app/components/utility/Divider";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../../utils/componentTestSuite";

type Props = React.ComponentProps<typeof Divider>;

const config: ComponentTestSuiteConfig<Props> = {
  component: Divider,
  name: "Divider",
  props: {} as Props,
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
};

describe("Divider", () => {
  componentTestSuite<Props>(config);

  it("renders horizontal content line with Figma line node", () => {
    const { container } = render(
      <Divider type="content" orientation="horizontal" />,
    );
    expect(
      container.querySelector('[data-figma-node="6894:22989"]'),
    ).toBeInTheDocument();
  });

  it("renders menu horizontal with tertiary line", () => {
    const { container } = render(
      <Divider type="menu" orientation="horizontal" />,
    );
    const line = container.querySelector('[data-figma-node="2002:30856"]');
    expect(line).toBeInTheDocument();
    expect(line).toHaveClass("bg-[var(--color-border-default-tertiary)]");
  });

  it("renders vertical content bar", () => {
    const { container } = render(
      <Divider type="content" orientation="vertical" />,
    );
    expect(
      container.querySelector('[data-figma-node="6894:22990"]'),
    ).toBeInTheDocument();
  });
});
