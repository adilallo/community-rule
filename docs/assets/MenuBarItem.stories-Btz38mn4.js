import { j as e } from "./jsx-runtime-C_nHp4yK.js";
import { M as a } from "./MenuBarItem-Dp8NM2fx.js";
import "./iframe-D_aMTKb2.js";
import "./preload-helper-DIZFD4sK.js";
const u = {
    title: "Components/MenuBarItem",
    component: a,
    parameters: {
      layout: "centered",
      docs: {
        description: {
          component:
            "A navigation menu item component with multiple variants, sizes, and states. Can render as a link or disabled span with full accessibility support. Includes focus states with keyboard navigation - use Tab key to test focus indicators.",
        },
      },
    },
    argTypes: {
      variant: {
        control: { type: "select" },
        options: ["default", "home"],
        description: "The visual style variant of the menu item",
      },
      size: {
        control: { type: "select" },
        options: [
          "xsmall",
          "xsmallUseCases",
          "homeMd",
          "homeUseCases",
          "large",
          "largeUseCases",
          "homeXlarge",
          "xlarge",
        ],
        description: "The size of the menu item",
      },
      disabled: {
        control: { type: "boolean" },
        description: "Whether the menu item is disabled",
      },
      href: { control: { type: "text" }, description: "The link destination" },
      onClick: { action: "clicked" },
    },
    tags: ["autodocs"],
  },
  n = { args: { children: "Menu Item", size: "large" } },
  r = {
    args: { children: "Menu Item", size: "large" },
    render: (s) =>
      e.jsx("div", {
        className: "space-y-4",
        children: e.jsxs("div", {
          className: "space-x-4",
          children: [
            e.jsx(a, { ...s, variant: "default", children: "Default" }),
            e.jsx(a, { ...s, variant: "home", children: "Home" }),
          ],
        }),
      }),
    parameters: {
      docs: {
        description: {
          story: "Different visual variants of the menu item component.",
        },
      },
    },
  },
  t = {
    args: { children: "Menu Item", variant: "default" },
    render: (s) =>
      e.jsx("div", {
        className: "space-y-4",
        children: e.jsxs("div", {
          className: "space-x-4",
          children: [
            e.jsx(a, { ...s, size: "xsmall", children: "XSmall" }),
            e.jsx(a, { ...s, size: "large", children: "Large" }),
            e.jsx(a, { ...s, size: "xlarge", children: "XLarge" }),
          ],
        }),
      }),
    parameters: {
      docs: {
        description: {
          story: "Different sizes available for the menu item component.",
        },
      },
    },
  },
  i = {
    args: { children: "Menu Item", size: "large", variant: "default" },
    render: (s) =>
      e.jsx("div", {
        className: "space-y-4",
        children: e.jsxs("div", {
          className: "space-x-4",
          children: [
            e.jsx(a, { ...s, children: "Normal" }),
            e.jsx(a, { ...s, disabled: !0, children: "Disabled" }),
          ],
        }),
      }),
    parameters: {
      docs: {
        description: { story: "Different states of the menu item component." },
      },
    },
  },
  l = {
    args: {},
    render: () =>
      e.jsxs("div", {
        className: "space-y-6",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "Default Variant",
              }),
              e.jsxs("div", {
                className: "space-x-4",
                children: [
                  e.jsx(a, { size: "xsmall", children: "XSmall" }),
                  e.jsx(a, { size: "large", children: "Large" }),
                  e.jsx(a, { size: "xlarge", children: "XLarge" }),
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "Home Variant",
              }),
              e.jsxs("div", {
                className: "space-x-4",
                children: [
                  e.jsx(a, {
                    variant: "home",
                    size: "xsmall",
                    children: "XSmall",
                  }),
                  e.jsx(a, {
                    variant: "home",
                    size: "large",
                    children: "Large",
                  }),
                  e.jsx(a, {
                    variant: "home",
                    size: "xlarge",
                    children: "XLarge",
                  }),
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "Disabled States",
              }),
              e.jsxs("div", {
                className: "space-x-4",
                children: [
                  e.jsx(a, {
                    size: "large",
                    disabled: !0,
                    children: "Default Disabled",
                  }),
                  e.jsx(a, {
                    variant: "home",
                    size: "large",
                    disabled: !0,
                    children: "Home Disabled",
                  }),
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
            "Complete overview of all menu item variants, sizes, and states.",
        },
      },
    },
  };
n.parameters = {
  ...n.parameters,
  docs: {
    ...n.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    children: "Menu Item",
    size: "large"
  }
}`,
      ...n.parameters?.docs?.source,
    },
  },
};
r.parameters = {
  ...r.parameters,
  docs: {
    ...r.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    children: "Menu Item",
    size: "large"
  },
  render: args => <div className="space-y-4">
      <div className="space-x-4">
        <MenuBarItem {...args} variant="default">
          Default
        </MenuBarItem>
        <MenuBarItem {...args} variant="home">
          Home
        </MenuBarItem>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different visual variants of the menu item component."
      }
    }
  }
}`,
      ...r.parameters?.docs?.source,
    },
  },
};
t.parameters = {
  ...t.parameters,
  docs: {
    ...t.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    children: "Menu Item",
    variant: "default"
  },
  render: args => <div className="space-y-4">
      <div className="space-x-4">
        <MenuBarItem {...args} size="xsmall">
          XSmall
        </MenuBarItem>
        <MenuBarItem {...args} size="large">
          Large
        </MenuBarItem>
        <MenuBarItem {...args} size="xlarge">
          XLarge
        </MenuBarItem>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different sizes available for the menu item component."
      }
    }
  }
}`,
      ...t.parameters?.docs?.source,
    },
  },
};
i.parameters = {
  ...i.parameters,
  docs: {
    ...i.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    children: "Menu Item",
    size: "large",
    variant: "default"
  },
  render: args => <div className="space-y-4">
      <div className="space-x-4">
        <MenuBarItem {...args}>Normal</MenuBarItem>
        <MenuBarItem {...args} disabled>
          Disabled
        </MenuBarItem>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different states of the menu item component."
      }
    }
  }
}`,
      ...i.parameters?.docs?.source,
    },
  },
};
l.parameters = {
  ...l.parameters,
  docs: {
    ...l.parameters?.docs,
    source: {
      originalSource: `{
  args: {},
  render: () => <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Default Variant</h3>
        <div className="space-x-4">
          <MenuBarItem size="xsmall">XSmall</MenuBarItem>
          <MenuBarItem size="large">Large</MenuBarItem>
          <MenuBarItem size="xlarge">XLarge</MenuBarItem>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Home Variant</h3>
        <div className="space-x-4">
          <MenuBarItem variant="home" size="xsmall">
            XSmall
          </MenuBarItem>
          <MenuBarItem variant="home" size="large">
            Large
          </MenuBarItem>
          <MenuBarItem variant="home" size="xlarge">
            XLarge
          </MenuBarItem>
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Disabled States</h3>
        <div className="space-x-4">
          <MenuBarItem size="large" disabled>
            Default Disabled
          </MenuBarItem>
          <MenuBarItem variant="home" size="large" disabled>
            Home Disabled
          </MenuBarItem>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Complete overview of all menu item variants, sizes, and states."
      }
    }
  }
}`,
      ...l.parameters?.docs?.source,
    },
  },
};
const p = ["Default", "Variants", "Sizes", "States", "AllVariants"];
export {
  l as AllVariants,
  n as Default,
  t as Sizes,
  i as States,
  r as Variants,
  p as __namedExportsOrder,
  u as default,
};
