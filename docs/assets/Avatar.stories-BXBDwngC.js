import { j as s } from "./jsx-runtime-C_nHp4yK.js";
import { A as a } from "./Avatar-C4Vb3oYl.js";
import "./iframe-D_aMTKb2.js";
import "./preload-helper-DIZFD4sK.js";
const d = {
    title: "Components/Avatar",
    component: a,
    parameters: {
      layout: "centered",
      docs: {
        description: {
          component:
            "A simple avatar component that displays user profile images with multiple size variants. Supports custom images and alt text for accessibility.",
        },
      },
    },
    argTypes: {
      src: {
        control: { type: "text" },
        description: "The source URL of the avatar image",
      },
      alt: {
        control: { type: "text" },
        description: "Alt text for accessibility",
      },
      size: {
        control: { type: "select" },
        options: ["small", "medium", "large", "xlarge"],
        description: "The size of the avatar",
      },
      className: {
        control: { type: "text" },
        description: "Additional CSS classes",
      },
    },
    tags: ["autodocs"],
  },
  r = {
    args: { src: "/assets/Avatar_1.png", alt: "User Avatar", size: "medium" },
  },
  t = {
    args: { src: "/assets/Avatar_1.png", alt: "User Avatar" },
    render: (e) =>
      s.jsx("div", {
        className: "space-y-4",
        children: s.jsxs("div", {
          className: "space-x-4",
          children: [
            s.jsx(a, { ...e, size: "small" }),
            s.jsx(a, { ...e, size: "medium" }),
            s.jsx(a, { ...e, size: "large" }),
            s.jsx(a, { ...e, size: "xlarge" }),
          ],
        }),
      }),
    parameters: {
      docs: {
        description: {
          story: "Different size variants available for the avatar component.",
        },
      },
    },
  },
  i = {
    args: { size: "large" },
    render: (e) =>
      s.jsx("div", {
        className: "space-y-4",
        children: s.jsxs("div", {
          className: "space-x-4",
          children: [
            s.jsx(a, { ...e, src: "assets/Avatar_1.png", alt: "User 1" }),
            s.jsx(a, { ...e, src: "assets/Avatar_2.png", alt: "User 2" }),
            s.jsx(a, { ...e, src: "assets/Avatar_3.png", alt: "User 3" }),
          ],
        }),
      }),
    parameters: {
      docs: {
        description: {
          story: "Different avatar images available in the project.",
        },
      },
    },
  },
  n = {
    args: {},
    render: () =>
      s.jsxs("div", {
        className: "space-y-6",
        children: [
          s.jsxs("div", {
            children: [
              s.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "Small Size",
              }),
              s.jsxs("div", {
                className: "space-x-4",
                children: [
                  s.jsx(a, {
                    size: "small",
                    src: "assets/Avatar_1.png",
                    alt: "User 1",
                  }),
                  s.jsx(a, {
                    size: "small",
                    src: "assets/Avatar_2.png",
                    alt: "User 2",
                  }),
                  s.jsx(a, {
                    size: "small",
                    src: "assets/Avatar_3.png",
                    alt: "User 3",
                  }),
                ],
              }),
            ],
          }),
          s.jsxs("div", {
            children: [
              s.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "Medium Size",
              }),
              s.jsxs("div", {
                className: "space-x-4",
                children: [
                  s.jsx(a, {
                    size: "medium",
                    src: "assets/Avatar_1.png",
                    alt: "User 1",
                  }),
                  s.jsx(a, {
                    size: "medium",
                    src: "assets/Avatar_2.png",
                    alt: "User 2",
                  }),
                  s.jsx(a, {
                    size: "medium",
                    src: "assets/Avatar_3.png",
                    alt: "User 3",
                  }),
                ],
              }),
            ],
          }),
          s.jsxs("div", {
            children: [
              s.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "Large Size",
              }),
              s.jsxs("div", {
                className: "space-x-4",
                children: [
                  s.jsx(a, {
                    size: "large",
                    src: "assets/Avatar_1.png",
                    alt: "User 1",
                  }),
                  s.jsx(a, {
                    size: "large",
                    src: "assets/Avatar_2.png",
                    alt: "User 2",
                  }),
                  s.jsx(a, {
                    size: "large",
                    src: "assets/Avatar_3.png",
                    alt: "User 3",
                  }),
                ],
              }),
            ],
          }),
          s.jsxs("div", {
            children: [
              s.jsx("h3", {
                className: "text-white font-semibold mb-3",
                children: "XLarge Size",
              }),
              s.jsxs("div", {
                className: "space-x-4",
                children: [
                  s.jsx(a, {
                    size: "xlarge",
                    src: "assets/Avatar_1.png",
                    alt: "User 1",
                  }),
                  s.jsx(a, {
                    size: "xlarge",
                    src: "assets/Avatar_2.png",
                    alt: "User 2",
                  }),
                  s.jsx(a, {
                    size: "xlarge",
                    src: "assets/Avatar_3.png",
                    alt: "User 3",
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
            "Complete overview of all avatar sizes with different user images.",
        },
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
    src: "/assets/Avatar_1.png",
    alt: "User Avatar",
    size: "medium"
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
    src: "/assets/Avatar_1.png",
    alt: "User Avatar"
  },
  render: args => <div className="space-y-4">
      <div className="space-x-4">
        <Avatar {...args} size="small" />
        <Avatar {...args} size="medium" />
        <Avatar {...args} size="large" />
        <Avatar {...args} size="xlarge" />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different size variants available for the avatar component."
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
    size: "large"
  },
  render: args => <div className="space-y-4">
      <div className="space-x-4">
        <Avatar {...args} src="assets/Avatar_1.png" alt="User 1" />
        <Avatar {...args} src="assets/Avatar_2.png" alt="User 2" />
        <Avatar {...args} src="assets/Avatar_3.png" alt="User 3" />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Different avatar images available in the project."
      }
    }
  }
}`,
      ...i.parameters?.docs?.source,
    },
  },
};
n.parameters = {
  ...n.parameters,
  docs: {
    ...n.parameters?.docs,
    source: {
      originalSource: `{
  args: {},
  render: () => <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-3">Small Size</h3>
        <div className="space-x-4">
                  <Avatar size="small" src="assets/Avatar_1.png" alt="User 1" />
        <Avatar size="small" src="assets/Avatar_2.png" alt="User 2" />
        <Avatar size="small" src="assets/Avatar_3.png" alt="User 3" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Medium Size</h3>
        <div className="space-x-4">
                  <Avatar size="medium" src="assets/Avatar_1.png" alt="User 1" />
        <Avatar size="medium" src="assets/Avatar_2.png" alt="User 2" />
        <Avatar size="medium" src="assets/Avatar_3.png" alt="User 3" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">Large Size</h3>
        <div className="space-x-4">
                  <Avatar size="large" src="assets/Avatar_1.png" alt="User 1" />
        <Avatar size="large" src="assets/Avatar_2.png" alt="User 2" />
        <Avatar size="large" src="assets/Avatar_3.png" alt="User 3" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-semibold mb-3">XLarge Size</h3>
        <div className="space-x-4">
                  <Avatar size="xlarge" src="assets/Avatar_1.png" alt="User 1" />
        <Avatar size="xlarge" src="assets/Avatar_2.png" alt="User 2" />
        <Avatar size="xlarge" src="assets/Avatar_3.png" alt="User 3" />
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Complete overview of all avatar sizes with different user images."
      }
    }
  }
}`,
      ...n.parameters?.docs?.source,
    },
  },
};
const v = [
  "Default",
  "Sizes",
  "DifferentAvatars",
  "AllSizesWithDifferentAvatars",
];
export {
  n as AllSizesWithDifferentAvatars,
  r as Default,
  i as DifferentAvatars,
  t as Sizes,
  v as __namedExportsOrder,
  d as default,
};
