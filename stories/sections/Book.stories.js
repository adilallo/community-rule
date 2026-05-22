import Book from "../../app/components/sections/Book";
import { getAssetPath, governanceBookletPath } from "../../lib/assetUtils";
import messages from "../../messages/en/pages/about.json";

export default {
  title: "Components/Sections/Book",
  component: Book,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export const Default = {
  args: {
    title: messages.book.title,
    description: messages.book.description,
    buttonText: messages.book.buttonText,
    buttonHref: getAssetPath(governanceBookletPath()),
    imageAlt: messages.book.imageAlt,
  },
};
