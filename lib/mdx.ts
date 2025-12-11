/**
 * MDX processing utilities for enhanced markdown content
 */

export interface Heading {
  level: number;
  text: string;
  id: string;
  line: number;
}

export interface Link {
  text: string;
  url: string;
  index: number;
}

export interface Image {
  alt: string;
  src: string;
  index: number;
}

export interface ProcessedMarkdown {
  content: string;
  htmlContent: string;
  headings: Heading[];
  links: Link[];
  images: Image[];
}

export interface ProcessedFrontmatter {
  publishedDate: Date;
  year: number;
  month: number;
  day: number;
  isRecent: boolean;
  [key: string]: unknown;
}

/**
 * Format date consistently across the markdown pipeline
 * Uses "Month Year" format (e.g., "April 2025")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

/**
 * Process markdown content and extract metadata
 * @param markdown - Raw markdown content
 * @returns Processed content with metadata
 */
export function processMarkdown(markdown: string): ProcessedMarkdown {
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
 * @param markdown - Raw markdown content
 * @returns Array of heading objects with level, text, and id
 */
function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;

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
 * @param markdown - Raw markdown content
 * @returns Array of link objects
 */
function extractLinks(markdown: string): Link[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: Link[] = [];
  let match: RegExpExecArray | null;

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
 * @param markdown - Raw markdown content
 * @returns Array of image objects
 */
function extractImages(markdown: string): Image[] {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: Image[] = [];
  let match: RegExpExecArray | null;

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
 * @param text - Heading text
 * @returns Unique ID
 */
function generateHeadingId(text: string): string {
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
 * @param markdown - Raw markdown content
 * @returns HTML content
 */
function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  // Normalize line endings
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
        (_match, t) => `<h6 id="${generateHeadingId(t)}">${t}</h6>`,
      )
      .replace(
        /^##### (.*$)/gim,
        (_match, t) => `<h5 id="${generateHeadingId(t)}">${t}</h5>`,
      )
      .replace(
        /^#### (.*$)/gim,
        (_match, t) => `<h4 id="${generateHeadingId(t)}">${t}</h4>`,
      )
      .replace(
        /^### (.*$)/gim,
        (_match, t) => `<h3 id="${generateHeadingId(t)}">${t}</h3>`,
      )
      .replace(
        /^## (.*$)/gim,
        (_match, t) => `<h2 id="${generateHeadingId(t)}">${t}</h2>`,
      )
      .replace(
        /^# (.*$)/gim,
        (_match, t) => `<h1 id="${generateHeadingId(t)}">${t}</h1>`,
      )

      // Code fences (block) and inline code
      .replace(
        /```(\w+)?\n([\s\S]*?)\n```/g,
        (_match, lang = "", code) =>
          `<pre><code class="language-${lang}">${code}</code></pre>`,
      )
      .replace(/`([^`]+)`/g, "<code>$1</code>")

      // Bold and italic (strong before em to avoid overlap issues)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")

      // Links and images
      .replace(
        /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
        (_match, alt, src, title = "") =>
          `<img alt="${alt}" src="${src}"${title ? ` title="${title}"` : ""}>`,
      )
      .replace(
        /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
        (_match, text, href, title = "") =>
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
        (_match, n) =>
          `<div class="md-gap" style="--gap:${Number(
            n,
          )}" aria-hidden="true"></div>`,
      )
  );
}

/**
 * Generate a table of contents from headings
 * @param headings - Array of heading objects
 * @returns HTML table of contents
 */
export function generateTableOfContents(headings: Heading[]): string {
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
 * @param frontmatter - Raw frontmatter data
 * @returns Processed and validated frontmatter
 */
export function processFrontmatter(
  frontmatter: Record<string, unknown>,
): ProcessedFrontmatter {
  // Add computed fields
  const date = frontmatter.date as string;
  const processed: ProcessedFrontmatter = {
    ...frontmatter,
    publishedDate: new Date(date),
    year: new Date(date).getFullYear(),
    month: new Date(date).getMonth() + 1,
    day: new Date(date).getDate(),
    isRecent: isRecentPost(date),
  };

  return processed;
}

/**
 * Check if a post is recent (within last 30 days)
 * @param date - Post date string
 * @returns True if post is recent
 */
function isRecentPost(date: string): boolean {
  const postDate = new Date(date);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return postDate > thirtyDaysAgo;
}
