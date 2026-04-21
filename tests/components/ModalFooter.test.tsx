import { describe, vi } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import ModalFooter from "../../app/components/utility/ModalFooter";

type Props = React.ComponentProps<typeof ModalFooter>;

const config: ComponentTestSuiteConfig<Props> = {
  component: ModalFooter,
  name: "ModalFooter",
  props: {
    showBackButton: true,
    showNextButton: true,
    onBack: vi.fn(),
    onNext: vi.fn(),
    currentStep: 2,
    totalSteps: 4,
  } as Props,
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("ModalFooter", () => {
  componentTestSuite<Props>(config);
});
