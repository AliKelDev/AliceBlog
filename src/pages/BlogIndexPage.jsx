import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { getPosts } from '../lib/posts-loader';

const BlogIndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 50;
    if (isScrolled !== scrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    const debouncedScroll = debounce(handleScroll, 10);
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [handleScroll]);

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const allPosts = await getPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog - Alice Leiser</title>
        <meta name="description" content="Read the latest articles about web development and tech insights." />
      </Helmet>

      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm py-4' : 'bg-transparent py-6'
      }`}>
        <nav className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold">AL</Link>
          <div className="flex gap-8 text-gray-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-black">
        <section className="pt-32 pb-24">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-12">Blog Posts</h1>
            
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No posts found. Check back soon!
              </div>
            ) : (
              <div className="space-y-12">
                {posts.map((post) => (
                  <article key={post.id} className="bg-gray-900 rounded-lg overflow-hidden p-8">
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-white mb-3">{post.title}</h2>
                      <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400 mb-4">
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString()}
                        </time>
                        {post.tags && (
                          <div className="flex gap-2">
                            {post.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="bg-gray-800 px-2 py-1 rounded-md text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {post.description && (
                        <p className="text-gray-300 text-lg mb-4">{post.description}</p>
                      )}
                      {post.thumbnail && (
                        <img 
                          src={post.thumbnail} 
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg mb-6"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="prose prose-invert max-w-none mb-6">
                      <MDXProvider>
                        {post.excerpt || post.description}
                      </MDXProvider>
                    </div>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="inline-block px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Read More
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default BlogIndexPage;