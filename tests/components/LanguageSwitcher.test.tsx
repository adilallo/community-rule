import { describe } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import LanguageSwitcher from "../../app/components/localization/LanguageSwitcher";

type Props = React.ComponentProps<typeof LanguageSwitcher>;

const config: ComponentTestSuiteConfig<Props> = {
  component: LanguageSwitcher,
  name: "LanguageSwitcher",
  props: {} as Props,
  primaryRole: "combobox",
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("LanguageSwitcher", () => {
  componentTestSuite<Props>(config);
});
