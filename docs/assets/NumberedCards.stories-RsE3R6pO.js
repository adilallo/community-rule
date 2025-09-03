import { j as e } from "./jsx-runtime-C_nHp4yK.js";
import { N as m } from "./NumberedCard-ClCynPua.js";
import { S as u } from "./SectionHeader-CadpOP1T.js";
import { B as c } from "./Button-Z4hbXct5.js";
import "./iframe-D_aMTKb2.js";
import "./preload-helper-DIZFD4sK.js";
import "./SectionNumber-Cptefv18.js";
const l = ({ title: r, subtitle: a, cards: i }) => {
  const p = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: r,
    description: a,
    step: i.map((o, t) => ({
      "@type": "HowToStep",
      position: t + 1,
      name: o.text,
      text: o.text,
    })),
  };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx("script", {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(p) },
      }),
      e.jsx("section", {
        className:
          "bg-transparent py-[var(--spacing-scale-032)] px-[var(--spacing-scale-020)] sm:py-[var(--spacing-scale-048)] sm:px-[var(--spacing-scale-032)] lg:py-[var(--spacing-scale-064)] lg:px-[var(--spacing-scale-064)] xl:py-[var(--spacing-scale-076)] xl:px-[var(--spacing-scale-064)]",
        children: e.jsx("div", {
          className: "max-w-[var(--spacing-measures-max-width-lg)] mx-auto",
          children: e.jsxs("div", {
            className:
              "grid grid-cols-1 gap-y-[var(--spacing-scale-032)] lg:gap-y-[var(--spacing-scale-056)]",
            children: [
              e.jsx("div", {
                children: e.jsx(u, {
                  title: r,
                  subtitle: a,
                  titleLg: "How CommunityRule helps",
                }),
              }),
              e.jsx("div", {
                className:
                  "grid grid-cols-1 gap-y-[var(--spacing-scale-024)] lg:grid-cols-3 lg:gap-[var(--spacing-scale-024)]",
                children: i.map((o, t) =>
                  e.jsx(
                    m,
                    {
                      number: t + 1,
                      text: o.text,
                      iconShape: o.iconShape,
                      iconColor: o.iconColor,
                    },
                    t,
                  ),
                ),
              }),
              e.jsxs("div", {
                className: "text-center sm:text-left lg:text-center",
                children: [
                  e.jsx("div", {
                    className: "block lg:hidden",
                    children: e.jsx(c, {
                      variant: "default",
                      size: "large",
                      children: "Create CommunityRule",
                    }),
                  }),
                  e.jsx("div", {
                    className: "hidden lg:block",
                    children: e.jsx(c, {
                      variant: "outlined",
                      size: "large",
                      children: "See how it works",
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
    ],
  });
};
l.__docgenInfo = { description: "", methods: [], displayName: "NumberedCards" };
const C = {
    title: "Components/NumberedCards",
    component: l,
    parameters: {
      layout: "fullscreen",
      docs: {
        description: {
          component:
            "A component system for visually communicating multi-step workflows, processes, or value propositions. The component's modular design with NumberedCard and SectionNumber sub-components makes it ideal for explaining any sequential process while maintaining brand consistency and accessibility standards across the design system.",
        },
      },
    },
    argTypes: {
      title: {
        control: { type: "text" },
        description: "The main title for the section",
      },
      subtitle: {
        control: { type: "text" },
        description: "The subtitle text below the main title",
      },
      cards: {
        control: { type: "object" },
        description:
          "Array of card objects with text, iconShape, and iconColor properties",
      },
    },
    tags: ["autodocs"],
  },
  n = {
    args: {
      title: "How CommunityRule works",
      subtitle: "Here's a quick overview of the process, from start to finish.",
      cards: [
        {
          text: "Document how your community makes decisions",
          iconShape: "blob",
          iconColor: "green",
        },
        {
          text: "Build an operating manual for a successful community",
          iconShape: "gear",
          iconColor: "purple",
        },
        {
          text: "Get a link to your manual for your group to review and evolve",
          iconShape: "star",
          iconColor: "orange",
        },
      ],
    },
  },
  s = {
    args: {
      title: "Our Process",
      subtitle: "Follow these simple steps to get started with your project.",
      cards: [
        {
          text: "Define your project requirements and goals",
          iconShape: "blob",
          iconColor: "green",
        },
        {
          text: "Collaborate with our team to create the perfect solution",
          iconShape: "gear",
          iconColor: "purple",
        },
        {
          text: "Launch and iterate based on user feedback",
          iconShape: "star",
          iconColor: "orange",
        },
        {
          text: "Scale and optimize for continued success",
          iconShape: "blob",
          iconColor: "blue",
        },
      ],
    },
    parameters: {
      docs: {
        description: {
          story:
            "Example with custom content and four cards to show flexibility.",
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
    title: "How CommunityRule works",
    subtitle: "Here's a quick overview of the process, from start to finish.",
    cards: [{
      text: "Document how your community makes decisions",
      iconShape: "blob",
      iconColor: "green"
    }, {
      text: "Build an operating manual for a successful community",
      iconShape: "gear",
      iconColor: "purple"
    }, {
      text: "Get a link to your manual for your group to review and evolve",
      iconShape: "star",
      iconColor: "orange"
    }]
  }
}`,
      ...n.parameters?.docs?.source,
    },
  },
};
s.parameters = {
  ...s.parameters,
  docs: {
    ...s.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    title: "Our Process",
    subtitle: "Follow these simple steps to get started with your project.",
    cards: [{
      text: "Define your project requirements and goals",
      iconShape: "blob",
      iconColor: "green"
    }, {
      text: "Collaborate with our team to create the perfect solution",
      iconShape: "gear",
      iconColor: "purple"
    }, {
      text: "Launch and iterate based on user feedback",
      iconShape: "star",
      iconColor: "orange"
    }, {
      text: "Scale and optimize for continued success",
      iconShape: "blob",
      iconColor: "blue"
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "Example with custom content and four cards to show flexibility."
      }
    }
  }
}`,
      ...s.parameters?.docs?.source,
    },
  },
};
const v = ["Default", "CustomContent"];
export {
  s as CustomContent,
  n as Default,
  v as __namedExportsOrder,
  C as default,
};
