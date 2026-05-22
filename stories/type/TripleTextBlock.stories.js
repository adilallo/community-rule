import TripleTextBlock from "../../app/components/type/TripleTextBlock";
import messages from "../../messages/en/pages/about.json";

export default {
  title: "Components/Type/TripleTextBlock",
  component: TripleTextBlock,
  parameters: { layout: "fullscreen" },
};

export const Default = {
  args: {
    columns: messages.tripleTextBlock.columns,
  },
};
