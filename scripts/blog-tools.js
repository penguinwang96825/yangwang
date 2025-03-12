#!/usr/bin/env node

import { execSync } from 'child_process';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.log('\n===== Blog Management Tools =====');
  console.log('1. Create a new blog post');
  console.log('2. Generate posts index');
  console.log('3. Run both (create post and update index)');
  console.log('4. Exit');
  console.log('================================\n');
}

function createBlogPost() {
  return new Promise((resolve) => {
    rl.question('Enter blog post title: ', (title) => {
      if (!title.trim()) {
        console.log('Title cannot be empty. Please try again.');
        return createBlogPost().then(resolve);
      }
      
      rl.question('Enter tags (comma separated): ', (tags) => {
        try {
          console.log('\nCreating new blog post...');
          execSync(`node ${path.join(__dirname, 'create-blog-post.js')} "${title}" "${tags}"`, { stdio: 'inherit' });
          console.log('Blog post created successfully!');
          resolve(true);
        } catch (error) {
          console.error('Error creating blog post:', error.message);
          resolve(false);
        }
      });
    });
  });
}

function generatePostsIndex() {
  return new Promise((resolve) => {
    try {
      console.log('\nGenerating posts index...');
      execSync(`node ${path.join(__dirname, 'generate-posts-index.js')}`, { stdio: 'inherit' });
      console.log('Posts index generated successfully!');
      resolve(true);
    } catch (error) {
      console.error('Error generating posts index:', error.message);
      resolve(false);
    }
  });
}

async function handleMenuChoice(choice) {
  switch (choice) {
    case '1':
      await createBlogPost();
      break;
    case '2':
      await generatePostsIndex();
      break;
    case '3':
      const postCreated = await createBlogPost();
      if (postCreated) {
        await generatePostsIndex();
      }
      break;
    case '4':
      console.log('Exiting...');
      rl.close();
      return;
    default:
      console.log('Invalid choice. Please try again.');
  }
  
  // Return to menu after operation completes
  displayMenu();
  promptUser();
}

function promptUser() {
  rl.question('Enter your choice (1-4): ', (choice) => {
    handleMenuChoice(choice);
  });
}

// Start the CLI
console.log('Welcome to the Blog Management Tools!');
displayMenu();
promptUser();

// Handle exit
rl.on('close', () => {
  console.log('Thank you for using Blog Management Tools!');
  process.exit(0);
}); 