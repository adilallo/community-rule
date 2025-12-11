/**
 * Content validation utilities for blog posts
 */

export interface BlogPostSchemaField {
  type: "string" | "array" | "object";
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  default?: unknown;
  items?: {
    type: string;
    minLength?: number;
    maxLength?: number;
  };
  properties?: Record<string, BlogPostSchemaField>;
}

export interface BlogPostSchema {
  [key: string]: BlogPostSchemaField;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  author: string;
  date: string;
  related?: string[];
  thumbnail?: {
    vertical?: string;
    horizontal?: string;
  };
  banner?: {
    horizontal?: string;
  };
  background?: {
    color?: string;
  };
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Blog post frontmatter schema
 */
export const BLOG_POST_SCHEMA: BlogPostSchema = {
  title: {
    type: "string",
    required: true,
    minLength: 1,
    maxLength: 100,
  },
  description: {
    type: "string",
    required: true,
    minLength: 10,
    maxLength: 200,
  },
  author: {
    type: "string",
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  date: {
    type: "string",
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
  },
  related: {
    type: "array",
    required: false,
    default: [],
    items: {
      type: "string",
      minLength: 1,
      maxLength: 50,
    },
  },
  thumbnail: {
    type: "object",
    required: false,
    default: null,
    properties: {
      vertical: {
        type: "string",
        required: false,
      },
      horizontal: {
        type: "string",
        required: false,
      },
    },
  },
  banner: {
    type: "object",
    required: false,
    default: null,
    properties: {
      horizontal: {
        type: "string",
        required: false,
      },
    },
  },
  background: {
    type: "object",
    required: false,
    default: null,
    properties: {
      color: {
        type: "string",
        required: false,
      },
    },
  },
};

/**
 * Validate a blog post's frontmatter
 * @param frontmatter - The frontmatter object to validate
 * @returns Validation result with isValid boolean and errors array
 */
export function validateBlogPost(
  frontmatter: Record<string, unknown>,
): ValidationResult {
  const errors: string[] = [];

  // Check required fields first
  for (const [field, config] of Object.entries(BLOG_POST_SCHEMA)) {
    if (config.required && !frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // If we have missing required fields, don't continue with other validations
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  // Now validate field types and constraints
  for (const [field, config] of Object.entries(BLOG_POST_SCHEMA)) {
    if (frontmatter[field] !== undefined) {
      // Type validation
      if (config.type === "string" && typeof frontmatter[field] !== "string") {
        errors.push(`Field ${field} must be a string`);
      } else if (
        config.type === "array" &&
        !Array.isArray(frontmatter[field])
      ) {
        errors.push(`Field ${field} must be an array`);
      }

      // Length validation for strings
      if (config.type === "string" && typeof frontmatter[field] === "string") {
        const fieldValue = frontmatter[field] as string;
        if (config.minLength && fieldValue.length < config.minLength) {
          errors.push(
            `Field ${field} must be at least ${config.minLength} characters`,
          );
        }
        if (config.maxLength && fieldValue.length > config.maxLength) {
          errors.push(
            `Field ${field} must be no more than ${config.maxLength} characters`,
          );
        }
      }

      // Pattern validation
      if (
        config.pattern &&
        typeof frontmatter[field] === "string" &&
        !config.pattern.test(frontmatter[field] as string)
      ) {
        errors.push(`Field ${field} format is invalid`);
      }

      // Array item validation
      if (config.type === "array" && Array.isArray(frontmatter[field])) {
        const fieldArray = frontmatter[field] as unknown[];
        for (let i = 0; i < fieldArray.length; i++) {
          const item = fieldArray[i];
          if (config.items?.type === "string" && typeof item !== "string") {
            errors.push(`Item ${i} in ${field} must be a string`);
          }
          if (
            config.items &&
            typeof item === "string" &&
            config.items.minLength &&
            item.length < config.items.minLength
          ) {
            errors.push(
              `Item ${i} in ${field} must be at least ${config.items.minLength} characters`,
            );
          }
          if (
            config.items &&
            typeof item === "string" &&
            config.items.maxLength &&
            item.length > config.items.maxLength
          ) {
            errors.push(
              `Item ${i} in ${field} must be no more than ${config.items.maxLength} characters`,
            );
          }
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize and normalize frontmatter data
 * @param frontmatter - Raw frontmatter data
 * @returns Sanitized frontmatter
 */
export function sanitizeBlogPost(
  frontmatter: Record<string, unknown>,
): BlogPostFrontmatter {
  const sanitized: Record<string, unknown> = {};

  for (const [field, config] of Object.entries(BLOG_POST_SCHEMA)) {
    if (frontmatter[field] !== undefined) {
      // Special handling for thumbnail and background objects
      if (
        (field === "thumbnail" ||
          field === "background" ||
          field === "banner") &&
        typeof frontmatter[field] === "object"
      ) {
        sanitized[field] = frontmatter[field];
      } else {
        sanitized[field] = frontmatter[field];
      }
    } else if (config.default !== undefined) {
      sanitized[field] = config.default;
    }
  }

  return sanitized as BlogPostFrontmatter;
}
