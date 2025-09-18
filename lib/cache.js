/**
 * Content caching utilities for improved performance
 */

// In-memory cache for blog posts
const blogPostCache = new Map();
const blogListCache = new Map();
const tagCache = new Map();
const authorCache = new Map();

// Cache configuration
const isDevelopment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
const CACHE_TTL = isDevelopment ? 0 : 5 * 60 * 1000; // 0 in dev, 5 minutes in production
const MAX_CACHE_SIZE = 100; // Maximum number of cached items

/**
 * Cache entry with timestamp
 */
class CacheEntry {
  constructor(data) {
    this.data = data;
    this.timestamp = Date.now();
  }

  isExpired() {
    // In development, always consider cache expired (no caching)
    if (isDevelopment) return true;
    return Date.now() - this.timestamp > CACHE_TTL;
  }
}

/**
 * Get cached blog post data
 * @param {string} key - Cache key
 * @returns {Object|null} Cached data or null if not found/expired
 */
function getCached(key) {
  const entry = blogPostCache.get(key);
  if (!entry || entry.isExpired()) {
    blogPostCache.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Set cached blog post data
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 */
function setCached(key, data) {
  // Implement LRU eviction if cache is full
  if (blogPostCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = blogPostCache.keys().next().value;
    blogPostCache.delete(oldestKey);
  }

  blogPostCache.set(key, new CacheEntry(data));
}

/**
 * Clear expired cache entries
 */
function clearExpiredCache() {
  for (const [key, entry] of blogPostCache.entries()) {
    if (entry.isExpired()) {
      blogPostCache.delete(key);
    }
  }
}

/**
 * Clear all caches
 */
export function clearAllCaches() {
  blogPostCache.clear();
  blogListCache.clear();
  tagCache.clear();
  authorCache.clear();
}

/**
 * Get cached blog post by slug
 * @param {string} slug - Blog post slug
 * @returns {Object|null} Cached blog post or null
 */
export function getCachedBlogPost(slug) {
  return getCached(`post:${slug}`);
}

/**
 * Cache blog post data
 * @param {string} slug - Blog post slug
 * @param {Object} postData - Blog post data
 */
export function cacheBlogPost(slug, postData) {
  setCached(`post:${slug}`, postData);
}

/**
 * Get cached blog post list
 * @param {string} key - Cache key for list (e.g., 'all', 'recent', 'tag:governance')
 * @returns {Array|null} Cached list or null
 */
export function getCachedBlogList(key) {
  const entry = blogListCache.get(key);
  if (!entry || entry.isExpired()) {
    blogListCache.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Cache blog post list
 * @param {string} key - Cache key
 * @param {Array} listData - List data to cache
 */
export function cacheBlogList(key, listData) {
  blogListCache.set(key, new CacheEntry(listData));
}

/**
 * Get cached tags
 * @returns {Array|null} Cached tags or null
 */
export function getCachedTags() {
  const entry = tagCache.get("all");
  if (!entry || entry.isExpired()) {
    tagCache.delete("all");
    return null;
  }
  return entry.data;
}

/**
 * Cache tags
 * @param {Array} tags - Tags to cache
 */
export function cacheTags(tags) {
  tagCache.set("all", new CacheEntry(tags));
}

/**
 * Get cached authors
 * @returns {Array|null} Cached authors or null
 */
export function getCachedAuthors() {
  const entry = authorCache.get("all");
  if (!entry || entry.isExpired()) {
    authorCache.delete("all");
    return null;
  }
  return entry.data;
}

/**
 * Cache authors
 * @param {Array} authors - Authors to cache
 */
export function cacheAuthors(authors) {
  authorCache.set("all", new CacheEntry(authors));
}

/**
 * Invalidate cache for a specific blog post
 * @param {string} slug - Blog post slug
 */
export function invalidateBlogPostCache(slug) {
  blogPostCache.delete(`post:${slug}`);
  // Also invalidate list caches since they might contain this post
  blogListCache.clear();
}

/**
 * Invalidate all caches
 */
export function invalidateAllCaches() {
  clearAllCaches();
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
  clearExpiredCache();

  return {
    blogPostCacheSize: blogPostCache.size,
    blogListCacheSize: blogListCache.size,
    tagCacheSize: tagCache.size,
    authorCacheSize: authorCache.size,
    totalCacheSize:
      blogPostCache.size + blogListCache.size + tagCache.size + authorCacheSize,
    maxCacheSize: MAX_CACHE_SIZE,
    cacheTTL: CACHE_TTL,
  };
}

/**
 * Warm up cache with frequently accessed data
 * @param {Function} getAllPosts - Function to get all blog posts
 * @param {Function} getAllTags - Function to get all tags
 */
export async function warmCache(getAllPosts, getAllTags) {
  try {
    // Cache all blog posts
    const allPosts = getAllPosts();
    cacheBlogList("all", allPosts);

    // Cache recent posts
    const recentPosts = allPosts.slice(0, 5);
    cacheBlogList("recent", recentPosts);

    // Cache tags
    const tags = getAllTags();
    cacheTags(tags);

    // Cache individual posts (first 10)
    allPosts.slice(0, 10).forEach((post) => {
      cacheBlogPost(post.slug, post);
    });

    console.log("Cache warmed up successfully");
  } catch (error) {
    console.error("Error warming up cache:", error);
  }
}

/**
 * Check if cache is healthy
 * @returns {boolean} True if cache is healthy
 */
export function isCacheHealthy() {
  try {
    clearExpiredCache();
    return blogPostCache.size < MAX_CACHE_SIZE;
  } catch (error) {
    console.error("Cache health check failed:", error);
    return false;
  }
}
