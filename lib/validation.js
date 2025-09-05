/**
 * Content validation utilities for blog posts
 */

/**
 * Blog post frontmatter schema
 */
export const BLOG_POST_SCHEMA = {
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
};

/**
 * Validate a blog post's frontmatter
 * @param {Object} frontmatter - The frontmatter object to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export function validateBlogPost(frontmatter) {
  const errors = [];

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
        if (config.minLength && frontmatter[field].length < config.minLength) {
          errors.push(
            `Field ${field} must be at least ${config.minLength} characters`
          );
        }
        if (config.maxLength && frontmatter[field].length > config.maxLength) {
          errors.push(
            `Field ${field} must be no more than ${config.maxLength} characters`
          );
        }
      }

      // Pattern validation
      if (config.pattern && !config.pattern.test(frontmatter[field])) {
        errors.push(`Field ${field} format is invalid`);
      }

      // Array item validation
      if (config.type === "array" && Array.isArray(frontmatter[field])) {
        for (let i = 0; i < frontmatter[field].length; i++) {
          const item = frontmatter[field][i];
          if (config.items.type === "string" && typeof item !== "string") {
            errors.push(`Item ${i} in ${field} must be a string`);
          }
          if (config.items.minLength && item.length < config.items.minLength) {
            errors.push(
              `Item ${i} in ${field} must be at least ${config.items.minLength} characters`
            );
          }
          if (config.items.maxLength && item.length > config.items.maxLength) {
            errors.push(
              `Item ${i} in ${field} must be no more than ${config.items.maxLength} characters`
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
 * @param {Object} frontmatter - Raw frontmatter data
 * @returns {Object} Sanitized frontmatter
 */
export function sanitizeBlogPost(frontmatter) {
  const sanitized = {};

  for (const [field, config] of Object.entries(BLOG_POST_SCHEMA)) {
    if (frontmatter[field] !== undefined) {
      sanitized[field] = frontmatter[field];
    } else if (config.default !== undefined) {
      sanitized[field] = config.default;
    }
  }

  return sanitized;
}
