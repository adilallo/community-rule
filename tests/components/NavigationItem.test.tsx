import { describe } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import NavigationItem from "../../app/components/navigation/NavigationItem";

type Props = React.ComponentProps<typeof NavigationItem>;

const config: ComponentTestSuiteConfig<Props> = {
  component: NavigationItem,
  name: "NavigationItem",
  props: {
    children: "Templates",
    href: "#",
    variant: "default",
    size: "default",
  } as Props,
  primaryRole: "link",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
  },
};

describe("NavigationItem", () => {
  componentTestSuite<Props>(config);
});
