#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

/**
 * This script creates a new blog post with the specified title.
 * It generates a markdown file with frontmatter in the public/posts directory.
 * 
 * Usage: node scripts/create-blog-post.js "My New Blog Post" "tag1,tag2,tag3"
 */

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the root directory of the project
const rootDir = path.resolve(__dirname, '..');

// Directory where blog posts are stored
const postsDir = path.join(rootDir, 'public', 'posts');
const IMAGES_DIR = path.join(rootDir, 'public', 'images');

// Ensure the posts directory exists
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
  console.log(`Created directory: ${postsDir}`);
}

// Function to create a slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .trim();
}

// Function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Function to create a new blog post
function createBlogPost(title, tags) {
  if (!title) {
    console.error('Error: Title is required');
    process.exit(1);
  }

  const slug = createSlug(title);
  const date = getTodayDate();
  const filePath = path.join(postsDir, `${slug}.md`);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.error(`Error: A blog post with the slug "${slug}" already exists.`);
    process.exit(1);
  }

  // Parse tags
  const tagArray = tags
    ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
    : ['uncategorized'];

  // Create frontmatter
  const frontmatter = `---
title: "${title}"
date: "${date}"
excerpt: "Write a brief excerpt for your blog post here."
coverImage: "/images/${slug}.jpg"
tags: [${tagArray.map(tag => `"${tag}"`).join(', ')}]
---

# ${title}

Write your blog post content here. This template supports Markdown and LaTeX.

## Markdown Features

You can use **bold**, *italic*, and ~~strikethrough~~ text.

### Code Blocks

\`\`\`javascript
// Example code block
function hello() {
  console.log('Hello, world!');
}
\`\`\`

## LaTeX Support

You can include inline math like $E = mc^2$ or display math:

$$
\\frac{d}{dx}\\left( \\int_{a}^{x} f(u)\\,du\\right) = f(x)
$$

## Images

![Alt text](/images/example.jpg)

## Links

[Link text](https://example.com)
`;

  // Write the file
  fs.writeFileSync(filePath, frontmatter);
  console.log(`Created blog post: ${filePath}`);
  console.log(`Slug: ${slug}`);
  console.log(`Title: ${title}`);
  console.log(`Date: ${date}`);
  console.log(`Tags: ${tagArray.join(', ') || 'none'}`);
  console.log('\nNext steps:');
  console.log('1. Edit the blog post to add your content');
  console.log('2. Update the excerpt in the frontmatter');
  console.log(`3. Add a cover image to ${path.join(rootDir, 'public', 'images')} and update the coverImage path in the frontmatter`);
  console.log('4. Run "npm run blog:index" to update the posts index');

  // Generate posts index
  console.log('\nGenerating posts index...');
  try {
    execSync(`node ${path.join(__dirname, 'generate-posts-index.js')}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error generating posts index:', error.message);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const title = args[0];
const tags = args[1] || '';

// Create the blog post
createBlogPost(title, tags); 