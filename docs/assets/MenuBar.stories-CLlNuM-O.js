import { j as e } from "./jsx-runtime-C_nHp4yK.js";
import { M as s } from "./MenuBar-anMCqtJv.js";
import { M as n } from "./MenuBarItem-Dp8NM2fx.js";
import "./iframe-D_aMTKb2.js";
import "./preload-helper-DIZFD4sK.js";
const d = {
    title: "Components/MenuBar",
    component: s,
    parameters: {
      layout: "centered",
      docs: {
        description: {
          component:
            "A navigation menu bar container that groups MenuBarItem components together. Provides consistent spacing and layout for navigation menus with multiple size variants.",
        },
      },
    },
    argTypes: {
      size: {
        control: { type: "select" },
        options: ["xsmall", "default", "medium", "large"],
        description: "The size of the menu bar and its children",
      },
      className: {
        control: { type: "text" },
        description: "Additional CSS classes",
      },
    },
    tags: ["autodocs"],
  },
  a = {
    args: { size: "default" },
    render: (t) =>
      e.jsxs(s, {
        ...t,
        children: [
          e.jsx(n, { size: "large", children: "Home" }),
          e.jsx(n, { size: "large", children: "About" }),
          e.jsx(n, { size: "large", children: "Contact" }),
        ],
      }),
  },
  r = {
    args: {},
    render: () =>
      e.jsxs("div", {
        className: "space-y-6",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "XSmall Size",
              }),
              e.jsxs(s, {
                size: "xsmall",
                children: [
                  e.jsx(n, { size: "xsmall", children: "Home" }),
                  e.jsx(n, { size: "xsmall", children: "About" }),
                  e.jsx(n, { size: "xsmall", children: "Contact" }),
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "Default Size",
              }),
              e.jsxs(s, {
                size: "default",
                children: [
                  e.jsx(n, { size: "large", children: "Home" }),
                  e.jsx(n, { size: "large", children: "About" }),
                  e.jsx(n, { size: "large", children: "Contact" }),
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "Medium Size",
              }),
              e.jsxs(s, {
                size: "medium",
                children: [
                  e.jsx(n, { size: "large", children: "Home" }),
                  e.jsx(n, { size: "large", children: "About" }),
                  e.jsx(n, { size: "large", children: "Contact" }),
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "Large Size",
              }),
              e.jsxs(s, {
                size: "large",
                children: [
                  e.jsx(n, { size: "large", children: "Home" }),
                  e.jsx(n, { size: "large", children: "About" }),
                  e.jsx(n, { size: "large", children: "Contact" }),
                ],
              }),
            ],
          }),
        ],
      }),
    parameters: {
      docs: {
        description: {
          story:
            "Different size variants of the menu bar with consistent spacing and layout.",
        },
      },
    },
  };
a.parameters = {
  ...a.parameters,
  docs: {
    ...a.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    size: "default"
  },
  render: args => <MenuBar {...args}>
      <MenuBarItem size="large">Home</MenuBarItem>
      <MenuBarItem size="large">About</MenuBarItem>
      <MenuBarItem size="large">Contact</MenuBarItem>
    </MenuBar>
}`,
      ...a.parameters?.docs?.source,
    },
  },
};
r.parameters = {
  ...r.parameters,
  docs: {
    ...r.parameters?.docs,
    source: {
      originalSource: `{
  args: {},
  render: () => <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">XSmall Size</h3>
        <MenuBar size="xsmall">
          <MenuBarItem size="xsmall">Home</MenuBarItem>
          <MenuBarItem size="xsmall">About</MenuBarItem>
          <MenuBarItem size="xsmall">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Default Size</h3>
        <MenuBar size="default">
          <MenuBarItem size="large">Home</MenuBarItem>
          <MenuBarItem size="large">About</MenuBarItem>
          <MenuBarItem size="large">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Medium Size</h3>
        <MenuBar size="medium">
          <MenuBarItem size="large">Home</MenuBarItem>
          <MenuBarItem size="large">About</MenuBarItem>
          <MenuBarItem size="large">Contact</MenuBarItem>
        </MenuBar>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Large Size</h3>
        <MenuBar size="large">
          <MenuBarItem size="large">Home</MenuBarItem>
          <MenuBarItem size="large">About</MenuBarItem>
          <MenuBarItem size="large">Contact</MenuBarItem>
        </MenuBar>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different size variants of the menu bar with consistent spacing and layout."
      }
    }
  }
}`,
      ...r.parameters?.docs?.source,
    },
  },
};
const u = ["Default", "Sizes"];
export { a as Default, r as Sizes, u as __namedExportsOrder, d as default };
