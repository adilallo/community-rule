import "../app/globals.css";

// Import Google Fonts for Storybook
import { Inter, Bricolage_Grotesque, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { element: '#storybook-root', manual: false },
    viewport: { defaultViewport: 'responsive' },
    chromatic: { viewports: [360, 768, 1024, 1440] } // breakpoints
  },
  decorators: [
    (Story) => (
      <div
        className={`${inter.variable} ${bricolageGrotesque.variable} ${spaceGrotesk.variable} font-sans`}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
