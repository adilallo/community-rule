import "../app/globals.css";
import "./fonts.css";
import { MessagesProvider } from "../app/contexts/MessagesContext";
import messages from "../messages/en/index";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <MessagesProvider messages={messages}>
        <div className="font-inter">
          <Story />
        </div>
      </MessagesProvider>
    ),
  ],
};

export default preview;
