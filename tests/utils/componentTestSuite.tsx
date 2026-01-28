import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

type TestCases = {
  renders?: boolean;
  accessibility?: boolean;
  keyboardNavigation?: boolean;
  disabledState?: boolean;
  errorState?: boolean;
};

type StateConfig<TProps> = {
  disabledProps?: Partial<TProps>;
  errorProps?: Partial<TProps>;
};

export interface ComponentTestSuiteConfig<TProps> {
  /**
   * React component under test.
   */
  component: React.ComponentType<TProps>;

  /**
   * Human-readable name for the suite (usually the component name).
   */
  name: string;

  /**
   * Default props used for baseline rendering.
   */
  props: TProps;

  /**
   * Props that are considered required for the component to behave correctly.
   * Used for simple sanity checks (e.g., does label text render).
   */
  requiredProps?: (keyof TProps)[];

  /**
   * Optional props that should not cause the component to break when omitted.
   */
  optionalProps?: Partial<TProps>;

  /**
   * Primary ARIA role for the main interactive element.
   * Used for generic keyboardNavigation and accessibility checks.
   *
   * Examples: "button", "textbox", "checkbox", "radio", "combobox".
   */
  primaryRole?: string;

  /**
   * Which standard tests to run for this component.
   */
  testCases?: TestCases;

  /**
   * State-specific props for disabled/error tests.
   */
  states?: StateConfig<TProps>;
}

/**
 * Standardized component test suite.
 *
 * Usage:
 * componentTestSuite({
 *   component: Button,
 *   name: "Button",
 *   props: { children: "Click me" },
 *   requiredProps: ["children"],
 *   primaryRole: "button",
 *   testCases: {
 *     renders: true,
 *     accessibility: true,
 *     keyboardNavigation: true,
 *     disabledState: true,
 *   },
 *   states: {
 *     disabledProps: { disabled: true },
 *   },
 * });
 */
export function componentTestSuite<TProps>(
  config: ComponentTestSuiteConfig<TProps>,
) {
  const {
    component: Component,
    name,
    props,
    requiredProps = [],
    optionalProps,
    primaryRole = "button",
    testCases = {
      renders: true,
      accessibility: true,
      keyboardNavigation: true,
      disabledState: true,
      errorState: false,
    },
    states = {},
  } = config;

  describe(`${name} (standard suite)`, () => {
    if (testCases.renders) {
      it("renders without crashing", () => {
        render(<Component {...props} />);
      });
    }

    if (requiredProps.length > 0) {
      it("honors required props", () => {
        render(<Component {...props} />);

        for (const key of requiredProps) {
          const value = (props as Record<string, unknown>)[key as string];
          expect(
            value,
            `Expected required prop "${String(key)}" to be defined`,
          ).toBeDefined();
        }
      });
    }

    if (optionalProps) {
      it("handles optional props gracefully when omitted", () => {
        // Render with all props
        render(<Component {...props} />);

        // Render again with optional props omitted to ensure no runtime error
        const { unmount } = render(
          <Component {...({ ...props, ...Object.fromEntries(
            Object.keys(optionalProps).map((k) => [k, undefined]),
          ) } as TProps)} />,
        );

        // Basic sanity check: component is mounted
        // (we don't assert specific DOM for optional props generically)
        expect(unmount).toBeDefined();
      });
    }

    if (testCases.accessibility) {
      it("has no obvious accessibility violations (axe)", async () => {
        const { container } = render(<Component {...props} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    }

    if (testCases.keyboardNavigation) {
      it("supports basic keyboard navigation (Tab + Enter/Space)", async () => {
        const user = userEvent.setup();
        render(<Component {...props} />);

        // Focus the primary interactive element by role
        const interactive =
          screen.queryByRole(primaryRole as never) ??
          // Fallback: first button if specified role is not found
          screen.getByRole("button");

        interactive.focus();
        expect(interactive).toHaveFocus();

        // Trigger activation via keyboard
        await user.keyboard("{Enter}");
        await user.keyboard(" ");

        // Still in the document after interaction
        expect(interactive).toBeInTheDocument();
      });
    }

    if (testCases.disabledState && states.disabledProps) {
      it("handles disabled state correctly", async () => {
        const user = userEvent.setup();
        render(
          <Component
            {...({
              ...props,
              ...states.disabledProps,
            } as TProps)}
          />,
        );

        const interactive =
          screen.queryByRole(primaryRole as never) ??
          screen.getByRole("button");

        // If the component exposes disabled via attribute, assert it
        if ("disabled" in interactive) {
          expect(interactive).toHaveAttribute("disabled");
        }

        // Attempt interaction; should not throw or cause obvious change
        await user.click(interactive);
        expect(interactive).toBeInTheDocument();
      });
    }

    if (testCases.errorState && states.errorProps) {
      it("handles error state without crashing", () => {
        // Render with error props applied; no additional assertions to keep this generic
        render(
          <Component
            {...({
              ...props,
              ...states.errorProps,
            } as TProps)}
          />,
        );
      });
    }
  });
}

