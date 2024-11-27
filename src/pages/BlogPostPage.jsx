import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:image" content={image} />
  </Helmet>
);

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/.netlify/functions/getPost?id=${id}`);
        if (!response.ok) throw new Error('Post not found');
        const data = await response.json();
        setPost(data);
      } catch (err) {
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
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <a href="/" className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <>
      <SEO 
        title={`${post.title} | Alice Leiser's Blog`}
        description={post.excerpt || post.body.substring(0, 160)}
        image={post.coverImage}
      />

      <header className={`fixed w-full z-50 transition-all duration-300 ${
        window.scrollY > 50 ? 'bg-black/90 backdrop-blur-sm py-4' : 'bg-transparent py-6'
      }`}>
        <nav className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <a href="/" className="text-white text-xl font-bold">AL</a>
          <div className="flex gap-8 text-gray-300">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-black pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-4">
          {post.coverImage && (
            <div className="mb-12 rounded-xl overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          <header className="mb-12">
            <div className="text-gray-400 mb-4">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {post.category && (
                <span className="ml-4 px-3 py-1 bg-gray-800 rounded-full text-sm">
                  {post.category}
                </span>
              )}
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-gray-300">
                {post.excerpt}
              </p>
            )}
          </header>

          <div ref={contentRef}>
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
              {post.body}
            </ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {post.author && (
                <div className="flex items-center gap-4">
                  {post.author.avatar && (
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <div className="text-white font-medium">{post.author.name}</div>
                    <div className="text-gray-400 text-sm">{post.author.role}</div>
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Share
                </button>
                <a 
                  href="/"
                  className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                >
                  More Posts
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>
    </>
  );
};

export default BlogPostPage;