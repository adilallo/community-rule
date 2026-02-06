import TopNav from "../../app/components/navigation/TopNav";

export default {
  title: "Components/Navigation/TopNav",
  component: TopNav,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Unified navigation component that supports two variants: folderTop (home page style with yellow HeaderTab) and standard (dark sticky header). Supports all props from Figma design: size, loggedIn, folderTop, profile, and logIn.",
      },
    },
  },
  argTypes: {
    folderTop: {
      control: "boolean",
      description: "When true, renders the home page variant with HeaderTab wrapper. When false, renders the standard header variant.",
    },
    loggedIn: {
      control: "boolean",
      description: "Whether the user is logged in (affects displayed elements).",
    },
    profile: {
      control: "boolean",
      description: "Whether to show the profile avatar.",
    },
    logIn: {
      control: "boolean",
      description: "Whether to show the Log in button.",
    },
  },
  tags: ["autodocs"],
};

// Standard variant (folderTop=false)
export const Standard = {
  args: {
    folderTop: false,
    loggedIn: false,
    profile: false,
    logIn: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Standard header variant (folderTop=false) with dark background and sticky positioning. Use the Viewport toolbar to see responsive behavior.",
      },
    },
  },
};

// Home page variant (folderTop=true)
export const HomePage = {
  args: {
    folderTop: true,
    loggedIn: false,
    profile: false,
    logIn: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Home page variant (folderTop=true) with transparent background and yellow HeaderTab wrapper. Use the Viewport toolbar to see responsive behavior.",
      },
    },
  },
};

// Standard variant with logged in user
export const StandardLoggedIn = {
  args: {
    folderTop: false,
    loggedIn: true,
    profile: true,
    logIn: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Standard header variant with logged in user showing profile avatar instead of login button.",
      },
    },
  },
};

// Home page variant with logged in user
export const HomePageLoggedIn = {
  args: {
    folderTop: true,
    loggedIn: true,
    profile: true,
    logIn: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Home page variant with logged in user showing profile avatar instead of login button.",
      },
    },
  },
};

// Standard variant in page context
export const StandardInPageContext = {
  args: {
    folderTop: false,
    loggedIn: false,
    profile: false,
    logIn: true,
  },
  render: (args) => (
    <div className="min-h-screen bg-[var(--color-surface-default-primary)]">
      <TopNav {...args} />
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">
            Example Page Content
          </h1>
          <p className="text-white mb-4">
            This demonstrates how the standard header looks in a realistic page
            context. The header maintains its responsive behavior while providing
            navigation for the page content.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[var(--color-surface-default-secondary)] p-4 rounded-lg"
              >
                <h3 className="text-white font-semibold mb-2">
                  Content Block {i}
                </h3>
                <p className="text-[var(--color-content-default-secondary)] text-sm">
                  This is example content to show how the header integrates with
                  page content.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The standard header integrated into a full page layout to show how it works in context.",
      },
    },
  },
};

// Home page variant in home page context
export const HomePageInContext = {
  args: {
    folderTop: true,
    loggedIn: false,
    profile: false,
    logIn: true,
  },
  render: (args) => (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-surface-default-primary)] to-[var(--color-surface-default-secondary)]">
      <TopNav {...args} />
      <main className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to CommunityRule
          </h1>
          <p className="text-xl text-[var(--color-content-default-secondary)] mb-8">
            This demonstrates how the home header looks in a realistic home page
            context. The header maintains its transparent background and
            responsive behavior.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg border border-[var(--border-color-default-tertiary)]"
              >
                <h3 className="text-white font-semibold mb-3">Feature {i}</h3>
                <p className="text-[var(--color-content-default-secondary)]">
                  This is example content to show how the home header integrates
                  with home page content.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The home header integrated into a full home page layout with gradient background to show the transparent header effect.",
      },
    },
  },
};
