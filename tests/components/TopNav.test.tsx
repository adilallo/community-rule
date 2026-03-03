import React from "react";
import { vi } from "vitest";
import TopNav from "../../app/components/navigation/TopNav";
import { componentTestSuite } from "../utils/componentTestSuite";

// Mock next/navigation (TopNav uses useRouter for Create Rule button and usePathname for nav state)
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
}));

type TopNavProps = React.ComponentProps<typeof TopNav>;

// Test folderTop=false variant (standard header)
componentTestSuite<TopNavProps>({
  component: TopNav,
  name: "TopNav (folderTop=false)",
  props: { folderTop: false } as TopNavProps,
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
componentTestSuite<TopNavProps>({
  component: TopNav,
  name: "TopNav (folderTop=true)",
  props: { folderTop: true } as TopNavProps,
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
