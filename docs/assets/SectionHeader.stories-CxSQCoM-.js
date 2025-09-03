import { S as n } from "./SectionHeader-CadpOP1T.js";
import "./jsx-runtime-C_nHp4yK.js";
import "./iframe-D_aMTKb2.js";
import "./preload-helper-DIZFD4sK.js";
const p = {
    title: "Components/SectionHeader",
    component: n,
    parameters: {
      layout: "centered",
      docs: {
        description: {
          component:
            "A section header component that displays a title and subtitle with responsive typography and layout. Supports different title text for large breakpoints and maintains consistent spacing across all screen sizes.",
        },
      },
    },
    argTypes: {
      title: {
        control: { type: "text" },
        description: "The main title text (used for xsm and sm breakpoints)",
      },
      subtitle: {
        control: { type: "text" },
        description: "The subtitle text below the main title",
      },
      titleLg: {
        control: { type: "text" },
        description:
          "The title text for lg and xl breakpoints (optional, falls back to title)",
      },
    },
    tags: ["autodocs"],
  },
  e = {
    args: {
      title: "How CommunityRule works",
      subtitle: "Here's a quick overview of the process, from start to finish.",
      titleLg: "How CommunityRule helps",
    },
  },
  t = {
    args: {
      title: "Our Mission",
      subtitle:
        "We're dedicated to helping communities thrive through better decision-making processes and transparent governance structures.",
      titleLg: "Building Better Communities",
    },
    parameters: {
      docs: {
        description: {
          story:
            "Example with custom content to show the flexibility of the component.",
        },
      },
    },
  },
  s = {
    args: {
      title: "Complex Process",
      subtitle:
        "This is a much longer subtitle that demonstrates how the component handles extended text content across different breakpoints and layout configurations.",
      titleLg: "Complex Process Simplified",
    },
    parameters: {
      docs: {
        description: {
          story:
            "Demonstrates how the component handles longer subtitle text across different breakpoints.",
        },
      },
    },
  },
  o = {
    args: {
      title: "Responsive Design",
      subtitle:
        "Test the responsive behavior by resizing your browser window or using the viewport controls in Storybook.",
      titleLg: "Responsive Design Test",
    },
    parameters: {
      docs: {
        description: {
          story:
            "Test the responsive behavior by resizing your browser window or using the viewport controls in Storybook.",
        },
      },
    },
  },
  r = {
    args: {
      title: "Simple Header",
      subtitle:
        "This example doesn't specify a titleLg prop, so it will use the same title text across all breakpoints.",
    },
    parameters: {
      docs: {
        description: {
          story:
            "Shows the component without a titleLg prop, demonstrating the fallback behavior.",
        },
      },
    },
  };
e.parameters = {
  ...e.parameters,
  docs: {
    ...e.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    title: "How CommunityRule works",
    subtitle: "Here's a quick overview of the process, from start to finish.",
    titleLg: "How CommunityRule helps"
  }
}`,
      ...e.parameters?.docs?.source,
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
    title: "Our Mission",
    subtitle: "We're dedicated to helping communities thrive through better decision-making processes and transparent governance structures.",
    titleLg: "Building Better Communities"
  },
  parameters: {
    docs: {
      description: {
        story: "Example with custom content to show the flexibility of the component."
      }
    }
  }
}`,
      ...t.parameters?.docs?.source,
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
    title: "Complex Process",
    subtitle: "This is a much longer subtitle that demonstrates how the component handles extended text content across different breakpoints and layout configurations.",
    titleLg: "Complex Process Simplified"
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates how the component handles longer subtitle text across different breakpoints."
      }
    }
  }
}`,
      ...s.parameters?.docs?.source,
    },
  },
};
o.parameters = {
  ...o.parameters,
  docs: {
    ...o.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    title: "Responsive Design",
    subtitle: "Test the responsive behavior by resizing your browser window or using the viewport controls in Storybook.",
    titleLg: "Responsive Design Test"
  },
  parameters: {
    docs: {
      description: {
        story: "Test the responsive behavior by resizing your browser window or using the viewport controls in Storybook."
      }
    }
  }
}`,
      ...o.parameters?.docs?.source,
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
    title: "Simple Header",
    subtitle: "This example doesn't specify a titleLg prop, so it will use the same title text across all breakpoints."
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the component without a titleLg prop, demonstrating the fallback behavior."
      }
    }
  }
}`,
      ...r.parameters?.docs?.source,
    },
  },
};
const m = [
  "Default",
  "CustomContent",
  "LongSubtitle",
  "ResponsiveTest",
  "WithoutTitleLg",
];
export {
  t as CustomContent,
  e as Default,
  s as LongSubtitle,
  o as ResponsiveTest,
  r as WithoutTitleLg,
  m as __namedExportsOrder,
  p as default,
};
