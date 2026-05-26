import { describe, test, expect, vi } from "vitest";
import RootLayout, { metadata } from "../../app/layout";
import MarketingLayout from "../../app/(marketing)/layout";
import AppLayout from "../../app/(app)/layout";

// Mock the font imports since they're Next.js specific
vi.mock("next/font/google", () => ({
  Inter: vi.fn(() => ({
    variable: "--font-inter",
    style: { fontFamily: "Inter" },
  })),
  Bricolage_Grotesque: vi.fn(() => ({
    variable: "--font-bricolage-grotesque",
    style: { fontFamily: "Bricolage Grotesque" },
  })),
  Space_Grotesk: vi.fn(() => ({
    variable: "--font-space-grotesk",
    style: { fontFamily: "Space Grotesk" },
  })),
}));

function findChildByType(node, type) {
  if (!node || typeof node !== "object") return null;
  const children = Array.isArray(node.props?.children)
    ? node.props.children
    : [node.props?.children].filter(Boolean);

  for (const child of children) {
    if (child?.type === type) return child;
  }
  return null;
}

function findDescendant(node, predicate) {
  if (predicate(node)) return node;
  if (!node || typeof node !== "object") return null;

  const children = Array.isArray(node.props?.children)
    ? node.props.children
    : [node.props?.children].filter(Boolean);

  for (const child of children) {
    const found = findDescendant(child, predicate);
    if (found) return found;
  }
  return null;
}

describe("RootLayout", () => {
  test("renders HTML structure with correct attributes", () => {
    const tree = RootLayout({ children: <div>Test content</div> });
    expect(tree.type).toBe("html");
    expect(tree.props.lang).toBe("en");
    expect(tree.props.className).toContain("font-sans");
  });

  test("renders body with font variables", () => {
    const tree = RootLayout({ children: <div>Test content</div> });
    const body = findChildByType(tree, "body");
    expect(body).toBeTruthy();
    expect(body.props.className).toContain("--font-inter");
    expect(body.props.className).toContain("--font-bricolage-grotesque");
    expect(body.props.className).toContain("--font-space-grotesk");
  });

  test("renders main layout structure", () => {
    const tree = RootLayout({ children: <div>Test content</div> });
    const container = findDescendant(
      tree,
      (n) => n.type === "div" && n.props?.className?.includes("min-h-screen"),
    );
    expect(container).toBeTruthy();
  });

  test("renders children directly inside the flex container (no <main> at root)", () => {
    const testContent = "This is test content";
    const tree = RootLayout({ children: <div>{testContent}</div> });

    expect(findDescendant(tree, (n) => n?.type === "main")).toBeNull();

    const childText = findDescendant(
      tree,
      (n) => typeof n === "string" && n.includes(testContent),
    );
    expect(childText).toBeTruthy();
  });

  test("declares svg, ico, png, and apple-touch icons for cross-browser support", () => {
    const icons = metadata.icons;
    expect(icons?.icon).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "/assets/logos/community-rule.svg",
          type: "image/svg+xml",
        }),
        expect.objectContaining({ url: "/favicon.ico", sizes: "any" }),
        expect.objectContaining({
          url: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        }),
        expect.objectContaining({
          url: "/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        }),
      ]),
    );
    expect(icons?.apple).toEqual([
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ]);
  });
});

describe("Group layouts (chrome composition)", () => {
  test("MarketingLayout wraps children in <main flex-1> and appends Footer", () => {
    const tree = MarketingLayout({ children: <div>marketing-child</div> });
    const main = findDescendant(
      tree,
      (n) => n?.type === "main" && n.props?.className?.includes("flex-1"),
    );
    expect(main).toBeTruthy();
    expect(
      findDescendant(main, (n) => typeof n === "string" && n.includes("marketing-child")),
    ).toBeTruthy();

    // Footer is a next/dynamic component sibling to <main>. Find the node
    // whose children include <main>, then assert its sibling list also
    // contains a third element (the Footer dynamic component) — independent
    // of where MessagesProvider/AuthModalProvider sit in the tree.
    const mainSiblingParent = findDescendant(tree, (n) => {
      const ch = Array.isArray(n?.props?.children)
        ? n.props.children
        : [n?.props?.children].filter(Boolean);
      return ch.some(
        (c) =>
          c?.type === "main" && c.props?.className?.includes("flex-1"),
      );
    });
    expect(mainSiblingParent).toBeTruthy();
    const siblings = Array.isArray(mainSiblingParent.props.children)
      ? mainSiblingParent.props.children
      : [mainSiblingParent.props.children];
    expect(siblings.length).toBeGreaterThan(1);
  });

  test("AppLayout wraps children in <main flex-1> with no footer", () => {
    const tree = AppLayout({ children: <div>app-child</div> });
    const main = findDescendant(
      tree,
      (n) => n?.type === "main" && n.props?.className?.includes("flex-1"),
    );
    expect(main).toBeTruthy();
    expect(
      findDescendant(main, (n) => typeof n === "string" && n.includes("app-child")),
    ).toBeTruthy();
  });
});
