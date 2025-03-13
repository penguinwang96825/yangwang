import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import '../styles/blog.css';
import { useBlogPost } from '../utils/posts';
import { useState } from 'react';

// Helper function to get asset URL with base path
const getAssetUrl = (path: string) => {
  // If the path already starts with http or https, it's already an absolute URL
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  // Otherwise, prepend the base URL
  return `${import.meta.env.BASE_URL}${path && path.startsWith('/') ? path.substring(1) : path}`;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug || '');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error || `The blog post "${slug}" could not be found.`}
        </p>
        <Link
          to="/blog"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-black"
    >
      <article className="container mx-auto px-4 py-8">
        {/* Cover Image */}
        <div className="w-full h-64 md:h-96 mb-8 bg-gray-200 dark:bg-black/80 rounded-lg overflow-hidden">
          <img
            src={getAssetUrl(post.coverImage)}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Failed to load image: ${post.coverImage}`);
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/1200x600?text=Blog+Post';
              target.onerror = null; // Prevent infinite error loop
            }}
          />
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-grayNurse mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-grayNurse/80 mb-4">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-black/80 text-gray-700 dark:text-grayNurse rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Post Content */}
        <div className="blog-content dark:text-grayNurse">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ node, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !className?.includes('language-') ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <div className="code-block">
                    <div className="code-block-header">
                      {match && (
                        <div className="code-language">
                          {match[1]}
                        </div>
                      )}
                      <button
                        className="copy-button"
                        onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                        aria-label="Copy code to clipboard"
                        title="Copy code to clipboard"
                      >
                        {copiedCode === String(children).replace(/\n$/, '') ? (
                          <span className="copy-success">Copied!</span>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match ? match[1] : ''}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-black/40">
          <Link
            to="/blog"
            className="inline-flex items-center text-oxfordBlue dark:text-oxfordBlue hover:text-oxfordBlue/80 dark:hover:text-oxfordBlue/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </motion.div>
  );
};

export default BlogPost; 