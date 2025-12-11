/**
 * Content caching utilities for improved performance
 */

// In-memory cache for blog posts
const blogPostCache = new Map<string, CacheEntry<unknown>>();
const blogListCache = new Map<string, CacheEntry<unknown[]>>();
const tagCache = new Map<string, CacheEntry<string[]>>();
const authorCache = new Map<string, CacheEntry<string[]>>();

// Cache configuration
const isDevelopment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;
const CACHE_TTL = isDevelopment ? 0 : 5 * 60 * 1000; // 0 in dev, 5 minutes in production
const MAX_CACHE_SIZE = 100; // Maximum number of cached items

/**
 * Cache entry with timestamp
 */
class CacheEntry<T> {
  data: T;
  timestamp: number;

  constructor(data: T) {
    this.data = data;
    this.timestamp = Date.now();
  }

  isExpired(): boolean {
    // In development, always consider cache expired (no caching)
    if (isDevelopment) return true;
    return Date.now() - this.timestamp > CACHE_TTL;
  }
}

/**
 * Get cached blog post data
 * @param key - Cache key
 * @returns Cached data or null if not found/expired
 */
function getCached<T>(key: string): T | null {
  const entry = blogPostCache.get(key) as CacheEntry<T> | undefined;
  if (!entry || entry.isExpired()) {
    blogPostCache.delete(key);
    return null;
  }
  return entry.data;
}

/**
 * Set cached blog post data
 * @param key - Cache key
 * @param data - Data to cache
 */
function setCached<T>(key: string, data: T): void {
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
function clearExpiredCache(): void {
  for (const [key, entry] of blogPostCache.entries()) {
    if (entry.isExpired()) {
      blogPostCache.delete(key);
    }
  }
}

/**
 * Clear all caches
 */
export function clearAllCaches(): void {
  blogPostCache.clear();
  blogListCache.clear();
  tagCache.clear();
  authorCache.clear();
}

/**
 * Get cached blog post by slug
 * @param slug - Blog post slug
 * @returns Cached blog post or null
 */
export function getCachedBlogPost<T>(slug: string): T | null {
  return getCached<T>(`post:${slug}`);
}

/**
 * Cache blog post data
 * @param slug - Blog post slug
 * @param postData - Blog post data
 */
export function cacheBlogPost<T>(slug: string, postData: T): void {
  setCached(`post:${slug}`, postData);
}

/**
 * Get cached blog post list
 * @param key - Cache key for list (e.g., 'all', 'recent', 'tag:governance')
 * @returns Cached list or null
 */
export function getCachedBlogList<T>(key: string): T[] | null {
  const entry = blogListCache.get(key);
  if (!entry || entry.isExpired()) {
    blogListCache.delete(key);
    return null;
  }
  return entry.data as T[];
}

/**
 * Cache blog post list
 * @param key - Cache key
 * @param listData - List data to cache
 */
export function cacheBlogList<T>(key: string, listData: T[]): void {
  blogListCache.set(key, new CacheEntry(listData));
}

/**
 * Get cached tags
 * @returns Cached tags or null
 */
export function getCachedTags(): string[] | null {
  const entry = tagCache.get("all");
  if (!entry || entry.isExpired()) {
    tagCache.delete("all");
    return null;
  }
  return entry.data;
}

/**
 * Cache tags
 * @param tags - Tags to cache
 */
export function cacheTags(tags: string[]): void {
  tagCache.set("all", new CacheEntry(tags));
}

/**
 * Get cached authors
 * @returns Cached authors or null
 */
export function getCachedAuthors(): string[] | null {
  const entry = authorCache.get("all");
  if (!entry || entry.isExpired()) {
    authorCache.delete("all");
    return null;
  }
  return entry.data;
}

/**
 * Cache authors
 * @param authors - Authors to cache
 */
export function cacheAuthors(authors: string[]): void {
  authorCache.set("all", new CacheEntry(authors));
}

/**
 * Invalidate cache for a specific blog post
 * @param slug - Blog post slug
 */
export function invalidateBlogPostCache(slug: string): void {
  blogPostCache.delete(`post:${slug}`);
  // Also invalidate list caches since they might contain this post
  blogListCache.clear();
}

/**
 * Invalidate all caches
 */
export function invalidateAllCaches(): void {
  clearAllCaches();
}

export interface CacheStats {
  blogPostCacheSize: number;
  blogListCacheSize: number;
  tagCacheSize: number;
  authorCacheSize: number;
  totalCacheSize: number;
  maxCacheSize: number;
  cacheTTL: number;
}

/**
 * Get cache statistics
 * @returns Cache statistics
 */
export function getCacheStats(): CacheStats {
  clearExpiredCache();

  return {
    blogPostCacheSize: blogPostCache.size,
    blogListCacheSize: blogListCache.size,
    tagCacheSize: tagCache.size,
    authorCacheSize: authorCache.size,
    totalCacheSize:
      blogPostCache.size +
      blogListCache.size +
      tagCache.size +
      authorCache.size,
    maxCacheSize: MAX_CACHE_SIZE,
    cacheTTL: CACHE_TTL,
  };
}

/**
 * Warm up cache with frequently accessed data
 * @param getAllPosts - Function to get all blog posts
 * @param getAllTags - Function to get all tags
 */
export async function warmCache<T>(
  getAllPosts: () => T[],
  getAllTags: () => string[],
): Promise<void> {
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
      const postWithSlug = post as { slug: string };
      cacheBlogPost(postWithSlug.slug, post);
    });

    console.log("Cache warmed up successfully");
  } catch (error) {
    console.error("Error warming up cache:", error);
  }
}

/**
 * Check if cache is healthy
 * @returns True if cache is healthy
 */
export function isCacheHealthy(): boolean {
  try {
    clearExpiredCache();
    return blogPostCache.size < MAX_CACHE_SIZE;
  } catch (error) {
    console.error("Cache health check failed:", error);
    return false;
  }
}
