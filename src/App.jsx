import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BlogPostPage from './pages/BlogPostPage';

const useInView = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting)
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isVisible;
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-sm py-4' : 'bg-transparent py-6'
    }`}>
      <nav className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">AL</Link>
        <div className="flex gap-8 text-gray-300">
          <Link to="#" className="hover:text-white transition-colors">About</Link>
          <Link to="#" className="hover:text-white transition-colors">Blog</Link>
          <Link to="#" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </nav>
    </header>
  );
};

const BlogPost = ({ post }) => {
  return (
    <article className="bg-gray-900 rounded-lg overflow-hidden p-8">
      <div className="text-sm text-gray-400 mb-4">
        {post.date}
      </div>
      <ReactMarkdown
        className="prose prose-invert max-w-none"
        components={{
          h1: ({children}) => <h1 className="text-4xl font-bold mb-8 text-white">{children}</h1>,
          h2: ({children}) => <h2 className="text-2xl font-bold mt-8 mb-4 text-white">{children}</h2>,
          p: ({children}) => <p className="text-gray-300 mb-4 text-lg">{children}</p>,
          ul: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-300">{children}</ul>,
          li: ({children}) => <li className="mb-2">{children}</li>,
          a: ({href, children}) => (
            <a href={href} className="text-blue-400 hover:text-blue-300 underline">
              {children}
            </a>
          ),
        }}
      >
        {/* Show preview of the content */}
        {post.body.substring(0, 300)}...
      </ReactMarkdown>
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

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const containerRef = useRef(null);
  const isVisible = useInView(containerRef);

  return (
    <section ref={containerRef} className={`bg-gradient-to-r from-purple-900 to-blue-900 py-24 transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Stay Updated</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Subscribe to get notified about new articles and web development insights.
        </p>
        <form className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-white/40"
          />
          <button type="submit" className="px-6 py-2 bg-white text-purple-900 rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

const MainContent = () => {
  const [posts, setPosts] = useState([]);
  const postsRef = useRef(null);
  const isPostsVisible = useInView(postsRef);

  const loadPosts = async () => {
    try {
      const response = await fetch('/.netlify/functions/getPosts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

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
              Web Developer. Founder of WebPixel.
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

      <section id="recent-posts" ref={postsRef} className="bg-black text-white py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Latest Articles</h2>
          <div className="space-y-12">
            {posts.map((post) => (
              <div 
                key={post.id}
                className={`transform transition-all duration-500 ${
                  isPostsVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
              >
                <BlogPost post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">About</h3>
              <p className="text-sm">Web developer and founder of WebPixel, sharing insights about modern web development.</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Connect</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="hover:text-white transition-colors block">Twitter</a>
                <a href="#" className="hover:text-white transition-colors block">GitHub</a>
                <a href="#" className="hover:text-white transition-colors block">LinkedIn</a>
              </div>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-sm mb-4">Get the latest updates directly to your inbox.</p>
              <a href="#" className="text-sm text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors inline-block">
                Subscribe Now
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              © 2024 Alice Leiser. All rights reserved.
            </div>
            <div className="text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="mx-2">·</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
      </Routes>
    </Router>
  );
};

export default App;