import React from "react";
import ContextMenu from "../../app/components/ContextMenu/ContextMenu";
import ContextMenuItem from "../../app/components/ContextMenu/ContextMenuItem";
import { componentTestSuite } from "../utils/componentTestSuite";

type ContextMenuProps = React.ComponentProps<typeof ContextMenu>;

componentTestSuite<ContextMenuProps>({
  component: ContextMenu,
  name: "ContextMenu",
  props: {
    children: <ContextMenuItem>Item</ContextMenuItem>,
  } as ContextMenuProps,
  requiredProps: [],
  primaryRole: "menu",
  testCases: {
    renders: true,
    accessibility: true,
    keyboardNavigation: false,
    disabledState: false,
    errorState: false,
  },
});
