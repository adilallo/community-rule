import LogoWall from "../app/components/LogoWall";

export default {
  title: "Components/LogoWall",
  component: LogoWall,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `A responsive logo wall component that displays partner/sponsor logos in a grid layout. Features responsive breakpoints with different layouts and sizing for mobile, tablet, and desktop views.

## Responsive Behavior

- **Mobile**: 3 rows × 2 columns grid with 32px gaps
- **SM**: 2 rows × 3 columns grid with 48px row gap and 32px column gap
- **MD**: Single row with space-between layout and 24px gap between text and logos
- **LG**: Larger logo sizes and 64px horizontal padding
- **XL**: Largest logo sizes, 160px horizontal padding, and 14px label text

## Props

- **logos** (optional): Array of logo objects with src, alt, size, and order properties. If not provided, uses default partner logos.

## Usage Examples

### Custom Logos
\`\`\`jsx
<LogoWall 
  logos={[
    { 
      src: "assets/Section/Logo_CUBoulder.png", 
      alt: "CU Boulder",
      size: "h-10 lg:h-12 xl:h-[60px]",
      order: "order-1 sm:order-2"
    },
    { 
      src: "assets/Section/Logo_FoodNotBombs.png", 
      alt: "Food Not Bombs",
      size: "h-11 lg:h-14 xl:h-[70px]",
      order: "order-2 sm:order-1"
    }
  ]} 
/>
\`\`\`

### Empty State
\`\`\`jsx
<LogoWall logos={[]} />
\`\`\`
This will fall back to the default partner logos.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    logos: {
      control: "object",
      description:
        "Array of logo objects with src, alt, size, and order properties. If not provided, uses default partner logos.",
    },
  },
};

export const Default = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Default LogoWall with all partner logos. Displays in a 3×2 grid on mobile, 2×3 grid on small screens, single row on medium screens, and larger sizes on large screens.",
      },
    },
  },
};
