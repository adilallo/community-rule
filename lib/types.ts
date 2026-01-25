/**
 * Shared type definitions for the CommunityRule application
 */

// Re-export types from other modules for convenience
export type { BlogPost, BlogStats } from "./content";

export type { BlogPostFrontmatter, ValidationResult } from "./validation";

export type {
  Heading,
  Link,
  Image,
  ProcessedMarkdown,
  ProcessedFrontmatter,
} from "./mdx";

export type { CacheStats } from "./cache";

// Additional shared types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params?: Record<string, string | string[]>;
  searchParams?: Record<string, string | string[]>;
}
