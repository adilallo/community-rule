import { describe } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import { Icon } from "../../app/components/asset";

type Props = React.ComponentProps<typeof Icon>;

const config: ComponentTestSuiteConfig<Props> = {
  component: Icon,
  name: "Icon",
  props: {
    name: "exclamation",
    size: 24,
  } as Props,
  requiredProps: ["name"],
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("Icon", () => {
  componentTestSuite<Props>(config);
});
