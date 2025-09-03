import { j as e } from "./jsx-runtime-C_nHp4yK.js";
import { r as w } from "./iframe-D_aMTKb2.js";
import { L as N } from "./Logo-DM7O8ATg.js";
import { M as l } from "./MenuBar-anMCqtJv.js";
import { M as p } from "./MenuBarItem-Dp8NM2fx.js";
import { B as y } from "./Button-Z4hbXct5.js";
import { A as k } from "./AvatarContainer-Bt0G0TWZ.js";
import { A as H } from "./Avatar-C4Vb3oYl.js";
import { H as T } from "./HeaderTab-D9jUrYUx.js";
import { H as A } from "./Header-Bz-bT1Sq.js";
import "./preload-helper-DIZFD4sK.js";
function m() {
  const [t, h] = w.useState(!1),
    g = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CommunityRule",
      url: "https://communityrule.com",
      description: "Build operating manuals for successful communities",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://communityrule.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    x = [
      { href: "#", text: "Use cases", extraPadding: !0 },
      { href: "#", text: "Learn" },
      { href: "#", text: "About" },
    ],
    u = [
      { src: "/assets/Avatar_1.png", alt: "Avatar 1" },
      { src: "/assets/Avatar_2.png", alt: "Avatar 2" },
      { src: "/assets/Avatar_3.png", alt: "Avatar 3" },
    ],
    f = [
      { breakpoint: "block sm:hidden", size: "homeHeaderXsmall", showText: !1 },
      {
        breakpoint: "hidden sm:block md:hidden",
        size: "homeHeaderSm",
        showText: !0,
      },
      {
        breakpoint: "hidden md:block lg:hidden",
        size: "homeHeaderMd",
        showText: !0,
      },
      {
        breakpoint: "hidden lg:block xl:hidden",
        size: "homeHeaderLg",
        showText: !0,
      },
      { breakpoint: "hidden xl:block", size: "homeHeaderXl", showText: !0 },
    ],
    n = (a) =>
      x.map((r, s) =>
        e.jsx(
          p,
          {
            href: r.href,
            size:
              r.extraPadding &&
              (a === "xsmall" ||
                a === "default" ||
                a === "home" ||
                a === "homeMd" ||
                a === "large" ||
                a === "homeXlarge")
                ? a === "home" || a === "homeMd"
                  ? "homeMd"
                  : a === "large"
                    ? "large"
                    : a === "homeXlarge"
                      ? "homeXlarge"
                      : "xsmallUseCases"
                : a,
            variant:
              a === "xsmall" ||
              a === "default" ||
              a === "home" ||
              a === "homeMd" ||
              a === "large" ||
              a === "homeXlarge"
                ? "home"
                : "default",
            onClick: () => h(!t),
            ariaLabel: `Navigate to ${r.text} page`,
            children: r.text,
          },
          s,
        ),
      ),
    v = (a, r) =>
      e.jsx(k, {
        size: a,
        children: u.map((s, j) =>
          e.jsx(H, { src: s.src, alt: s.alt, size: r }, j),
        ),
      }),
    o = (a) =>
      e.jsx(p, {
        href: "#",
        size: a,
        variant: a === "xsmall" || a === "default" ? "home" : "default",
        ariaLabel: "Log in to your account",
        children: "Log in",
      }),
    d = (a, r, s) =>
      e.jsxs(y, {
        size: a,
        variant: "secondary",
        ariaLabel: "Create a new rule with avatar decoration",
        children: [v(r, s), e.jsx("span", { children: "Create rule" })],
      }),
    b = (a, r) => e.jsx(N, { size: a, showText: r });
  return t
    ? e.jsx(A, { onToggle: () => h(!1) })
    : e.jsxs(e.Fragment, {
        children: [
          e.jsx("script", {
            type: "application/ld+json",
            dangerouslySetInnerHTML: { __html: JSON.stringify(g) },
          }),
          e.jsx("header", {
            className: "w-full bg-transparent overflow-hidden",
            role: "banner",
            "aria-label": "Home page navigation header",
            children: e.jsxs("nav", {
              className:
                "relative flex items-center justify-between mx-auto h-[50px] sm:h-[62px] md:h-[68px] lg:h-[68px] xl:h-[88px] px-[var(--spacing-scale-008)] pr-[var(--spacing-scale-016)] pt-[var(--spacing-scale-010)] sm:px-[var(--spacing-scale-010)] sm:pr-[var(--spacing-scale-020)] sm:pt-[var(--spacing-scale-010)] md:px-[var(--spacing-scale-016)] md:pr-[var(--spacing-scale-032)] md:pt-[var(--spacing-scale-016)] lg:pl-[var(--spacing-scale-024)] lg:pt-[var(--spacing-scale-016)] lg:pr-[var(--spacing-scale-056)] xl:pl-[var(--spacing-scale-048)] xl:pt-[var(--spacing-scale-024)] xl:pr-[var(--spacing-scale-056)]",
              role: "navigation",
              "aria-label": "Main navigation",
              children: [
                e.jsxs(T, {
                  className: "flex items-center self-end",
                  stretch: !0,
                  children: [
                    e.jsx("div", {
                      children: f.map((a, r) =>
                        e.jsx(
                          "div",
                          {
                            className: a.breakpoint,
                            children: b(a.size, a.showText),
                          },
                          r,
                        ),
                      ),
                    }),
                    e.jsx("div", {
                      className: "block sm:hidden -me-[2px]",
                      children: e.jsxs(l, {
                        size: "default",
                        children: [n("xsmall"), o("xsmall")],
                      }),
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className:
                    "absolute left-1/2 transform -translate-x-1/2 hidden sm:block",
                  children: [
                    e.jsx("div", {
                      className: "hidden sm:block md:hidden",
                      children: e.jsxs(l, {
                        size: "default",
                        children: [n("xsmall"), o("xsmall")],
                      }),
                    }),
                    e.jsx("div", {
                      className: "hidden md:block lg:hidden",
                      children: e.jsx(l, {
                        size: "medium",
                        children: n("homeMd"),
                      }),
                    }),
                    e.jsx("div", {
                      className: "hidden lg:block xl:hidden",
                      children: e.jsx(l, {
                        size: "large",
                        children: n("large"),
                      }),
                    }),
                    e.jsx("div", {
                      className: "hidden xl:block",
                      children: e.jsx(l, {
                        size: "large",
                        children: n("homeXlarge"),
                      }),
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "flex items-center",
                  children: [
                    e.jsx("div", {
                      className: "block md:hidden",
                      children: d("xsmall", "small", "small"),
                    }),
                    e.jsx("div", {
                      className:
                        "hidden md:block lg:hidden absolute right-[var(--spacing-measures-spacing-016)]",
                      children: e.jsxs("div", {
                        className:
                          "flex items-center gap-[var(--spacing-scale-010)]",
                        children: [o("homeMd"), d("small", "medium", "medium")],
                      }),
                    }),
                    e.jsx("div", {
                      className: "hidden lg:flex xl:hidden items-center",
                      children: e.jsxs("div", {
                        className:
                          "flex items-center gap-[var(--spacing-scale-004)]",
                        children: [o("large"), d("large", "large", "large")],
                      }),
                    }),
                    e.jsx("div", {
                      className: "hidden xl:flex items-center",
                      children: e.jsxs("div", {
                        className:
                          "flex items-center gap-[var(--spacing-scale-004)]",
                        children: [
                          o("homeXlarge"),
                          d("xlarge", "xlarge", "xlarge"),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      });
}
m.__docgenInfo = { description: "", methods: [], displayName: "HomeHeader" };
const U = {
    title: "Components/HomeHeader",
    component: m,
    parameters: {
      layout: "fullscreen",
      docs: {
        description: {
          component:
            "The home page header with transparent background, HeaderTab wrapper, and responsive behavior. Features a toggle to switch between home header and regular header.",
        },
      },
    },
    tags: ["autodocs"],
  },
  i = {
    args: {},
    parameters: {
      docs: {
        description: {
          story:
            "Use the Viewport toolbar to see how the home header adapts to different screen sizes. The header has a transparent background and uses HeaderTab for the left section.",
        },
      },
    },
  },
  c = {
    args: {},
    render: () =>
      e.jsxs("div", {
        className:
          "min-h-screen bg-gradient-to-b from-[var(--color-surface-default-primary)] to-[var(--color-surface-default-secondary)]",
        children: [
          e.jsx(m, {}),
          e.jsx("main", {
            className: "p-8",
            children: e.jsxs("div", {
              className: "max-w-4xl mx-auto text-center",
              children: [
                e.jsx("h1", {
                  className: "text-4xl font-bold text-white mb-4",
                  children: "Welcome to CommunityRule",
                }),
                e.jsx("p", {
                  className:
                    "text-xl text-[var(--color-content-default-secondary)] mb-8",
                  children:
                    "This demonstrates how the home header looks in a realistic home page context. The header maintains its transparent background and responsive behavior.",
                }),
                e.jsx("div", {
                  className:
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                  children: [1, 2, 3].map((t) =>
                    e.jsxs(
                      "div",
                      {
                        className:
                          "bg-[var(--color-surface-default-secondary)] p-6 rounded-lg border border-[var(--border-color-default-tertiary)]",
                        children: [
                          e.jsxs("h3", {
                            className: "text-white font-semibold mb-3",
                            children: ["Feature ", t],
                          }),
                          e.jsx("p", {
                            className:
                              "text-[var(--color-content-default-secondary)]",
                            children:
                              "This is example content to show how the home header integrates with home page content.",
                          }),
                        ],
                      },
                      t,
                    ),
                  ),
                }),
              ],
            }),
          }),
        ],
      }),
    parameters: {
      docs: {
        description: {
          story:
            "The home header integrated into a full home page layout with gradient background to show the transparent header effect.",
        },
      },
    },
  };
i.parameters = {
  ...i.parameters,
  docs: {
    ...i.parameters?.docs,
    source: {
      originalSource: `{
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Use the Viewport toolbar to see how the home header adapts to different screen sizes. The header has a transparent background and uses HeaderTab for the left section."
      }
    }
  }
}`,
      ...i.parameters?.docs?.source,
    },
  },
};
c.parameters = {
  ...c.parameters,
  docs: {
    ...c.parameters?.docs,
    source: {
      originalSource: `{
  args: {},
  render: () => <div className="min-h-screen bg-gradient-to-b from-[var(--color-surface-default-primary)] to-[var(--color-surface-default-secondary)]">
      <HomeHeader />
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
            {[1, 2, 3].map(i => <div key={i} className="bg-[var(--color-surface-default-secondary)] p-6 rounded-lg border border-[var(--border-color-default-tertiary)]">
                <h3 className="text-white font-semibold mb-3">Feature {i}</h3>
                <p className="text-[var(--color-content-default-secondary)]">
                  This is example content to show how the home header integrates
                  with home page content.
                </p>
              </div>)}
          </div>
        </div>
      </main>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "The home header integrated into a full home page layout with gradient background to show the transparent header effect."
      }
    }
  }
}`,
      ...c.parameters?.docs?.source,
    },
  },
};
const q = ["Default", "InHomePageContext"];
export {
  i as Default,
  c as InHomePageContext,
  q as __namedExportsOrder,
  U as default,
};
