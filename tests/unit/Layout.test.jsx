import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

describe("RootLayout", () => {
  test("renders HTML structure with correct attributes", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    const html = document.querySelector("html");
    expect(html).toBeInTheDocument();
    expect(html).toHaveAttribute("lang", "en");
    expect(html).toHaveClass("font-sans");
  });

  test("renders body with font variables", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    const body = document.querySelector("body");
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass("--font-inter");
    expect(body).toHaveClass("--font-bricolage-grotesque");
    expect(body).toHaveClass("--font-space-grotesk");
  });

  test("renders main layout structure", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    const mainContainer = document.querySelector(".min-h-screen.flex.flex-col");
    expect(mainContainer).toBeInTheDocument();
  });

  test("renders HomeHeader component", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    // The HomeHeader component should be rendered
    // We can check for its presence by looking for elements that would be in the header
    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  test("renders main content area", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    const main = document.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("flex-1");
    expect(main).toHaveTextContent("Test content");
  });

  test("renders Footer component", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    // The Footer component should be rendered
    const footer = document.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  test("renders children content correctly", () => {
    const testContent = "This is test content";
    render(
      <RootLayout>
        <div>{testContent}</div>
      </RootLayout>,
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  test("has correct CSS classes for layout structure", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    const mainContainer = document.querySelector(".min-h-screen.flex.flex-col");
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass("min-h-screen");
    expect(mainContainer).toHaveClass("flex");
    expect(mainContainer).toHaveClass("flex-col");
  });

  test("main element has correct flex properties", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    const main = document.querySelector("main");
    expect(main).toHaveClass("flex-1");
  });

  test("renders complete page structure", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    // Check for all major structural elements
    expect(document.querySelector("html")).toBeInTheDocument();
    expect(document.querySelector("body")).toBeInTheDocument();
    expect(document.querySelector("header")).toBeInTheDocument();
    expect(document.querySelector("main")).toBeInTheDocument();
    expect(document.querySelector("footer")).toBeInTheDocument();
  });

  test("maintains proper document structure", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    // Check that the document has proper structure
    const html = document.querySelector("html");
    const body = html.querySelector("body");
    const header = body.querySelector("header");
    const main = body.querySelector("main");
    const footer = body.querySelector("footer");

    expect(html).toBeInTheDocument();
    expect(body).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  test("renders multiple children correctly", () => {
    render(
      <RootLayout>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </RootLayout>,
    );

    expect(screen.getByText("First child")).toBeInTheDocument();
    expect(screen.getByText("Second child")).toBeInTheDocument();
    expect(screen.getByText("Third child")).toBeInTheDocument();
  });
});
