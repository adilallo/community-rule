import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import Top from "../../app/components/navigation/Top";
import { renderWithProviders } from "../utils/test-utils";
import { CREATE_FLOW_ANONYMOUS_KEY } from "../../app/(app)/create/utils/anonymousDraftStorage";
import { CORE_VALUE_DETAILS_STORAGE_KEY } from "../../app/(app)/create/utils/coreValueDetailsLocalStorage";
import { componentTestSuite } from "../utils/componentTestSuite";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
}));

type TopProps = React.ComponentProps<typeof Top>;

// Test folderTop=false variant (standard header)
componentTestSuite<TopProps>({
  component: Top,
  name: "Top (folderTop=false)",
  props: { folderTop: false } as TopProps,
  requiredProps: [],
  primaryRole: "banner",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
});

// Test folderTop=true variant (home header)
// Note: Accessibility test may fail due to Next.js Script component behavior in test environment
componentTestSuite<TopProps>({
  component: Top,
  name: "Top (folderTop=true)",
  props: { folderTop: true } as TopProps,
  requiredProps: [],
  primaryRole: "banner",
  testCases: {
    renders: true,
    accessibility: false, // Disabled due to Next.js Script component in test environment
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
});

describe('Top "Create rule" button', () => {
  beforeEach(() => {
    pushMock.mockReset();
    window.localStorage.clear();
  });
  afterEach(() => {
    window.localStorage.clear();
  });

  /**
   * Guards against localStorage stickiness on the marketing homepage: hitting
   * the top-nav "Create rule" from anywhere outside `/create` must wipe the
   * in-flight anonymous draft so the wizard always starts fresh. See
   * handleCreateRuleClick in Top.container.tsx for the contract.
   */
  it("clears anonymous draft + core-value-details localStorage before routing to /create", async () => {
    window.localStorage.setItem(
      CREATE_FLOW_ANONYMOUS_KEY,
      JSON.stringify({ title: "Stale community" }),
    );
    window.localStorage.setItem(
      CORE_VALUE_DETAILS_STORAGE_KEY,
      JSON.stringify({ "1": { meaning: "m", signals: "s" } }),
    );

    renderWithProviders(<Top folderTop={false} />);

    // Top renders the Create Rule button at three breakpoints (xs/sm/md);
    // any of them clicking the same handler is the point.
    const [btn] = screen.getAllByRole("button", {
      name: /create a new rule/i,
    });
    await userEvent.click(btn);

    expect(window.localStorage.getItem(CREATE_FLOW_ANONYMOUS_KEY)).toBeNull();
    expect(
      window.localStorage.getItem(CORE_VALUE_DETAILS_STORAGE_KEY),
    ).toBeNull();
    expect(pushMock).toHaveBeenCalledWith("/create");
  });
});
