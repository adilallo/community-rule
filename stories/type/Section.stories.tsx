import Section from "../../app/components/type/Section";
import TextBlock from "../../app/components/type/TextBlock";

export default {
  title: "Components/Type/Section",
  component: Section,
  parameters: { layout: "padded" },
  argTypes: {
    categoryName: { control: "text" },
    showRail: { control: "boolean" },
    children: { control: false },
  },
};

export const Default = {
  args: {
    categoryName: "Values",
    showRail: true,
    children: (
      <>
        <TextBlock
          title="Solidarity Forever"
          body={`“Change needs all of us.”

Food Not Bombs is not a charity. It is a project of solidarity.`}
        />
        <TextBlock
          title="Shared Leadership"
          body="Everyone coordinates, no one controls."
        />
      </>
    ),
  },
};

export const WithoutRail = {
  args: {
    categoryName: "Membership",
    showRail: false,
    children: (
      <TextBlock
        title="Open access"
        rows={[
          {
            label: "Eligibility & philosophy",
            body: "Anyone aligned with the mission may join.",
          },
          {
            label: "Process",
            body: "Complete two orientations, then lazy consensus.",
          },
        ]}
      />
    ),
  },
};
