import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ListEntry from "../../../app/components/layout/ListEntry";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../../utils/componentTestSuite";

type Props = React.ComponentProps<typeof ListEntry>;

const base: Props = {
  title: "Item",
  description: "Description",
  href: "#",
  topDivider: false,
  bottomDivider: true,
};

const config: ComponentTestSuiteConfig<Props> = {
  component: ListEntry,
  name: "ListEntry",
  props: base,
  primaryRole: "link",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: false,
    errorState: false,
  },
};

describe("ListEntry", () => {
  componentTestSuite<Props>(config);

  it("uses Base / Interactive Figma id for size m", () => {
    const { container } = render(
      <ListEntry
        title="A"
        description="B"
        size="m"
        href="#"
        topDivider={false}
        bottomDivider={false}
      />,
    );
    expect(
      container.querySelector('[data-figma-node="21863:45422"]'),
    ).toBeInTheDocument();
  });

  it("omits description when showDescription is false", () => {
    render(
      <ListEntry
        title="Only"
        description="Hidden"
        showDescription={false}
        href="#"
        topDivider={false}
        bottomDivider={false}
      />,
    );
    expect(screen.getByRole("link", { name: "Only" })).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("button fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ListEntry
        title="Tap"
        description="D"
        onClick={onClick}
        topDivider={false}
        bottomDivider={false}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Tap/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
