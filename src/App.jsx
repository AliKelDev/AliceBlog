import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MDXProvider } from '@mdx-js/react';
import BlogPostPage from './pages/BlogPostPage';
import BlogIndexPage from './pages/BlogIndexPage';
import ContactPage from './pages/ContactPage';  // Add this import
import { getPosts } from "./lib/posts-loader";

// Header Component with scroll effect
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm py-4' : 'bg-transparent py-6'
    }`}>
      <nav className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">AL</Link>
        <div className="flex gap-8 text-gray-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </nav>
    </header>
  );
};

// Blog Post Component
const BlogPost = ({ post }) => {
  if (!post) return null;

  const { 
    title, 
    date, 
    description, 
    tags = [], 
    thumbnail,
    excerpt 
  } = post;

  return (
    <article className="bg-gray-900 rounded-lg overflow-hidden p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
        <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400 mb-4">
          <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
          <div className="flex gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-800 px-2 py-1 rounded-md text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        {description && (
          <p className="text-gray-300 text-lg mb-4">{description}</p>
        )}
        {thumbnail && (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-48 object-cover rounded-lg mb-6"
            loading="lazy"
          />
        )}
      </div>
      <div className="prose prose-invert max-w-none mb-6">
        <MDXProvider>
          {excerpt || description}
        </MDXProvider>
      </div>
      <div className="mt-6">
        <Link 
          to={`/blog/${post.id}`}
          className="inline-block px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Read More
        </Link>
      </div>
    </article>
  );
};

// Newsletter Component
const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-r from-purple-900 to-blue-900 py-24">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Stay Updated</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Subscribe to get notified about new articles and web development insights.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-white/40"
            required
          />
          <button type="submit" className="px-6 py-2 bg-white text-purple-900 rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <p className="text-sm">Web developer and founder of Pixelle3, sharing insights about modern web development.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Connect</h3>
            <div className="space-y-2 text-sm">
              <a 
                href="https://x.com/AliLeisR" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors block"
              >
                Twitter
              </a>
              <a 
                href="https://github.com/AliKelDev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white transition-colors block"
              >
                GitHub
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-sm mb-4">Get the latest updates directly to your inbox.</p>
            <a href="#newsletter" className="text-sm text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-block">
              Subscribe Now
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © 2024 Alice Leiser. All rights reserved.
          </div>
          <div className="text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="mx-2">·</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main Content Component
const MainContent = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      <Header />

      <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(100,50,255,0.1),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 py-32 relative">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
              Alice Leiser's Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl">
              Web Developer. Founder of Pixelle3.
              Sharing insights about modern web development.
            </p>
            <div className="pt-8">
              <a href="#recent-posts" className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                Read Latest Posts
                <span className="animate-bounce">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="recent-posts" className="bg-black text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Latest Articles</h2>
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No posts found. Check back soon!
            </div>
          ) : (
            <div className="space-y-12">
              {posts.map((post) => (
                <div key={post.id}>
                  <BlogPost post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Newsletter />
      <Footer />
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

// Main App Component
const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />  {/* Add this route */}
        </Routes>
      </Router>
    </HelmetProvider>
  );
};



export default App;