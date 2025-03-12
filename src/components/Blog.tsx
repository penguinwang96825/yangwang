import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogPosts } from '../utils/posts';

// Define the blog post interface
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
}

// This maps post slugs to their corresponding image paths in the public directory
const imageMap: Record<string, string> = {
  'hello-world': '/images/wallhaven-0jk3ey.jpg',
  'query-key-value-attention': '/images/wallhaven-0jk3ey.jpg',
  'custom-wallpaper': '/images/wallhaven-0jk3ey.jpg'
};

const Blog = () => {
  const { posts, loading, error } = useBlogPosts();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Extract unique tags from posts
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  );
  
  const filteredPosts = selectedTag === 'all' || selectedTag === null
    ? posts
    : posts.filter(post => post.tags.includes(selectedTag || ''));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">Blog</h1>
        
        {/* Tags filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTag === null
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative bg-gray-200 dark:bg-gray-800">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    console.error(`Failed to load image: ${post.coverImage}`);
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x400?text=Blog+Post';
                    target.onerror = null; // Prevent infinite error loop
                  }}
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No posts found for the selected tag.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Blog; 