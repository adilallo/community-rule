import { describe, vi } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import InputWithCounter from "../../app/components/controls/InputWithCounter";

type Props = React.ComponentProps<typeof InputWithCounter>;

const config: ComponentTestSuiteConfig<Props> = {
  component: InputWithCounter,
  name: "InputWithCounter",
  props: {
    label: "Community name",
    placeholder: "Enter a name",
    value: "",
    onChange: vi.fn(),
    maxLength: 50,
    showHelpIcon: false,
  } as Props,
  requiredProps: ["value", "onChange", "maxLength"],
  primaryRole: "textbox",
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("InputWithCounter", () => {
  componentTestSuite<Props>(config);
});
