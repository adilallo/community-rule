import { describe, it, expect } from "vitest";
import {
  componentTestSuite,
  type ComponentTestSuiteConfig,
} from "../utils/componentTestSuite";
import TextBlock from "../../app/components/type/TextBlock";
import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "../utils/test-utils";

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

  it("renders labeled row imageUrl as img", () => {
    render(
      <TextBlock
        title="Entry"
        rows={[
          {
            label: "Photo",
            body: "",
            imageUrl: "/api/uploads/aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee",
          },
        ]}
      />,
    );
    const img = screen.getByRole("img", { name: "Photo" });
    expect(img).toHaveAttribute(
      "src",
      "/api/uploads/aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee",
    );
  });
});
