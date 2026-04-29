import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import Link from "../../../app/components/navigation/Link";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children?: React.ReactNode;
    href?: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const FIGMA = "21861:21428";

describe("Link (Navigation)", () => {
  it("renders an anchor with href and data-figma-node", () => {
    const { container } = render(
      <Link
        href="/rules/1"
        variant="paragraph"
        type="primary"
        theme="light"
      >
        View
      </Link>,
    );
    const a = screen.getByRole("link", { name: /view/i });
    expect(a).toHaveAttribute("href", "/rules/1");
    expect(a).toHaveAttribute("data-figma-node", FIGMA);
    expect(container.querySelector("a")?.className).toMatch(
      /text-\[var\(--color-link-primary\)\]/,
    );
  });

  it("renders a button when href is omitted", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Link
        variant="paragraph"
        type="primary"
        theme="light"
        onClick={onClick}
      >
        Delete
      </Link>,
    );
    const btn = screen.getByRole("button", { name: /delete/i });
    expect(btn).toHaveAttribute("data-figma-node", FIGMA);
    expect(btn).toHaveAttribute("type", "button");
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies secondary + dark classes for that combination", () => {
    const { container } = render(
      <Link href="#" variant="paragraph" type="secondary" theme="dark">
        More
      </Link>,
    );
    const el = container.querySelector("a");
    expect(el?.className).toMatch(/text-\[var\(--color-link-invert-secondary\)\]/);
  });
});
