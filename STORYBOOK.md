# Storybook Setup

This project has been configured with Storybook for component development and documentation.

## Getting Started

### Running Storybook

```bash
# Start Storybook in development mode
npm run storybook

# Build Storybook for production
npm run build-storybook
```

Storybook will be available at `http://localhost:6006`

## Project Structure

- `.storybook/` - Storybook configuration files
- `stories/` - Story files for components
- `app/components/` - React components

## Available Stories

### Button Component

- **Location**: `stories/Button.stories.js`
- **Component**: `app/components/Button.js`
- **Variants**: Default, Secondary
- **Sizes**: xsmall, small, large, xlarge
- **States**: Disabled, As Link

### Avatar Component

- **Location**: `stories/Avatar.stories.js`
- **Component**: `app/components/Avatar.js`
- **Sizes**: small, medium, large, xlarge

### AvatarContainer Component

- **Location**: `stories/AvatarContainer.stories.js`
- **Component**: `app/components/AvatarContainer.js`
- **Sizes**: small, medium, large, xlarge
- **Features**: Overlapping avatar groups

### Logo Component

- **Location**: `stories/Logo.stories.js`
- **Component**: `app/components/Logo.js`
- **Sizes**: Multiple size variants for different contexts
- **Features**: Icon only mode, responsive sizing

### MenuBar Component

- **Location**: `stories/MenuBar.stories.js`
- **Component**: `app/components/MenuBar.js`
- **Sizes**: xsmall, default, medium, large
- **Features**: Navigation container with MenuBarItems

### MenuBarItem Component

- **Location**: `stories/MenuBarItem.stories.js`
- **Component**: `app/components/MenuBarItem.js`
- **Variants**: default, home
- **Sizes**: Multiple size variants
- **States**: Disabled

### HeaderTab Component

- **Location**: `stories/HeaderTab.stories.js`
- **Component**: `app/components/HeaderTab.js`
- **Features**: Stretchable header tab with decorative elements

### Separator Component

- **Location**: `stories/Separator.stories.js`
- **Component**: `app/components/Separator.js`
- **Features**: Simple horizontal divider

### Header Component

- **Location**: `stories/Header.stories.js`
- **Component**: `app/components/Header.js`
- **Features**: Main navigation header with responsive design
- **Includes**: Logo, navigation menu, login button, create rule button

### HomeHeader Component

- **Location**: `stories/HomeHeader.stories.js`
- **Component**: `app/components/HomeHeader.js`
- **Features**: Special home page header with transparent background
- **Includes**: HeaderTab styling, different navigation behavior
- **States**: Can toggle to regular Header

### Footer Component

- **Location**: `stories/Footer.stories.js`
- **Component**: `app/components/Footer.js`
- **Features**: Site footer with contact info, social links, navigation
- **Includes**: Responsive logo, contact information, social media links

## Adding New Stories

To create a story for a new component:

1. Create a new file in the `stories/` directory: `ComponentName.stories.js`
2. Import the component from `app/components/`
3. Export the default configuration with:
   - `title`: The story title (e.g., 'Components/ComponentName')
   - `component`: The imported component
   - `parameters`: Layout and other settings
   - `argTypes`: Controls for component props
   - `args`: Default props

Example:

```javascript
import MyComponent from "../app/components/MyComponent";

export default {
  title: "Components/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Define controls for component props
  },
  args: {
    // Default props
  },
};

export const Default = {
  args: {
    // Props for this story
  },
};
```

## Features

- **Auto-documentation**: Stories with the `autodocs` tag automatically generate documentation
- **Accessibility testing**: Built-in a11y testing with `@storybook/addon-a11y`
- **Testing integration**: Vitest integration for component testing
- **Responsive design**: Test components at different screen sizes
- **Interactive controls**: Modify component props in real-time

## Configuration

The Storybook configuration is in `.storybook/main.js` and includes:

- Next.js Vite framework
- Tailwind CSS support
- Public assets directory
- Accessibility and testing addons

Global styles are imported in `.storybook/preview.js` to ensure consistent styling across stories.
