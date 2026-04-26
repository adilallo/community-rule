import React from "react";
import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Alert from "../../app/components/modals/Alert";
import { componentTestSuite } from "../utils/componentTestSuite";
import { renderWithProviders as render } from "../utils/test-utils";

type AlertProps = React.ComponentProps<typeof Alert>;

componentTestSuite<AlertProps>({
  component: Alert,
  name: "Alert",
  props: {
    title: "Alert title",
    description: "Alert description",
  } as AlertProps,
  requiredProps: ["title"],
  optionalProps: {
    description: "Optional description",
    status: "positive",
    type: "banner",
    size: "m",
  },
  primaryRole: "alert",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false, // Alert is not directly keyboard navigable
    disabledState: false,
    errorState: false,
  },
});

describe("Alert dismiss control", () => {
  it("omits close button when onClose is absent", () => {
    render(<Alert title="T" description="D" />);
    expect(
      screen.queryByRole("button", { name: "Close alert" }),
    ).not.toBeInTheDocument();
  });

  it("renders close when onClose is provided", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Alert title="T" onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Close alert" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("omits close when hasTrailingIcon is false even if onClose exists", () => {
    const onClose = vi.fn();
    render(
      <Alert title="T" onClose={onClose} hasTrailingIcon={false} />,
    );
    expect(
      screen.queryByRole("button", { name: "Close alert" }),
    ).not.toBeInTheDocument();
  });
});
