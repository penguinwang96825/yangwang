import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Define the type for blog posts
interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
}

// Helper function to get asset URL with base path
const getAssetUrl = (path: string) => {
  // If the path already starts with http or https, it's already an absolute URL
  if (path && (path.startsWith('http://') || path.startsWith('https://'))) {
    return path;
  }
  // Otherwise, prepend the base URL
  return `${import.meta.env.BASE_URL}${path && path.startsWith('/') ? path.substring(1) : path}`;
};

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Fetch the posts index with correct base URL
        const response = await fetch(`${import.meta.env.BASE_URL}posts/index.json`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts index');
        }
        
        const postsData = await response.json();
        
        // Sort posts by date (newest first)
        const sortedPosts = postsData.sort((a: Post, b: Post) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        setPosts(sortedPosts);
        
        // Extract unique tags from all posts
        const allTags = sortedPosts.flatMap((post: Post) => post.tags);
        const uniqueTags = [...new Set(allTags)] as string[];
        setTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleTagClick = (tag: string) => {
    setSelectedTag(prevTag => prevTag === tag ? null : tag);
  };

  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
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
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
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
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
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
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col"
                  whileHover={{ y: -5 }}
                >
                  {/* Cover Image */}
                  <div className="h-44 overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-700">
                    <img
                      src={getAssetUrl(post.coverImage)}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x400?text=Blog+Post';
                      }}
                    />
                  </div>
                  
                  <div className="p-6 flex-grow">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    
                    {/* Date */}
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Read More */}
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium inline-flex items-center">
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