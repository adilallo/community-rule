/**
 * MDX processing utilities for enhanced markdown content
 */

/**
 * Format date consistently across the markdown pipeline
 * Uses "Month Year" format (e.g., "April 2025")
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

/**
 * Process markdown content and extract metadata
 * @param {string} markdown - Raw markdown content
 * @returns {object} Processed content with metadata
 */
export function processMarkdown(markdown) {
  if (!markdown) {
    return {
      content: "",
      htmlContent: "",
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

  // Convert markdown to HTML
  const htmlContent = markdownToHtml(markdown);

  return {
    content: markdown,
    htmlContent,
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
 * Convert markdown to HTML with enhanced formatting
 * - Preserves extra blank lines between paragraphs as visible gaps
 *   (each extra blank line becomes <p class="md-gap">&nbsp;</p>)
 * @param {string} markdown - Raw markdown content
 * @returns {string} HTML content
 */
function markdownToHtml(markdown) {
  if (!markdown) return "";

  // Normalize line endings
  const GAP_TOKEN = "<GAP/>";
  const src = String(markdown).replace(/\r\n?/g, "\n");

  // For 3+ consecutive newlines, keep 2 for the paragraph break and
  // emit a counted gap token for additional blank lines to preserve spacing.
  const withGaps = src.replace(/\n{3,}/g, (m) => {
    const extra = m.length - 2;
    return `\n\n<GAP:${extra}/>`;
  });

  return (
    withGaps
      // Headers with IDs
      .replace(
        /^###### (.*$)/gim,
        (m, t) => `<h6 id="${generateHeadingId(t)}">${t}</h6>`,
      )
      .replace(
        /^##### (.*$)/gim,
        (m, t) => `<h5 id="${generateHeadingId(t)}">${t}</h5>`,
      )
      .replace(
        /^#### (.*$)/gim,
        (m, t) => `<h4 id="${generateHeadingId(t)}">${t}</h4>`,
      )
      .replace(
        /^### (.*$)/gim,
        (m, t) => `<h3 id="${generateHeadingId(t)}">${t}</h3>`,
      )
      .replace(
        /^## (.*$)/gim,
        (m, t) => `<h2 id="${generateHeadingId(t)}">${t}</h2>`,
      )
      .replace(
        /^# (.*$)/gim,
        (m, t) => `<h1 id="${generateHeadingId(t)}">${t}</h1>`,
      )

      // Code fences (block) and inline code
      .replace(
        /```(\w+)?\n([\s\S]*?)\n```/g,
        (m, lang = "", code) =>
          `<pre><code class="language-${lang}">${code}</code></pre>`,
      )
      .replace(/`([^`]+)`/g, "<code>$1</code>")

      // Bold and italic (strong before em to avoid overlap issues)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")

      // Links and images
      .replace(
        /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
        (m, alt, src, title = "") =>
          `<img alt="${alt}" src="${src}"${title ? ` title="${title}"` : ""}>`,
      )
      .replace(
        /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
        (m, text, href, title = "") =>
          `<a href="${href}"${title ? ` title="${title}"` : ""}>${text}</a>`,
      )

      // Blockquotes
      .replace(/^(>\s?.+)(\n(>\s?.+))*$/gim, (m) => {
        const inner = m.replace(/^>\s?/gm, "");
        return `<blockquote><p>${inner.replace(
          /\n{2,}/g,
          "</p><p>",
        )}</p></blockquote>`;
      })

      // Lists (ul/ol)
      .replace(/^(\s*[-*]\s.+(?:\n\s*[-*]\s.+)*)/gim, (m) => {
        const items = m
          .trim()
          .split(/\n/)
          .map((l) => l.replace(/^\s*[-*]\s+/, ""))
          .map((t) => `<li>${t}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      })
      .replace(/^(\s*\d+\.\s.+(?:\n\s*\d+\.\s.+)*)/gim, (m) => {
        const items = m
          .trim()
          .split(/\n/)
          .map((l) => l.replace(/^\s*\d+\.\s+/, ""))
          .map((t) => `<li>${t}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      })

      // Horizontal rules
      .replace(/^\s*(?:-{3,}|\*{3,})\s*$/gm, "<hr>")

      // Paragraphs:
      // 1) Convert double newlines to paragraph boundaries
      .replace(/\n\n/g, "</p><p>")
      // 2) Convert single line breaks to <br> tags within paragraphs
      .replace(/(?<!\n)\n(?!\n)/g, "<br>")
      // 3) Wrap remaining bare lines that are not already block-level elements.
      //    (Also skip our GAP_TOKEN so we can turn it into gap paragraphs later.)
      .replace(
        /^(?!\s*<(h[1-6]|ul|ol|li|blockquote|hr|pre|code|table|img)\b)(?!\s*<\/)(?!\s*<GAP\/>)(.+)$/gim,
        "<p>$2</p>",
      )

      // Clean up truly empty paragraphs but keep &nbsp; gap paragraphs
      .replace(/<p>\s*<\/p>/g, "")

      // Turn counted GAP tokens into explicit, styleable gap elements
      .replace(
        /<GAP:(\d+)\/>/g,
        (m, n) =>
          `<div class="md-gap" style="--gap:${Number(
            n,
          )}" aria-hidden="true"></div>`,
      )
  );
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
