import { describe } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import TextBlock from "../../app/components/type/TextBlock";

type Props = React.ComponentProps<typeof TextBlock>;

const config: ComponentTestSuiteConfig<Props> = {
  component: TextBlock,
  name: "TextBlock",
  props: {
    title: "Policy title",
    body: "Supporting text for the policy.",
  } as Props,
  requiredProps: ["title"],
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("TextBlock", () => {
  componentTestSuite<Props>(config);
});
