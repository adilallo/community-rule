import "../app/globals.css";
import "./fonts.css";

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
      <div className="font-inter">
        <Story />
      </div>
    ),
  ],
};

export default preview;
