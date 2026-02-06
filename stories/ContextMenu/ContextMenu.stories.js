import React, { useState } from "react";
import ContextMenu from "../../app/components/ContextMenu/ContextMenu";
import ContextMenuItem from "../../app/components/ContextMenu/ContextMenuItem";
import ContextMenuSection from "../../app/components/ContextMenu/ContextMenuSection";
import ContextMenuDivider from "../../app/components/ContextMenu/ContextMenuDivider";

export default {
  title: "Components/ContextMenu/ContextMenu",
  component: ContextMenu,
  argTypes: {
    className: {
      control: { type: "text" },
    },
  },
};

const Template = (args) => (
  <ContextMenu {...args}>
    <ContextMenuItem>Context Menu Item</ContextMenuItem>
    <ContextMenuItem>Context Menu Item</ContextMenuItem>
    <ContextMenuItem hasSubmenu>Context Menu Item</ContextMenuItem>
    <ContextMenuItem hasSubmenu>Context Menu Item</ContextMenuItem>
    <ContextMenuDivider />
    <ContextMenuItem selected>Context Menu Item</ContextMenuItem>
    <ContextMenuItem>Context Menu Item</ContextMenuItem>
    <ContextMenuDivider />
    <ContextMenuSection title="Section Title">
      <ContextMenuItem>Context Menu Item</ContextMenuItem>
      <ContextMenuItem>Context Menu Item</ContextMenuItem>
    </ContextMenuSection>
  </ContextMenu>
);

export const Default = Template.bind({});

export const WithCustomStyling = Template.bind({});
WithCustomStyling.args = {
  className: "min-w-[250px]",
};

// Individual component stories
export const MenuItem = () => (
  <div className="space-y-2">
    <ContextMenuItem>Default Menu Item</ContextMenuItem>
    <ContextMenuItem selected>Selected Menu Item</ContextMenuItem>
    <ContextMenuItem hasSubmenu>Menu Item with Submenu</ContextMenuItem>
    <ContextMenuItem disabled>Disabled Menu Item</ContextMenuItem>
  </div>
);

export const MenuSection = () => (
  <ContextMenu>
    <ContextMenuSection title="First Section">
      <ContextMenuItem>Item 1</ContextMenuItem>
      <ContextMenuItem>Item 2</ContextMenuItem>
    </ContextMenuSection>
    <ContextMenuDivider />
    <ContextMenuSection title="Second Section">
      <ContextMenuItem>Item 3</ContextMenuItem>
      <ContextMenuItem>Item 4</ContextMenuItem>
    </ContextMenuSection>
  </ContextMenu>
);

export const MenuDivider = () => (
  <ContextMenu>
    <ContextMenuItem>Item Above</ContextMenuItem>
    <ContextMenuDivider />
    <ContextMenuItem>Item Below</ContextMenuItem>
  </ContextMenu>
);

export const Interactive = () => {
  const [selectedItem, setSelectedItem] = useState("");

  return (
    <ContextMenu>
      <ContextMenuItem
        selected={selectedItem === "item1"}
        onClick={() => setSelectedItem("item1")}
      >
        Context Menu Item 1
      </ContextMenuItem>
      <ContextMenuItem
        selected={selectedItem === "item2"}
        onClick={() => setSelectedItem("item2")}
      >
        Context Menu Item 2
      </ContextMenuItem>
      <ContextMenuItem
        selected={selectedItem === "item3"}
        onClick={() => setSelectedItem("item3")}
      >
        Context Menu Item 3
      </ContextMenuItem>
    </ContextMenu>
  );
};

// Comparison stories
export const AllVariants = () => (
  <div className="space-y-4">
    <div>
      <h3 className="text-sm font-medium mb-2">Default Items</h3>
      <ContextMenu>
        <ContextMenuItem>Context Menu Item</ContextMenuItem>
        <ContextMenuItem>Context Menu Item</ContextMenuItem>
      </ContextMenu>
    </div>

    <div>
      <h3 className="text-sm font-medium mb-2">With Submenu Indicators</h3>
      <ContextMenu>
        <ContextMenuItem hasSubmenu>Context Menu Item</ContextMenuItem>
        <ContextMenuItem hasSubmenu>Context Menu Item</ContextMenuItem>
      </ContextMenu>
    </div>

    <div>
      <h3 className="text-sm font-medium mb-2">With Selected Item</h3>
      <ContextMenu>
        <ContextMenuItem>Context Menu Item</ContextMenuItem>
        <ContextMenuItem selected>Context Menu Item</ContextMenuItem>
        <ContextMenuItem>Context Menu Item</ContextMenuItem>
      </ContextMenu>
    </div>

    <div>
      <h3 className="text-sm font-medium mb-2">With Sections</h3>
      <ContextMenu>
        <ContextMenuSection title="Section Title">
          <ContextMenuItem>Context Menu Item</ContextMenuItem>
          <ContextMenuItem>Context Menu Item</ContextMenuItem>
        </ContextMenuSection>
      </ContextMenu>
    </div>
  </div>
);
