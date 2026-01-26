import { renderHook } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { useSchemaData } from "../../../app/hooks/useSchemaData";

describe("useSchemaData", () => {
  test("generates Organization schema", () => {
    const { result } = renderHook(() =>
      useSchemaData({
        type: "Organization",
        name: "Test Org",
        url: "https://example.com",
        email: "test@example.com",
        sameAs: ["https://twitter.com/test"],
      }),
    );

    expect(result.current).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Test Org",
      url: "https://example.com",
      email: "test@example.com",
      sameAs: ["https://twitter.com/test"],
    });
  });

  test("generates WebSite schema", () => {
    const { result } = renderHook(() =>
      useSchemaData({
        type: "WebSite",
        name: "Test Site",
        url: "https://example.com",
        potentialAction: {
          target: "https://example.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }),
    );

    expect(result.current).toEqual({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Test Site",
      url: "https://example.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://example.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    });
  });

  test("generates HowTo schema", () => {
    const { result } = renderHook(() =>
      useSchemaData({
        type: "HowTo",
        name: "How to test",
        description: "Test description",
        steps: [
          { name: "Step 1", text: "Do this" },
          { name: "Step 2", text: "Do that" },
        ],
      }),
    );

    expect(result.current).toEqual({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to test",
      description: "Test description",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Step 1",
          text: "Do this",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Step 2",
          text: "Do that",
        },
      ],
    });
  });

  test("generates BreadcrumbList schema", () => {
    const { result } = renderHook(() =>
      useSchemaData({
        type: "BreadcrumbList",
        items: [
          { name: "Home", url: "https://example.com" },
          { name: "Page", url: "https://example.com/page" },
        ],
      }),
    );

    expect(result.current).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://example.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Page",
          item: "https://example.com/page",
        },
      ],
    });
  });
});
