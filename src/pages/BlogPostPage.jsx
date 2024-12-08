import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Helmet } from 'react-helmet-async';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPost, getAdjacentPosts } from '../lib/posts-loader';

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adjacentPosts, setAdjacentPosts] = useState({ prev: null, next: null });

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
    async function loadPost() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [postData, adjacentPostsData] = await Promise.all([
          getPost(id),
          getAdjacentPosts(id)
        ]);
        
        if (postData) {
          setPost(postData);
          setAdjacentPosts(adjacentPostsData);
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [id]);

  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: post.description,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  // Not found state
  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Define custom components for MDX
  const components = {
    h2: props => <h2 {...props} className="text-3xl font-bold mt-12 mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent" />,
    h3: props => <h3 {...props} className="text-2xl font-bold mt-8 mb-4 text-purple-300" />,
    p: props => <p {...props} className="text-gray-300 leading-relaxed mb-6" />,
    ul: props => <ul {...props} className="list-disc list-inside space-y-3 text-gray-300 mb-6" />,
    ol: props => <ol {...props} className="list-decimal list-inside space-y-3 text-gray-300 mb-6" />,
    li: props => <li {...props} className="text-gray-300" />,
    blockquote: props => (
      <blockquote {...props} className="border-l-4 border-purple-500 pl-4 my-6 italic text-gray-400" />
    ),
    code: ({ children, className }) => (
      <code className={`${className} bg-black/50 rounded px-2 py-1 font-mono text-sm text-purple-300`}>
        {children}
      </code>
    ),
    pre: props => (
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
        <pre {...props} className="relative bg-black/50 rounded-lg p-4 overflow-x-auto" />
      </div>
    ),
    a: props => (
      <a {...props} className="text-purple-400 hover:text-purple-300 underline transition-colors" target="_blank" rel="noopener noreferrer" />
    ),
    img: props => (
      <div className="relative rounded-lg overflow-hidden my-8 group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        <img {...props} className="w-full transform group-hover:scale-105 transition-transform duration-300" />
      </div>
    ),
  };

  const PostContent = post.component;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Helmet>
        <title>{post.title} - Alice Leiser's Blog</title>
        <meta name="description" content={post.description || ''} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description || ''} />
        <meta property="og:image" content={post.thumbnail || ''} />
        <meta name="keywords" content={post.tags?.join(', ') || ''} />
        <meta property="og:type" content="article" />
        <meta name="author" content="Alice Leiser" />
        {post.date && (
          <meta property="article:published_time" content={new Date(post.date).toISOString()} />
        )}
      </Helmet>

      {/* Animated background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(100,50,255,0.1),transparent_50%)] animate-pulse" />
        <div className="absolute top-1/4 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float-delayed" />
      </div>

      {/* Navigation Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm py-4' : 'bg-transparent py-6'
      }`}>
        <nav className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-white text-xl font-bold relative group">
              <span className="relative z-10">AL</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
            </Link>
            <div className="flex gap-8 text-gray-300">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-4">
          {/* Article Header */}
          <header className="mb-12 relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
            
            <div className="relative bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <time dateTime={post.date} className="text-gray-400 font-mono">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <button 
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  aria-label="Share post"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-xl text-gray-300 leading-relaxed">
                  {post.description}
                </p>
              )}

              {post.thumbnail && (
                <div className="mt-8 relative rounded-xl overflow-hidden">
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
          </header>

          {/* Article Content */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg blur-lg" />
            
            <div className="relative bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <div className="prose prose-invert prose-lg max-w-none">
                <MDXProvider components={components}>
                  <PostContent />
                </MDXProvider>
              </div>
            </div>
          </div>

          {/* Navigation between posts */}
          <nav className="mt-12 pt-8 border-t border-white/10">
            <div className="flex justify-between items-center">
              {adjacentPosts.prev && (
                <Link
                  to={`/blog/${adjacentPosts.prev.id}`}
                  className="group flex items-center space-x-4 relative"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-transparent rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
                  <ChevronLeft className="relative text-purple-400 group-hover:-translate-x-1 transition-transform" />
                  <div className="relative">
                    <div className="text-sm text-gray-400">Previous</div>
                    <div className="text-white group-hover:text-purple-300 transition-colors">
                      {adjacentPosts.prev.title}
                    </div>
                  </div>
                </Link>
              )}
              
              {adjacentPosts.next && (
                <Link
                  to={`/blog/${adjacentPosts.next.id}`}
                  className="group flex items-center space-x-4 relative ml-auto text-right"
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-transparent to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div className="relative">
                    <div className="text-sm text-gray-400">Next</div>
                    <div className="text-white group-hover:text-blue-300 transition-colors">
                      {adjacentPosts.next.title}
                    </div>
                  </div>
                  <ChevronRight className="relative text-blue-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </nav>
        </article>
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

// Helper NavLink component
const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="relative group"
  >
    <span className="relative z-10 hover:text-white transition-colors">{children}</span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300" />
  </Link>
);

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

export default BlogPostPage;