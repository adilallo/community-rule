import { describe } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import Section from "../../app/components/type/Section";
import TextBlock from "../../app/components/type/TextBlock";

type Props = React.ComponentProps<typeof Section>;

const config: ComponentTestSuiteConfig<Props> = {
  component: Section,
  name: "Section",
  props: {
    categoryName: "Decision making",
    showRail: true,
    children: (
      <TextBlock title="How proposals pass" body="Important decisions require alignment." />
    ),
  } as Props,
  requiredProps: ["categoryName", "children"],
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("Section", () => {
  componentTestSuite<Props>(config);
});
