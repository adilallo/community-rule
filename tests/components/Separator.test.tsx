import { describe } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import Separator from "../../app/components/utility/Separator";

type Props = React.ComponentProps<typeof Separator>;

const config: ComponentTestSuiteConfig<Props> = {
  component: Separator,
  name: "Separator",
  props: {} as Props,
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("Separator", () => {
  componentTestSuite<Props>(config);
});
