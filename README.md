# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Personal Website

A modern personal website built with React, TypeScript, Tailwind CSS, and Vite.

## Features

- Responsive design
- Dark mode support
- Blog with Markdown and LaTeX support
- Interactive components with Framer Motion animations
- SEO optimized

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/personal-website.git
cd personal-website
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Blog Management

This project includes tools to help you manage your blog posts.

### Blog Management CLI

Run the interactive blog management tool:

```bash
npm run blog
```

This will open an interactive CLI with the following options:
- Create a new blog post
- Generate posts index
- Run both (create post and update index)
- Exit

### Creating a New Blog Post

You can create a new blog post using the CLI or directly with:

```bash
npm run blog:new "Your Blog Post Title" "tag1, tag2, tag3"
```

This will:
1. Create a new markdown file in the `public/posts` directory
2. Generate a slug from the title
3. Add frontmatter with title, date, tags, etc.
4. Provide a template with examples of Markdown and LaTeX syntax
5. Automatically update the posts index

### Updating the Posts Index

The posts index is a JSON file that contains metadata for all blog posts. It's used by the blog component to display the list of posts.

To update the index manually:

```bash
npm run blog:index
```

This will scan all markdown files in the `public/posts` directory and generate an `index.json` file with metadata for each post.

### Personal Information Management

You can update your personal information using the CLI:

```bash
npm run personal-info
```

This will open an interactive CLI that allows you to update:
- Basic personal information (name, title, etc.)
- Welcome message and about section
- Display settings (show/hide sections)
- Education entries
- Work experience entries
- Publications
- Skills

## Building for Production

To build the website for production:

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## Deploying to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup

1. Create a GitHub repository for your website
2. Push your code to the repository:

```bash
git remote add origin https://github.com/yourusername/yourrepo.git
git branch -M main
git push -u origin main
```

3. In your GitHub repository settings, go to Pages and set:
   - Source: GitHub Actions

4. The GitHub Actions workflow in `.github/workflows/deploy.yml` will automatically build and deploy your site when you push changes to the main branch.

5. Your site will be available at `https://yourusername.github.io/yourrepo/`

### Manual Deployment

If you prefer to deploy manually:

1. Build the site:
```bash
npm run build
```

2. Commit the `dist` directory to the `gh-pages` branch:
```bash
npm run deploy
```

Note: You'll need to add a deploy script to your package.json:
```json
"scripts": {
  "deploy": "gh-pages -d dist"
}
```

And install the gh-pages package:
```bash
npm install --save-dev gh-pages
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
