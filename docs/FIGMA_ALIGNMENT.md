# Figma Property Alignment Documentation

This document tracks components that have been aligned with Figma design specifications and those that were skipped.

## Alignment Strategy

All components now support case-insensitive property values:
- **Figma uses PascalCase** (e.g., "Standard", "Inverse", "Default")
- **Codebase uses lowercase** (e.g., "standard", "inverse", "default")
- **Both formats are accepted** and normalized internally

## Components Aligned with Figma

### Form Components ✅
- **RadioButton, RadioGroup** - mode, state props (added `indicator` prop from Figma)
- **Checkbox, CheckboxGroup** - mode, state props
- **TextInput** - state props
- **TextArea** - state, size, labelVariant props
- **SelectInput** - state, size, labelVariant props
- **SelectOption** - size prop
- **Toggle** - state props
- **ToggleGroup** - state, position props
- **Switch** - state props

### Core UI Components ✅
- **Button** - variant, size props
- **Alert** - status, type props
- **Tooltip** - position prop
- **Progress** - progress state (complex type, no normalization needed)
- **Stepper** - numeric props (no normalization needed)
- **ModalHeader, ModalFooter** - no enum props

### Navigation & Layout ✅
- **MenuBar** - size prop
- **MenuBarItem** - variant, size props
- **NavigationItem** - variant, size props
- **Header, HomeHeader** - complex internal size types
- **Footer** - no props
- **HeaderTab** - no enum props
- **ConditionalHeader** - no props

### Content Components ✅
- **ContentLockup** - variant, alignment props
- **ContentContainer** - size prop
- **ContentThumbnailTemplate** - variant prop
- **SectionHeader** - variant prop
- **ContentBanner** - no enum props
- **SectionNumber** - no enum props
- **HeroBanner, HeroDecor** - no enum props

### Card & Display Components ✅
- **NumberCard** - size prop (already PascalCase, now supports both)
- **NumberedCards** - no enum props
- **IconCard** - no enum props
- **MiniCard** - no enum props
- **RuleCard, RuleStack** - no enum props
- **QuoteBlock** - variant prop
- **QuoteDecor** - no props
- **Logo** - complex size enum (internal use)
- **LogoWall** - no enum props

### Feature Components ✅
- **FeatureGrid** - no enum props
- **AskOrganizer** - variant prop
- **RelatedArticles** - no enum props
- **Create** - no enum props

### Form Extensions ✅
- **InputWithCounter** - no enum props
- **SelectDropdown** - no enum props
- **SelectOption** - size prop

### Context & Menu Components ✅
- **ContextMenu** - no enum props
- **ContextMenuItem** - size prop
- **ContextMenuDivider, ContextMenuSection** - no enum props
- **LanguageSwitcher** - no enum props

### Utility Components ✅
- **Avatar** - size prop
- **AvatarContainer** - size prop
- **ImagePlaceholder** - color prop

## Components Skipped (No Figma Design)

The following components were skipped as they don't have corresponding Figma designs:

- **ErrorBoundary** - Error handling utility component
- **WebVitalsDashboard** - Development tool for performance monitoring
- **Separator** - Simple visual divider component

## Implementation Details

### Normalization Functions

All normalization functions are located in `lib/propNormalization.ts`:
- `normalizeMode()` - Standard/Inverse modes
- `normalizeState()` - Default/Hover/Focus/Selected states
- `normalizeInputState()` - Default/Active/Hover/Focus for inputs
- `normalizeVariant()` - Button variants
- `normalizeSize()` - Button sizes
- `normalizeAlertStatus()` - Alert statuses
- `normalizeAlertType()` - Alert types
- `normalizeTooltipPosition()` - Tooltip positions
- `normalizeMenuBarSize()` - Menu bar sizes
- `normalizeMenuBarItemVariant()` - Menu bar item variants
- `normalizeNavigationItemVariant()` - Navigation item variants
- `normalizeNavigationItemSize()` - Navigation item sizes
- `normalizeContentLockupVariant()` - Content lockup variants
- `normalizeAlignment()` - Text alignment
- `normalizeContentContainerSize()` - Content container sizes
- `normalizeContentThumbnailVariant()` - Content thumbnail variants
- `normalizeSectionHeaderVariant()` - Section header variants
- `normalizeQuoteBlockVariant()` - Quote block variants
- `normalizeNumberCardSize()` - Number card sizes
- `normalizeAskOrganizerVariant()` - Ask organizer variants
- `normalizeContextMenuItemSize()` - Context menu item sizes
- `normalizeImagePlaceholderColor()` - Image placeholder colors
- `normalizeToggleGroupPosition()` - Toggle group positions
- `normalizeLabelVariant()` - Label variants (default/horizontal)
- `normalizeSmallMediumLargeSize()` - Small/medium/large sizes (for SelectInput, TextArea, etc.)

### Usage Pattern

All container components follow this pattern:

```typescript
const ComponentContainer = ({ 
  variant: variantProp = "default",
  // ... other props
}) => {
  // Normalize props to handle both PascalCase (Figma) and lowercase (codebase)
  const variant = normalizeVariant(variantProp);
  
  // Use normalized value in component logic
  // ...
};
```

## Backward Compatibility

All changes maintain full backward compatibility:
- Existing lowercase prop usage continues to work
- New PascalCase props from Figma are accepted
- TypeScript types accept both formats
- No breaking changes to existing code

## Testing

Storybook stories have been updated to demonstrate both naming conventions:
- Existing stories use lowercase (backward compatibility)
- New stories added for PascalCase (Figma alignment)
