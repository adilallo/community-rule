import { useMemo } from "react";

/**
 * Types for Schema.org structured data
 */
export interface SchemaOrganization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  email?: string;
  url: string;
  sameAs?: string[];
}

export interface SchemaWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

export interface SchemaHowTo {
  "@context": "https://schema.org";
  "@type": "HowTo";
  name: string;
  description: string;
  step: Array<{
    "@type": "HowToStep";
    position: number;
    name: string;
    text: string;
  }>;
}

export interface SchemaArticle {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    url: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
  url: string;
  articleSection?: string;
  keywords?: string[];
}

export interface SchemaBreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Hook for generating Schema.org structured data (JSON-LD)
 * Provides type-safe schema generation for SEO and search engines
 *
 * @example
 * ```tsx
 * const schemaData = useSchemaData({
 *   type: "HowTo",
 *   name: "How to build a community",
 *   description: "Step-by-step guide",
 *   steps: [
 *     { name: "Step 1", text: "Start here" },
 *     { name: "Step 2", text: "Continue here" },
 *   ],
 * });
 *
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
 * />
 * ```
 */
export function useSchemaData(
  config:
    | {
        type: "Organization";
        name: string;
        email?: string;
        url: string;
        sameAs?: string[];
      }
    | {
        type: "WebSite";
        name: string;
        url: string;
        potentialAction?: {
          target: string;
          "query-input": string;
        };
      }
    | {
        type: "HowTo";
        name: string;
        description: string;
        steps: Array<{ name: string; text: string }>;
      }
    | {
        type: "Article";
        headline: string;
        description: string;
        author: string;
        publisher: {
          name: string;
          url: string;
          logo?: string;
        };
        datePublished: string;
        dateModified: string;
        url: string;
        mainEntityOfPage?: string;
        articleSection?: string;
        keywords?: string[];
      }
    | {
        type: "BreadcrumbList";
        items: Array<{ name: string; url: string }>;
      },
): SchemaOrganization | SchemaWebSite | SchemaHowTo | SchemaArticle | SchemaBreadcrumbList {
  return useMemo(() => {
    switch (config.type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: config.name,
          ...(config.email && { email: config.email }),
          url: config.url,
          ...(config.sameAs && { sameAs: config.sameAs }),
        } as SchemaOrganization;

      case "WebSite":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: config.name,
          url: config.url,
          ...(config.potentialAction && {
            potentialAction: {
              "@type": "SearchAction",
              target: config.potentialAction.target,
              "query-input": config.potentialAction["query-input"],
            },
          }),
        } as SchemaWebSite;

      case "HowTo":
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: config.name,
          description: config.description,
          step: config.steps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text,
          })),
        } as SchemaHowTo;

      case "Article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: config.headline,
          description: config.description,
          author: {
            "@type": "Person",
            name: config.author,
          },
          publisher: {
            "@type": "Organization",
            name: config.publisher.name,
            url: config.publisher.url,
            ...(config.publisher.logo && {
              logo: {
                "@type": "ImageObject",
                url: config.publisher.logo,
              },
            }),
          },
          datePublished: config.datePublished,
          dateModified: config.dateModified,
          url: config.url,
          ...(config.mainEntityOfPage && {
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": config.mainEntityOfPage,
            },
          }),
          ...(config.articleSection && { articleSection: config.articleSection }),
          ...(config.keywords && { keywords: config.keywords }),
        } as SchemaArticle;

      case "BreadcrumbList":
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: config.items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        } as SchemaBreadcrumbList;
    }
  }, [config]);
}
