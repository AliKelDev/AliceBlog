import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { Helmet } from 'react-helmet-async';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { allPosts } from "../../content/posts/index.js";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [adjacentPosts, setAdjacentPosts] = useState({ prev: null, next: null });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!id) return;
    
    // Find post in local content
    const foundPost = allPosts.find(post => post.id === id);
    if (foundPost) {
      setPost(foundPost);
      
      // Find adjacent posts
      const currentIndex = allPosts.findIndex(post => post.id === id);
      setAdjacentPosts({
        prev: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
        next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
      });
    }
  }, [id]);

  const handleShare = async () => {
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

  return (
    <>
      <Helmet>
        <title>{post.title || 'Blog Post'} - Alice Leiser's Blog</title>
        <meta name="description" content={post.description || ''} />
        <meta property="og:title" content={post.title || ''} />
        <meta property="og:description" content={post.description || ''} />
        <meta property="og:image" content={post.thumbnail || ''} />
        <meta name="keywords" content={post.tags?.join(', ') || ''} />
        <meta property="og:type" content="article" />
        <meta name="author" content="Alice Leiser" />
        {post.date && (
          <meta property="article:published_time" content={new Date(post.date).toISOString()} />
        )}
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

      <main className="min-h-screen bg-black pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-4">
          <header className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <time dateTime={post.date} className="text-gray-400">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <button 
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Share post"
              >
                <Share2 size={20} />
              </button>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
            {post.description && (
              <p className="text-xl text-gray-300">
                {post.description}
              </p>
            )}
            {post.thumbnail && (
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-64 object-cover rounded-xl mt-8"
                loading="lazy"
              />
            )}
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            <MDXProvider
              components={{
                code: ({ children, className, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <div className="relative">
                      <pre className={className} {...props}>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    className="text-blue-400 hover:text-blue-300 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                )
              }}
            >
              {post.component}
            </MDXProvider>
          </div>

          <nav className="mt-12 border-t border-gray-800 pt-8">
            <div className="flex justify-between items-center">
              {adjacentPosts.prev && (
                <Link
                  to={`/blog/${adjacentPosts.prev.id}`}
                  className="flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} className="mr-2" />
                  <div>
                    <div className="text-sm">Previous</div>
                    <div className="font-medium">{adjacentPosts.prev.title}</div>
                  </div>
                </Link>
              )}
              {adjacentPosts.next && (
                <Link
                  to={`/blog/${adjacentPosts.next.id}`}
                  className="flex items-center text-gray-400 hover:text-white transition-colors ml-auto"
                >
                  <div className="text-right">
                    <div className="text-sm">Next</div>
                    <div className="font-medium">{adjacentPosts.next.title}</div>
                  </div>
                  <ChevronRight size={20} className="ml-2" />
                </Link>
              )}
            </div>
          </nav>
        </article>
      </main>
    </>
  );
};

export default BlogPostPage;