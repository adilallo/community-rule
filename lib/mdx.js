/**
 * MDX processing utilities for enhanced markdown content
 */

/**
 * Process markdown content with enhanced features
 * @param {string} markdown - Raw markdown content
 * @returns {Object} Processed content with metadata
 */
export function processMarkdown(markdown) {
  if (!markdown) {
    return {
      content: "",
      htmlContent: "",
      wordCount: 0,
      readingTime: 0,
      headings: [],
      links: [],
      images: [],
    };
  }

  // Extract headings for table of contents
  const headings = extractHeadings(markdown);

  // Extract links
  const links = extractLinks(markdown);

  // Extract images
  const images = extractImages(markdown);

  // Calculate word count and reading time
  const wordCount = calculateWordCount(markdown);
  const readingTime = calculateReadingTime(wordCount);

  return {
    content: markdown,
    htmlContent: markdownToHtml(markdown),
    wordCount,
    readingTime,
    headings,
    links,
    images,
  };
}

/**
 * Extract all headings from markdown content
 * @param {string} markdown - Raw markdown content
 * @returns {Array} Array of heading objects with level, text, and id
 */
function extractHeadings(markdown) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = generateHeadingId(text);

    headings.push({
      level,
      text,
      id,
      line: markdown.substring(0, match.index).split("\n").length,
    });
  }

  return headings;
}

/**
 * Extract all links from markdown content
 * @param {string} markdown - Raw markdown content
 * @returns {Array} Array of link objects
 */
function extractLinks(markdown) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
      index: match.index,
    });
  }

  return links;
}

/**
 * Extract all images from markdown content
 * @param {string} markdown - Raw markdown content
 * @returns {Array} Array of image objects
 */
function extractImages(markdown) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;

  while ((match = imageRegex.exec(markdown)) !== null) {
    images.push({
      alt: match[1],
      src: match[2],
      index: match.index,
    });
  }

  return images;
}

/**
 * Generate a unique ID for a heading
 * @param {string} text - Heading text
 * @returns {string} Unique ID
 */
function generateHeadingId(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Calculate word count from markdown content
 * @param {string} markdown - Raw markdown content
 * @returns {number} Word count
 */
function calculateWordCount(markdown) {
  // Remove markdown syntax and count words
  const cleanText = markdown
    .replace(/[#*`~\[\]()]/g, "") // Remove markdown characters
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  return cleanText.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Calculate estimated reading time
 * @param {number} wordCount - Number of words
 * @returns {number} Reading time in minutes
 */
function calculateReadingTime(wordCount) {
  const wordsPerMinute = 200; // Average reading speed
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Convert markdown to HTML with enhanced formatting
 * @param {string} markdown - Raw markdown content
 * @returns {string} HTML content
 */
function markdownToHtml(markdown) {
  if (!markdown) return "";

  return (
    markdown
      // Headers with IDs
      .replace(/^### (.*$)/gim, (match, text) => {
        const id = generateHeadingId(text);
        return `<h3 id="${id}">${text}</h3>`;
      })
      .replace(/^## (.*$)/gim, (match, text) => {
        const id = generateHeadingId(text);
        return `<h2 id="${id}">${text}</h2>`;
      })
      .replace(/^# (.*$)/gim, (match, text) => {
        const id = generateHeadingId(text);
        return `<h1 id="${id}">${text}</h1>`;
      })
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Code blocks
      .replace(
        /```(\w+)?\n([\s\S]*?)\n```/g,
        '<pre><code class="language-$1">$2</code></pre>'
      )
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Lists
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>")
      // Blockquotes
      .replace(/^> (.*$)/gim, "<blockquote><p>$1</p></blockquote>")
      // Horizontal rules
      .replace(/^---$/gm, "<hr>")
      .replace(/^\*\*\*$/gm, "<hr>")
      // Paragraphs
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[h|u|li|blockquote|hr|pre])(.*$)/gim, "<p>$1</p>")
      // Clean up empty paragraphs and fix list wrapping
      .replace(/<p><\/p>/g, "")
      .replace(/<p>(.*?)<\/p>/g, (match, content) => {
        return content.trim() ? match : "";
      })
      .replace(/<\/ul>\s*<ul>/g, "") // Merge consecutive ul elements
      .replace(/<ul>\s*<\/ul>/g, "")
  ); // Remove empty ul elements
}

/**
 * Generate a table of contents from headings
 * @param {Array} headings - Array of heading objects
 * @returns {string} HTML table of contents
 */
export function generateTableOfContents(headings) {
  if (!headings || headings.length === 0) return "";

  let toc = '<nav class="table-of-contents"><h4>Table of Contents</h4><ul>';

  headings.forEach((heading) => {
    const indent = (heading.level - 1) * 20;
    toc += `<li style="margin-left: ${indent}px"><a href="#${heading.id}">${heading.text}</a></li>`;
  });

  toc += "</ul></nav>";
  return toc;
}

/**
 * Process frontmatter with enhanced validation
 * @param {Object} frontmatter - Raw frontmatter data
 * @returns {Object} Processed and validated frontmatter
 */
export function processFrontmatter(frontmatter) {
  // Add computed fields
  const processed = {
    ...frontmatter,
    publishedDate: new Date(frontmatter.date),
    year: new Date(frontmatter.date).getFullYear(),
    month: new Date(frontmatter.date).getMonth() + 1,
    day: new Date(frontmatter.date).getDate(),
    isRecent: isRecentPost(frontmatter.date),
    readingTime: frontmatter.content
      ? calculateReadingTime(calculateWordCount(frontmatter.content))
      : 0,
  };

  return processed;
}

/**
 * Check if a post is recent (within last 30 days)
 * @param {string} date - Post date string
 * @returns {boolean} True if post is recent
 */
function isRecentPost(date) {
  const postDate = new Date(date);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return postDate > thirtyDaysAgo;
}
