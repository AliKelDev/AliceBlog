import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/.netlify/functions/getPost?id=${id}`);
        if (!response.ok) throw new Error('Post not found');
        
        const rawContent = await response.text();
        
        try {
          const { data: frontmatter, content } = matter(rawContent);
          setPost({
            frontmatter,
            // Remove the frontmatter section from the content
            content: content.replace(/^---[\s\S]*?---/, '').trim()
          });
        } catch (parseError) {
          console.error('Parse error:', parseError);
          setError('Error parsing post content');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error Loading Post</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <a href="/" className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const { frontmatter, content } = post;

  return (
    <>
      <Helmet>
        <title>{frontmatter.title || 'Blog Post'}</title>
        <meta name="description" content={frontmatter.description || ''} />
        <meta property="og:title" content={frontmatter.title || ''} />
        <meta property="og:description" content={frontmatter.description || ''} />
        <meta property="og:image" content={frontmatter.thumbnail || ''} />
        <meta name="keywords" content={frontmatter.tags?.join(', ') || ''} />
      </Helmet>

      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm py-4' : 'bg-transparent py-6'
      }`}>
        <nav className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <a href="/" className="text-white text-xl font-bold">AL</a>
          <div className="flex gap-8 text-gray-300">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-black pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-4">
          <header className="mb-12">
            <div className="text-gray-400 mb-4">
              {frontmatter.date && (
                <time dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
              {frontmatter.tags && frontmatter.tags.map(tag => (
                <span key={tag} className="ml-4 px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              {frontmatter.title}
            </h1>
            {frontmatter.description && (
              <p className="text-xl text-gray-300">
                {frontmatter.description}
              </p>
            )}
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
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
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </>
  );
};

export default BlogPostPage;