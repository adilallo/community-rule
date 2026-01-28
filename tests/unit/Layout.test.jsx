import { describe, test, expect, vi } from "vitest";
import RootLayout from "../../app/layout";

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

  test("renders main content area", () => {
    const testContent = "Test content";
    const tree = RootLayout({ children: <div>{testContent}</div> });
    const main = findDescendant(
      tree,
      (n) => n.type === "main" && n.props?.className?.includes("flex-1"),
    );
    expect(main).toBeTruthy();

    const childText = findDescendant(
      main,
      (n) => typeof n === "string" && n.includes(testContent),
    );
    expect(childText).toBeTruthy();
  });

  test("renders children content correctly", () => {
    const testContent = "This is test content";
    const tree = RootLayout({ children: <div>{testContent}</div> });
    const main = findDescendant(tree, (n) => n.type === "main");
    const childText = findDescendant(
      main,
      (n) => typeof n === "string" && n.includes(testContent),
    );
    expect(childText).toBeTruthy();
  });
});
