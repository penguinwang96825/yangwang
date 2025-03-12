#!/usr/bin/env node

/**
 * This script generates an index.json file for all blog posts in the public/posts directory.
 * It reads the frontmatter from each markdown file and creates a JSON file with metadata.
 * 
 * Usage: node scripts/generate-posts-index.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the root directory of the project
const rootDir = path.resolve(__dirname, '..');

// Directories and files
const postsDir = path.join(rootDir, 'public', 'posts');
const outputFile = path.join(rootDir, 'public', 'posts', 'index.json');

// Ensure the posts directory exists
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
  console.log(`Created directory: ${postsDir}`);
}

// Function to extract frontmatter from markdown file
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return null;
  
  const frontmatter = match[1];
  const metadata = {
    title: frontmatter.match(/title: "(.*?)"/)?.[1] || '',
    date: frontmatter.match(/date: "(.*?)"/)?.[1] || '',
    excerpt: frontmatter.match(/excerpt: "(.*?)"/)?.[1] || '',
    coverImage: frontmatter.match(/coverImage: "(.*?)"/)?.[1] || '',
    tags: [],
  };
  
  // Extract tags
  const tagsMatch = frontmatter.match(/tags: \[(.*?)\]/);
  if (tagsMatch) {
    metadata.tags = tagsMatch[1]
      .split(',')
      .map(tag => tag.trim().replace(/"/g, ''))
      .filter(Boolean);
  }
  
  return metadata;
}

// Generate the index file
function generateIndex() {
  try {
    // Get all markdown files
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      console.log('No markdown files found in the posts directory.');
      return;
    }
    
    const posts = [];
    
    // Process each file
    for (const file of files) {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const metadata = extractFrontmatter(content);
      
      if (metadata) {
        const slug = path.basename(file, '.md');
        posts.push({
          slug,
          title: metadata.title,
          date: metadata.date,
          excerpt: metadata.excerpt,
          coverImage: metadata.coverImage,
          tags: metadata.tags,
        });
      }
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Write the index file
    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
    
    console.log(`Generated index file with ${posts.length} posts: ${outputFile}`);
  } catch (error) {
    console.error('Error generating index:', error);
    process.exit(1);
  }
}

// Run the generator
generateIndex(); 