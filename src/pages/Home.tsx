import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchBlogs } from "../lib/api";

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchBlogs({ limit: 4, sort: 'popular' }).then(setFeaturedPosts).catch(console.error);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white/50 py-20 lg:py-32 border-b border-slate-100">
        <div className="absolute inset-0 bg-slate-50 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-sm font-medium mb-8 border border-blue-100 shadow-sm">
              <Star size={14} className="fill-primary" /> Premium Publishing Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-secondary tracking-tight leading-[1.1] mb-8">
              Where true stories <br /> <span className="text-primary">find their voice.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Join thousands of creators, builders, and thinkers sharing deeply researched articles, insights, and stories on a platform designed for reading.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/blog" className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/25 hover:bg-blue-700 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                Start Reading
              </Link>
              <Link to="/about" className="w-full sm:w-auto px-8 py-4 bg-white text-secondary border border-slate-200 rounded-full font-medium hover:bg-slate-50 transition-all duration-300 shadow-sm">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-4 flex items-center gap-2">
                <TrendingUp className="text-primary" /> Trending Now
              </h2>
              <p className="text-slate-500 text-lg">The most read and discussed articles this week.</p>
            </div>
            <Link to="/blog" className="text-primary font-medium hover:text-blue-700 mt-4 md:mt-0 flex items-center gap-1 group">
              View all articles
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredPosts.map((post, i) => (
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={post.id} 
                className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <Link to={`/blog/${post.slug}`} className="flex-grow flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full bg-slate-100" />
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-secondary shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="font-bold text-xl text-secondary mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow font-serif">{post.content.substring(0, 150)}...</p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {post.authorAvatar ? (
                          <img src={post.authorAvatar} alt={post.authorName || "Author"} className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-500">
                            {(post.authorName || "A").charAt(0)}
                          </div>
                        )}
                        <span className="font-medium">{post.authorName || "Admin"}</span>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join our newsletter</h2>
          <p className="text-lg text-slate-300 mb-10">Get the finest stories from top creators delivered directly to your inbox every week. No spam, ever.</p>
          <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
            />
            <button type="submit" className="px-8 py-3 bg-primary hover:bg-blue-500 text-white font-medium rounded-full transition-colors shadow-lg shadow-primary/20">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
