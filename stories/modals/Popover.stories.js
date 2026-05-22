import React from "react";
import Popover from "../../app/components/modals/Popover";
import ListItem from "../../app/components/layout/ListItem";

export default {
  title: "Components/Modals/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
};

export const Default = {
  render: () => (
    <Popover id="export-menu" menuAriaLabel="Export format">
      <ListItem
        showDivider
        leadingIcon="markdown_copy"
        label="Download Markdown"
        onClick={() => {}}
      />
      <ListItem
        showDivider={false}
        leadingIcon="csv"
        label="Download CSV"
        onClick={() => {}}
      />
    </Popover>
  ),
};
