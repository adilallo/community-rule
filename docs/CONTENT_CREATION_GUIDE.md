# Content Creation Guide

A simple guide for creating blog content for Community Rule.

## How to Upload an Article

Here's how to contribute a new article:

1. **Fork the repository** (if you haven't already)
2. **Create a new branch** for your article: `git checkout -b add-my-article-title`
3. **Create your article file** in the `content/blog/` directory
4. **Test locally** (optional but recommended):
   - Run `npm install` to install dependencies
   - Run `npm run dev` to start the development server
   - Visit `http://localhost:3000/blog/your-article-slug` to preview
5. **Commit your changes**:
   ```bash
   git add content/blog/your-article.md
   git commit -m "Add article: Your Article Title"
   ```
6. **Push to your fork**:
   ```bash
   git push origin add-my-article-title
   ```
7. **Create a pull request** in Gitea with:
   - Clear title describing your article
   - Brief description of what the article covers
   - Any relevant context or notes for reviewers

## Quick Start

1. **Copy the template**: Use `content/blog/_template.md` as your starting point
2. **Create your file**: Use a descriptive filename with hyphens (e.g., `my-article-title.md`)
3. **Fill in the frontmatter**: Complete the required fields
4. **Write your content**: Follow the formatting guidelines
5. **Test locally**: Run `npm run dev` to preview your article
6. **Submit for review**: Get feedback before publishing

## Required Frontmatter

```yaml
---
title: "Your Article Title Here"
description: "A brief, compelling description of what this article covers"
author: "Author Name"
date: "2025-01-15"
related: ["slug-of-related-article-1", "slug-of-related-article-2"]
thumbnail:
  vertical: "your-article-slug-vertical.svg"
  horizontal: "your-article-slug-horizontal.svg"
---
```

### Field Guidelines

- **title**: Clear, descriptive title (50-60 characters for SEO)
- **description**: Compelling summary (150-160 characters for SEO)
- **author**: Author name or organization
- **date**: Publication date in YYYY-MM-DD format
- **related**: Array of article slugs (use filename without .md)
- **thumbnail**: Custom images for article thumbnails (optional)

### Related Articles

The slug is different from the title - it's lowercase with hyphens instead of spaces:

- Title: "Resolving Active Conflicts" → Slug: `resolving-active-conflicts`
- Title: "Operational Security for Mutual Aid" → Slug: `operational-security-mutual-aid`
- Title: "Making Decisions Without Hierarchy" → Slug: `making-decisions-without-hierarchy`

## Content Formatting

- Write in paragraph form, separated by blank lines
- Use **bold** for emphasis on important points
- Use _italics_ for subtle emphasis
- Use ## headings to break up sections within your content
- Keep paragraphs focused and readable
- Write in a conversational, accessible tone

## Thumbnail Images

Add custom thumbnail images to make your article stand out:

1. **Create your images**:

   - Vertical: 260px × 390px
   - Horizontal: 320px × 225.5px (minimum width)
   - Format: SVG preferred, PNG also works

2. **Save in content/blog/**:

   - `your-article-slug-vertical.svg`
   - `your-article-slug-horizontal.svg`

3. **Add to frontmatter**:
   ```yaml
   thumbnail:
     vertical: "your-article-slug-vertical.svg"
     horizontal: "your-article-slug-horizontal.svg"
   ```

If no thumbnails are provided, default images will be used.

## File Naming

Use descriptive, URL-friendly filenames:

- ✅ `getting-started-with-organizing.md`
- ✅ `digital-security-best-practices.md`
- ❌ `My Article Title.md`
- ❌ `article1.md`

## Getting Help

- Check the template file for examples
- Ask questions in community channels
- Contact the content team for support

---
