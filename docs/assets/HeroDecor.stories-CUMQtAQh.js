import { j as e } from "./jsx-runtime-C_nHp4yK.js";
import { H as o } from "./HeroDecor-Csfoi-N_.js";
import "./iframe-D_aMTKb2.js";
import "./preload-helper-DIZFD4sK.js";
const d = {
    title: "Components/HeroDecor",
    component: o,
    parameters: {
      layout: "centered",
      docs: {
        description: {
          component:
            "A decorative SVG component that provides background visual elements for the HeroBanner. Features grain effects and organic shapes that enhance the visual appeal without interfering with content readability.",
        },
      },
    },
    argTypes: {
      className: {
        control: { type: "text" },
        description: "Additional CSS classes for positioning and styling",
      },
    },
    tags: ["autodocs"],
  },
  r = {
    args: { className: "w-[400px] h-[200px]" },
    parameters: {
      docs: {
        description: {
          story:
            "Default hero decoration with standard sizing and positioning.",
        },
      },
    },
  },
  t = {
    args: { className: "w-[600px] h-[300px]" },
    render: (a) =>
      e.jsxs("div", {
        className:
          "bg-[var(--color-surface-default-brand-primary)] p-8 rounded-lg relative overflow-hidden",
        children: [
          e.jsx(o, { ...a }),
          e.jsxs("div", {
            className: "relative z-10 text-white mt-4",
            children: [
              e.jsx("h3", { children: "Content Overlay" }),
              e.jsx("p", {
                children:
                  "This demonstrates how the decoration appears behind content.",
              }),
            ],
          }),
        ],
      }),
    parameters: {
      docs: {
        description: {
          story:
            "Hero decoration with background color to show how it integrates with content.",
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
    className: "w-[400px] h-[200px]"
  },
  parameters: {
    docs: {
      description: {
        story: "Default hero decoration with standard sizing and positioning."
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
    className: "w-[600px] h-[300px]"
  },
  render: args => <div className="bg-[var(--color-surface-default-brand-primary)] p-8 rounded-lg relative overflow-hidden">
      <HeroDecor {...args} />
      <div className="relative z-10 text-white mt-4">
        <h3>Content Overlay</h3>
        <p>This demonstrates how the decoration appears behind content.</p>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Hero decoration with background color to show how it integrates with content."
      }
    }
  }
}`,
      ...t.parameters?.docs?.source,
    },
  },
};
const p = ["Default", "WithBackground"];
export {
  r as Default,
  t as WithBackground,
  p as __namedExportsOrder,
  d as default,
};
