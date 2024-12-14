import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, ArrowDown } from 'lucide-react';
import { MDXProvider } from '@mdx-js/react';
import { Link } from 'react-router-dom';
import { getPosts } from "../lib/posts-loader";
import useScrollToTop from '../hooks/useScrollToTop';

// Enhanced Blog Post Component with animations
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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300" />
      
      <div className="relative bg-white/5 backdrop-blur-lg rounded-lg p-8 hover:bg-white/10 transition-all duration-300">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">{title}</h2>
          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400 mb-4">
            <time dateTime={date} className="font-mono">{new Date(date).toLocaleDateString()}</time>
            <div className="flex gap-2">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
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
            <div className="relative overflow-hidden rounded-lg mb-6">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <img 
                src={thumbnail} 
                alt={title}
                className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
        </div>
        <div className="prose prose-invert max-w-none mb-6">
          <MDXProvider>
            {excerpt || description}
          </MDXProvider>
        </div>
        <Link 
          to={`/blog/${post.id}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <span>Read More</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </motion.article>
  );
};

// Enhanced Newsletter Component
const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Thanks for subscribing!');
      setEmail('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(100,50,255,0.1),transparent_50%)] animate-pulse" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to get notified about new articles and web development insights.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-white/40 backdrop-blur-sm"
              required
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-white text-purple-900 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-purple-300"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Footer Component
const Footer = () => {
  return (
    <footer className="relative bg-black/90 text-gray-400 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <p className="text-sm">Web developer and founder of Pixelle3, sharing insights about modern web development.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
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
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-sm mb-4">Get the latest updates directly to your inbox.</p>
            <a 
              href="#newsletter" 
              className="text-sm text-white bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors inline-block backdrop-blur-sm"
            >
              Subscribe Now
            </a>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="text-sm">
            © 2024 Alice Leiser. All rights reserved.
          </div>
          <div className="text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="mx-2">·</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Main HomePage Component
const HomePage = () => {
  useScrollToTop();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

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

    // Handle scroll for section highlighting
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sections = document.querySelectorAll('section');
      
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionTop + sectionHeight - 200) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4"
        >
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section with enhanced visuals */}
      <section className="min-h-screen bg-black text-white flex items-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(100,50,255,0.1),transparent_50%)] animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.1),transparent)] animate-[sweep_3s_ease-in-out_infinite]" />
        </div>

        {/* Main content container */}
        <div className="max-w-6xl mx-auto px-4 py-32 relative z-10">
          <div className="space-y-8">
            {/* Animated name heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <a 
                href="https://x.com/AliLeisR" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative inline-block"
              >
                <h1 className="text-7xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
                  Alice Leiser
                </h1>
                <span className="absolute -inset-x-4 -inset-y-2 hidden group-hover:block">
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-lg" />
                </span>
              </a>
            </motion.div>

            {/* Animated subtitle with typing effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <p className="text-xl md:text-2xl text-gray-400 max-w-2xl typing-effect">
                Web Developer. Founder of Pixelle3.
                <span className="block mt-2 text-purple-400">Crafting digital experiences.</span>
              </p>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex gap-6 pt-4"
            >
              <a
                href="https://github.com/AliKelDev"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Github className="w-6 h-6" />
                <span className="absolute -inset-1 bg-purple-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://x.com/AliLeisR"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-6 h-6" />
                <span className="absolute -inset-1 bg-blue-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="pt-8"
            >
              <a 
                href="#recent-posts" 
                className="group relative px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>Read Latest Posts</span>
                <ArrowDown className="animate-bounce" />
                <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* Floating decoration elements */}
        <div className="absolute top-1/4 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" />
        <div className="absolute bottom-1/4 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float-delayed" />
      </section>

      {/* Recent Posts Section */}
      <section id="recent-posts" className="bg-black/90 text-white py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12"
          >
            Latest Articles
          </motion.h2>

          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="animate-pulse">No posts found. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {posts.map((post, index) => (
                <BlogPost key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Newsletter />
      <Footer />

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
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
        
        .animate-gradient {
          animation: gradient 8s linear infinite;
          background-size: 200% auto;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .typing-effect {
          border-right: 2px solid transparent;
          animation: typing 3s steps(40, end), blink .75s step-end infinite;
          white-space: nowrap;
          overflow: hidden;
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: rgba(139, 92, 246, 0.5) }
        }
      `}</style>
    </>
  );
};

export default HomePage;