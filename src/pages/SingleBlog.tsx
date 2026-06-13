import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchBlogBySlug } from "../lib/api";
import { motion } from "motion/react";
import { Heart, MessageSquare, Share2, Bookmark, ArrowLeft } from "lucide-react";
import { ReadingProgressBar } from "../components/ReadingProgressBar";
import { calculateReadingTime } from "../lib/utils";

export default function SingleBlog() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    if (slug) {
      fetchBlogBySlug(slug)
        .then(setBlog)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAuthRequiredAction = () => {
    showToast("You must be a registered user to use this feature.");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog?.title,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          showToast("Article URL copied to clipboard!");
        } catch (err) {
          showToast("Failed to copy URL");
        }
        textArea.remove();
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50">
        <h1 className="text-2xl font-bold text-secondary mb-4">Article not found</h1>
        <Link to="/blog" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to articles
        </Link>
      </div>
    );
  }

  // Very basic markdown-like renderer for prototype
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => {
      if (paragraph.startsWith('## ')) {
        return <h2 key={idx} className="text-2xl font-bold text-secondary mt-10 mb-4">{paragraph.replace('## ', '')}</h2>;
      }
      if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
        return <p key={idx} className="italic text-slate-500 mb-6 font-serif leading-relaxed text-lg">{paragraph.slice(1, -1)}</p>;
      }
      return <p key={idx} className="mb-6 font-serif text-slate-700 leading-relaxed text-lg">{paragraph}</p>;
    });
  };

  return (
    <div className="bg-white pb-24">
      <ReadingProgressBar />
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to reading
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
            {blog.category}
          </span>
          <span className="text-sm text-slate-500">
            {calculateReadingTime(blog.content)} min read
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-secondary leading-tight tracking-tight mb-8">
          {blog.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-y border-slate-100 py-6">
          <div className="flex items-center gap-4">
            <img src={blog.authorAvatar} alt={blog.authorName} className="w-12 h-12 rounded-full ring-2 ring-slate-100" />
            <div>
              <p className="font-medium text-secondary text-base">{blog.authorName}</p>
              <p className="text-slate-500 text-sm">Published on {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-slate-500">
            <button onClick={handleAuthRequiredAction} className="flex items-center gap-1.5 hover:text-primary transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium">
              <Heart size={18} /> {blog.likes}
            </button>
            <button onClick={handleAuthRequiredAction} className="flex items-center gap-1.5 hover:text-primary transition-colors bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium">
              <MessageSquare size={18} /> {blog.commentsCount}
            </button>
            <button onClick={handleAuthRequiredAction} className="p-2 hover:text-primary hover:bg-slate-50 rounded-full transition-colors ml-2">
              <Bookmark size={20} />
            </button>
            <button onClick={handleShare} className="p-2 hover:text-primary hover:bg-slate-50 rounded-full transition-colors" title="Share Article">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] shadow-lg"
        >
          <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
        </motion.div>
      </div>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg prose-slate prose-headings:font-sans prose-headings:font-bold prose-headings:text-secondary max-w-none">
          {renderContent(blog.content)}
        </div>
        
        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
          {blog.tags.map((tag: string) => (
            <span key={tag} className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {/* Newsletter signup inline */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20" />
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Enjoyed this article?</h3>
            <p className="text-slate-300 mb-8 max-w-md mx-auto">Join our weekly newsletter to receive our best stories and technical deep dives.</p>
            <form className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-md mx-auto">
              <input type="email" placeholder="Your email address" className="flex-grow px-5 py-3 rounded-full bg-white/10 text-white placeholder:text-slate-400 border border-white/20 focus:outline-none focus:border-white/40" />
              <button type="button" className="px-6 py-3 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2">
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
