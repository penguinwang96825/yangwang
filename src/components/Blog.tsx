import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImagePath } from '../utils/imageUtils';
import { useBlogPosts } from '../utils/posts';

const Blog = () => {
  const { posts, loading, error } = useBlogPosts();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get unique tags from all posts
  const tags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  const handleTagClick = (tag: string) => {
    setSelectedTag(prevTag => prevTag === tag ? null : tag);
  };

  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Error Loading Posts
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  // Log empty posts array for debugging
  if (posts.length === 0) {
    console.warn('No posts available to display');
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          No blog posts found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We're having trouble loading the blog posts. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">Blog</h1>
        
        {/* Tags filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTag === null 
                ? 'bg-oxfordBlue text-white' 
                : 'bg-gray-200 dark:bg-black/80 text-gray-800 dark:text-grayNurse hover:bg-gray-300 dark:hover:bg-black/60'
            }`}
          >
            All Posts
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag 
                  ? 'bg-oxfordBlue text-white' 
                  : 'bg-gray-200 dark:bg-black/80 text-gray-800 dark:text-grayNurse hover:bg-gray-300 dark:hover:bg-black/60'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <Link 
                to={`/blog/${post.slug}`} 
                key={post.slug}
              >
                <motion.article 
                  className="bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col"
                  whileHover={{ y: -5 }}
                >
                  {/* Cover Image */}
                  <div className="h-44 overflow-hidden rounded-t-lg bg-gray-200 dark:bg-black/90">
                    <img
                      src={getImagePath(post.coverImage)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${post.coverImage}`);
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x400?text=Blog+Post';
                        target.onerror = null; // Prevent infinite error loop
                      }}
                    />
                  </div>
                  
                  <div className="p-6 flex-grow">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags?.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-gray-100 dark:bg-black/80 text-gray-700 dark:text-grayNurse rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-grayNurse mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    
                    {/* Date */}
                    <p className="text-gray-500 dark:text-grayNurse/70 text-sm">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-grayNurse/80 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Read More */}
                    <div className="text-oxfordBlue dark:text-oxfordBlue font-medium inline-flex items-center">
                      Read More
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              No posts found{selectedTag ? ` with tag "${selectedTag}"` : ''}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedTag ? 'Try selecting a different tag or' : 'Please check back later or'} try removing filters.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Blog; 