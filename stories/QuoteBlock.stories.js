import QuoteBlock from "../app/components/QuoteBlock";

export default {
  title: "Components/QuoteBlock",
  component: QuoteBlock,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A responsive quote section component that displays inspirational governance quotes with author attribution and decorative geometric elements.

## Features
- **Three variants**: compact, standard, and extended layouts
- **Responsive design**: Adapts across all breakpoints
- **Error handling**: Graceful fallbacks for image loading failures
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **Design system integration**: Uses design tokens for consistent styling

## Usage
\`\`\`jsx
<QuoteBlock 
  variant="standard"
  quote="Your quote text here..."
  author="Author Name"
  source="Source Title"
  avatarSrc="path/to/avatar.jpg"
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["compact", "standard", "extended"],
      description: "Layout variant for different use cases",
    },
    quote: {
      control: { type: "text" },
      description: "The quote text to display",
    },
    author: {
      control: { type: "text" },
      description: "Author name for attribution",
    },
    source: {
      control: { type: "text" },
      description: "Source title (book, article, etc.)",
    },
    avatarSrc: {
      control: { type: "text" },
      description: "Path to author avatar image",
    },
    fallbackAvatarSrc: {
      control: { type: "text" },
      description: "Fallback avatar image path",
    },
    onError: {
      action: "error",
      description: "Error callback function",
    },
  },
};

// Default story
export const Default = {
  args: {
    variant: "standard",
    quote:
      "The rules of decision-making must be open and available to everyone, and this can happen only if they are formalized.",
    author: "Jo Freeman",
    source: "The Tyranny of Structurelessness",
    avatarSrc: "assets/Quote_Avatar.svg",
  },
};

// All variants comparison
export const AllVariants = {
  render: () => (
    <div className="space-y-8 p-4">
      <div>
        <h3 className="text-lg font-bold mb-4">Compact Variant</h3>
        <QuoteBlock
          variant="compact"
          quote="The rules of decision-making must be open and available to everyone."
          author="Jo Freeman"
          source="The Tyranny of Structurelessness"
          avatarSrc="assets/Quote_Avatar.svg"
        />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Standard Variant</h3>
        <QuoteBlock
          variant="standard"
          quote="The rules of decision-making must be open and available to everyone, and this can happen only if they are formalized."
          author="Jo Freeman"
          source="The Tyranny of Structurelessness"
          avatarSrc="assets/Quote_Avatar.svg"
        />
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Extended Variant</h3>
        <QuoteBlock
          variant="extended"
          quote="The rules of decision-making must be open and available to everyone, and this can happen only if they are formalized."
          author="Jo Freeman"
          source="The Tyranny of Structurelessness"
          avatarSrc="assets/Quote_Avatar.svg"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of all three variants to show the differences in layout, typography, and spacing.",
      },
    },
  },
};

// Error state simulation
export const ErrorState = {
  args: {
    variant: "standard",
    quote:
      "The rules of decision-making must be open and available to everyone, and this can happen only if they are formalized.",
    author: "Jo Freeman",
    source: "The Tyranny of Structurelessness",
    avatarSrc: "invalid-image-path.jpg", // This will trigger error state
    onError: (error) => console.log("QuoteBlock error:", error),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error state when avatar image fails to load. Shows initials fallback and error handling.",
      },
    },
  },
};
