import { describe, vi } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import ModalHeader from "../../app/components/modals/ModalHeader";

type Props = React.ComponentProps<typeof ModalHeader>;

const config: ComponentTestSuiteConfig<Props> = {
  component: ModalHeader,
  name: "ModalHeader",
  props: {
    showCloseButton: true,
    showMoreOptionsButton: true,
    onClose: vi.fn(),
    onMoreOptions: vi.fn(),
  } as Props,
  primaryRole: "button",
  testCases: {
    renders: true,
    accessibility: true,
  },
};

describe("ModalHeader", () => {
  componentTestSuite<Props>(config);
});
