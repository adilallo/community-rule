import { describe } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import Chip from "../../app/components/controls/Chip";

type Props = React.ComponentProps<typeof Chip>;

const config: ComponentTestSuiteConfig<Props> = {
  component: Chip,
  name: "Chip",
  props: {
    label: "Worker cooperative",
    state: "unselected",
    palette: "default",
    size: "m",
  } as Props,
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: true,
    disabledState: true,
  },
  states: {
    disabledProps: { disabled: true, state: "disabled" },
  },
};

describe("Chip", () => {
  componentTestSuite<Props>(config);
});
