import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MessageSquare, Heart } from "lucide-react";
import { motion } from "motion/react";
import { fetchBlogs } from "../lib/api";
import { calculateReadingTime } from "../lib/utils";

const categories = ["All", "Technology", "AI", "Web Development", "React", "JavaScript", "TypeScript", "Node.js", "Startups", "Business", "Productivity"];

export default function BlogList() {
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchBlogs({ limit: 100 })
      .then(data => {
        setAllBlogs(data);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const blogs = allBlogs.filter(blog => {
    const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-6 tracking-tight">Explore Articles</h1>
          <p className="text-lg text-slate-500 mb-10">Discover insights, tutorials, and stories from our community of expert writers and developers.</p>
          
          <div className="relative max-w-xl mx-auto shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title or tags..."
              className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-secondary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-28">
              <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
                <Filter size={18} /> Categories
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-sm text-left font-medium rounded-lg transition-colors ${
                      activeCategory === cat 
                        ? "bg-primary/10 text-primary" 
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : blogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {blogs.map((post, i) => (
                  <motion.article 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    key={post.id} 
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <Link to={`/blog/${post.slug}`} className="flex-col flex flex-grow">
                      <div className="h-48 overflow-hidden">
                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {post.category}
                          </span>
                          <span className="text-xs text-slate-400">
                            {calculateReadingTime(post.content)} min read
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-secondary mb-3 leading-tight group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-slate-500 text-sm mb-6 flex-grow font-serif line-clamp-3">
                          {post.content.split('\n')[0]}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                          <div className="flex items-center gap-2">
                            <img src={post.authorAvatar} alt={post.authorName} className="w-8 h-8 rounded-full bg-slate-200" />
                            <div>
                              <p className="text-sm font-medium text-secondary leading-none">{post.authorName}</p>
                              <p className="text-xs text-slate-400 mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-slate-400 text-sm">
                            <span className="flex items-center gap-1 hover:text-primary transition-colors"><Heart size={16} /> {post.likes}</span>
                            <span className="flex items-center gap-1 hover:text-primary transition-colors"><MessageSquare size={16} /> {post.commentsCount}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-500 text-lg mb-4">No articles found matching your criteria.</p>
                <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="text-primary font-medium hover:underline">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
