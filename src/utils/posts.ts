import { useEffect, useState } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  content?: string;
}

/**
 * Fetches all available blog posts metadata
 */
export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Fetch the posts index file
        const response = await fetch('/posts/index.json');
        if (!response.ok) {
          throw new Error('Failed to load blog posts');
        }
        
        const postsData = await response.json();
        setPosts(postsData);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError('Failed to load blog posts');
        // Fallback to a sample post if the index file doesn't exist yet
        setPosts([{
          slug: 'hello-world',
          title: 'Hello World - My First Blog Post',
          date: '2024-03-12',
          excerpt: 'This is my first blog post with markdown and LaTeX support.',
          coverImage: '/images/wallhaven-0jk3ey.jpg',
          tags: ['markdown', 'LaTeX', 'blog'],
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

/**
 * Fetches a specific blog post by slug
 */
export const useBlogPost = (slug: string | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setLoading(false);
        setError('No post slug provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch the post markdown file
        const response = await fetch(`/posts/${slug}.md`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        
        const text = await response.text();
        
        // Parse frontmatter
        const [, frontmatter, content] = text.split('---');
        const metadata = {
          slug,
          title: frontmatter.match(/title: "(.*?)"/)?.[1] || '',
          date: frontmatter.match(/date: "(.*?)"/)?.[1] || '',
          excerpt: frontmatter.match(/excerpt: "(.*?)"/)?.[1] || '',
          coverImage: frontmatter.match(/coverImage: "(.*?)"/)?.[1] || '',
          tags: frontmatter.match(/tags: \[(.*?)\]/)?.[1].split(',').map(tag => tag.trim().replace(/"/g, '')) || [],
          content: content.trim(),
        };

        setPost(metadata);
      } catch (err) {
        console.error('Error loading blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
}; 