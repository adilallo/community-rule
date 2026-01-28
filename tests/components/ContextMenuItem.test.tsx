import React from "react";
import ContextMenuItem from "../../app/components/ContextMenuItem";
import { componentTestSuite } from "../utils/componentTestSuite";

type ContextMenuItemProps = React.ComponentProps<typeof ContextMenuItem>;

componentTestSuite<ContextMenuItemProps>({
  component: ContextMenuItem,
  name: "ContextMenuItem",
  props: {
    children: "Item",
  } as ContextMenuItemProps,
  requiredProps: [],
  primaryRole: "menuitem",
  testCases: {
    renders: true,
    accessibility: false,
    keyboardNavigation: true,
    disabledState: true,
    errorState: false,
  },
  states: {
    disabledProps: { disabled: true },
  },
});

