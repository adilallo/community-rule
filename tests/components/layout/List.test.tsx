import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import List from "../../../app/components/layout/List";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../../utils/componentTestSuite";

const items = [
  {
    id: "a",
    title: "First",
    description: "First description",
    href: "/first",
  },
  {
    id: "b",
    title: "Second",
    description: "Second description",
    onClick: () => {},
  },
];

type Props = React.ComponentProps<typeof List>;

const config: ComponentTestSuiteConfig<Props> = {
  component: List,
  name: "List",
  props: { items } as Props,
  primaryRole: "list",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
};

describe("List", () => {
  componentTestSuite<Props>(config);

  it("renders a link row when item has href", () => {
    render(
      <List
        items={[
          {
            id: "1",
            title: "T",
            description: "D",
            href: "/x",
          },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: /T/ })).toHaveAttribute("href", "/x");
  });

  it("calls onClick for button rows", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <List
        items={[
          {
            id: "1",
            title: "Action",
            description: "Desc",
            onClick,
          },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Action/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies size s and l Figma data attributes on the list root", () => {
    const { container: a, rerender } = render(<List items={items} size="s" />);
    expect(
      a.querySelector('[data-figma-node="21863:45631"]'),
    ).toBeInTheDocument();
    rerender(<List items={items} size="l" />);
    expect(
      a.querySelector('[data-figma-node="21844:4405"]'),
    ).toBeInTheDocument();
  });
});
