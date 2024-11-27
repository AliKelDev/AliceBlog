import React, { useRef, useState, useEffect } from 'react';

// Internal hook for animation
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
        <a href="/" className="text-white text-xl font-bold">AL</a>
        <div className="flex gap-8 text-gray-300">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Blog</a>
          <a href="#" className="hover:text-white transition-colors">Categories</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>
    </header>
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
          Subscribe to my newsletter for the latest insights on technology, finance, and gaming.
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

const HomePage = () => {
  const categories = [
    { id: 1, name: "Tech", count: 12, icon: "💻" },
    { id: 2, name: "Finance", count: 8, icon: "📈" },
    { id: 3, name: "Sports", count: 6, icon: "⚽" },
    { id: 4, name: "Commerce", count: 5, icon: "🛍️" },
    { id: 5, name: "Video Games", count: 9, icon: "🎮" }
  ];

  const recentPosts = [
    { id: 1, title: "The Future of AI Development", date: "March 2024", readTime: "5 min", category: "Tech", image: "/api/placeholder/400/250" },
    { id: 2, title: "Market Analysis Q1 2024", date: "March 2024", readTime: "4 min", category: "Finance", image: "/api/placeholder/400/250" },
    { id: 3, title: "Latest Gaming Trends", date: "February 2024", readTime: "6 min", category: "Video Games", image: "/api/placeholder/400/250" }
  ];

  const categoriesRef = useRef(null);
  const postsRef = useRef(null);
  const isCategoriesVisible = useInView(categoriesRef);
  const isPostsVisible = useInView(postsRef);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(100,50,255,0.1),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 py-32 relative">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
              Alice Leiser's Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl">
              Exploring technology, finance, sports, and gaming. 
              Delivering insights across multiple domains.
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

      {/* Categories Section */}
      <section ref={categoriesRef} className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className={`bg-gray-900 p-6 rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-300 transform ${
                  isCategoriesVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="text-2xl mb-4 block">{category.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-400">{category.count} articles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section id="recent-posts" ref={postsRef} className="bg-black text-white py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Recent Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <article 
                key={post.id} 
                className={`group cursor-pointer transform transition-all duration-500 ${
                  isPostsVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-8">
                    <div className="text-sm text-gray-400 mb-4">
                      {post.date} · {post.readTime} read
                    </div>
                    <span className="inline-block px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-full mb-4">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-semibold mb-4 group-hover:text-gray-300">
                      {post.title}
                    </h3>
                    <div className="text-gray-400 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                      Read More 
                      <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">About</h3>
              <p className="text-sm">A personal blog covering technology, finance, sports, and gaming insights.</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm">
                {categories.map(category => (
                  <li key={category.id}>
                    <a href="#" className="hover:text-white transition-colors">{category.name}</a>
                  </li>
                ))}
              </ul>
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

export default HomePage;