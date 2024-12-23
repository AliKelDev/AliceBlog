import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Menu, X } from 'lucide-react';
import { getPosts } from '../lib/posts-loader';
import { SearchBar, searchPosts } from '../utils/search';
import useScrollToTop from '../hooks/useScrollToTop';

const BlogIndexPage = () => {
  useScrollToTop();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const initialQuery = searchParams.get('q') || '';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

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
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await getPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
      
      // If there's an initial search query, perform search
      if (initialQuery) {
        handleSearch(initialQuery);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setIsSearching(true);
    try {
      if (!query.trim()) {
        setFilteredPosts(posts);
      } else {
        const results = await searchPosts(query, posts);
        setFilteredPosts(results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Utility function for debouncing
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Blog - Alice Leiser</title>
        <meta name="description" content="Read the latest articles about web development and tech insights." />
      </Helmet>

      {/* Navigation Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          onClick={() => {
            setIsMenuOpen(false);
            document.body.style.overflow = 'auto';
          }}
        />
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50">
        <div className="bg-black/90 backdrop-blur-lg border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="text-xl font-bold text-white">
                AL
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Slide from right */}
        <div 
          className={`fixed top-0 right-0 h-full w-64 bg-black/95 transform transition-transform duration-300 ease-in-out z-50 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center h-16 px-4 border-b border-gray-800">
            <span className="text-xl font-bold text-white">Menu</span>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="px-4 py-6 space-y-6">
            <Link 
              to="/" 
              className="block text-lg text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
              }}
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              className="block text-lg text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
              }}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className="block text-lg text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = 'auto';
              }}
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(100,50,255,0.1),transparent_50%)] animate-pulse" />
        <div className="absolute top-1/4 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float-delayed" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Latest Articles
            </h1>
            <div className="space-y-6">
              <p className="text-xl text-gray-400 max-w-2xl">
                Exploring web development, technology, and digital experiences.
              </p>
              <SearchBar
                onSearch={handleSearch}
                initialQuery={initialQuery}
                fullWidth
                placeholder="Search articles or try finding easter eggs..."
              />
            </div>
          </motion.div>

          {isLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          ) : (
            <>
              {filteredPosts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-400 text-lg">
                    {initialQuery
                      ? `No posts found for "${initialQuery}"`
                      : "No posts found. Check back soon!"}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-12">
                  {filteredPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
                      
                      <div className="relative bg-white/5 backdrop-blur-lg rounded-lg p-8 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20">
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400 mb-4">
                            <time dateTime={post.date} className="font-mono">
                              {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </time>
                            {post.tags && (
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, tagIndex) => (
                                  <Link
                                    key={tagIndex}
                                    to={`/blog/tag/${tag}`}
                                    className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm
                                             hover:bg-purple-900/50 transition-colors"
                                  >
                                    {tag}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>

                          <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                            {post.title}
                          </h2>

                          {post.description && (
                            <p className="text-gray-300 text-lg mb-6">{post.description}</p>
                          )}

                          {post.thumbnail && (
                            <div className="relative overflow-hidden rounded-lg mb-6">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                              <img 
                                src={post.thumbnail} 
                                alt={post.title}
                                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>

                        <Link 
                          to={`/blog/${post.id}`}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 group"
                        >
                          <span>Read Article</span>
                          <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BlogIndexPage;