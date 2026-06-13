import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchStats, fetchBlogs, fetchUsers } from "../lib/api";
import { BarChart3, Users, FileText, Settings, LogOut, Eye, Heart, Image as ImageIcon, Link as LinkIcon, Bold, Italic, List, X, FolderOpen, MessageSquare, Check, Trash2, Edit2, Bell } from "lucide-react";

const CreatePostModal = ({ onClose, onSuccess, initialData = null }: { onClose: () => void, onSuccess: () => void, initialData?: any }) => {
  const [formData, setFormData] = useState(() => {
    const draftKey = initialData ? `admin_edit_post_${initialData.id}` : 'admin_draft_post';
    const saved = localStorage.getItem(draftKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved draft", e);
      }
    }
    if (initialData) {
      return {
        title: initialData.title || "",
        slug: initialData.slug || "",
        category: initialData.category || "Technology",
        thumbnail: initialData.thumbnail || "",
        tags: initialData.tags?.join(', ') || "",
        content: initialData.content || ""
      };
    }
    return {
      title: "",
      slug: "",
      category: "Technology",
      thumbnail: "",
      tags: "",
      content: ""
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const draftKey = initialData ? `admin_edit_post_${initialData.id}` : 'admin_draft_post';
    localStorage.setItem(draftKey, JSON.stringify(formData));
    setLastSaved(new Date());
  }, [formData, initialData]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: initialData ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!formData.title || !formData.content) {
      setErrorMsg("Title and content are required.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const url = initialData ? `/api/blogs/${initialData.id}` : "/api/blogs";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const draftKey = initialData ? `admin_edit_post_${initialData.id}` : 'admin_draft_post';
        localStorage.removeItem(draftKey);
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setErrorMsg(`Failed to ${initialData ? 'update' : 'create'} post: ${data.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      setErrorMsg(`Network error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-secondary">{initialData ? 'Edit Post' : 'Create New Post'}</h2>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-200">
            <X size={20} />
          </button>
        </div>
        
        {errorMsg && (
          <div className="mx-6 mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
            {errorMsg}
          </div>
        )}
        
        <div className="flex-grow overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Area */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Post Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 text-lg font-medium rounded-xl border border-slate-200 focus:outline-none focus:ring-2 border-slate-200 focus:ring-primary/50" 
                  placeholder="Enter a captivating title..." 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50">
                  {/* Editor Toolbar */}
                  <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1">
                    <button type="button" className="p-2 text-slate-500 hover:text-secondary hover:bg-slate-200 rounded transition-colors"><Bold size={18} /></button>
                    <button type="button" className="p-2 text-slate-500 hover:text-secondary hover:bg-slate-200 rounded transition-colors"><Italic size={18} /></button>
                    <div className="w-px h-6 bg-slate-300 mx-1 self-center"></div>
                    <button type="button" className="p-2 text-slate-500 hover:text-secondary hover:bg-slate-200 rounded transition-colors"><LinkIcon size={18} /></button>
                    <button type="button" className="p-2 text-slate-500 hover:text-secondary hover:bg-slate-200 rounded transition-colors"><List size={18} /></button>
                    <button type="button" className="p-2 text-slate-500 hover:text-secondary hover:bg-slate-200 rounded transition-colors"><ImageIcon size={18} /></button>
                  </div>
                  <textarea 
                    rows={12} 
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full px-4 py-4 focus:outline-none resize-none font-sans text-slate-700 leading-relaxed" 
                    placeholder="Write your story here... Markdown is supported."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Sidebar Meta Info */}
            <div className="w-full lg:w-80 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
                <input 
                  type="text" 
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" 
                  placeholder="post-url-slug" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <div className="relative">
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none bg-white"
                  >
                    <option>Technology</option>
                    <option>Design</option>
                    <option>Development</option>
                    <option>Business</option>
                    <option>Lifestyle</option>
                    <option>AI & Future</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                <input 
                  type="text" 
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  placeholder="react, web, ui (comma separated)" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Thumbnail</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    placeholder="https://..." 
                  />
                  <label className="flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer border border-slate-200 transition-colors">
                    <ImageIcon size={18} className="mr-2" />
                    Upload
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData();
                        fd.append("file", file);
                        try {
                          setIsSubmitting(true);
                          const res = await fetch("/api/upload", { method: "POST", body: fd });
                          const data = await res.json();
                          if (res.ok) {
                            setFormData(prev => ({ ...prev, thumbnail: data.url }));
                          } else {
                            setErrorMsg(data.error || "Upload failed");
                          }
                        } catch (err) {
                          setErrorMsg("Upload failed due to network error");
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                    />
                  </label>
                </div>
                {formData.thumbnail && (
                  <div className="mt-3 relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <img src={formData.thumbnail} alt="Preview" className="object-cover w-full h-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between rounded-b-3xl bg-slate-50">
          <div className="text-sm text-slate-500 flex items-center">
            {lastSaved && (
              <>
                <Check size={16} className="mr-1 text-green-500" />
                Draft saved locally at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                Publishing...
              </span>
            ) : (
              initialData ? "Save Changes" : "Publish Post"
            )}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserModal = ({ onClose, onSuccess, initialData = null }: { onClose: () => void, onSuccess: () => void, initialData?: any }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    role: initialData?.role || "Editor"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMsg("Name and Email are required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const url = initialData ? `/api/users/${initialData.id}` : "/api/users";
      const method = initialData ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        setErrorMsg(`Failed to ${initialData ? 'update' : 'create'} user: ${data.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      setErrorMsg(`Network error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-secondary mb-6">{initialData ? 'Edit User' : 'Invite / Add User'}</h2>
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {errorMsg}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select value={formData.role} onChange={(e) => setFormData(p => ({...p, role: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
              <option value="Administrator">Administrator</option>
              <option value="Editor">Editor</option>
              <option value="Author">Author</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50">
              {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Add User')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [allBlogs, setAllBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Modals state
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showInviteUser, setShowInviteUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Notification state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate new comment notification arriving
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => [
        {
          id: Date.now(),
          message: "A new comment requires moderation.",
        },
        ...prev
      ]);
    }, 10000); // 10s wait
    
    return () => clearTimeout(timer);
  }, []);

  // Tab specific mock state
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Technology', slug: 'technology', articles: 12 },
    { id: 2, name: 'Design', slug: 'design', articles: 8 },
    { id: 3, name: 'Development', slug: 'development', articles: 15 },
    { id: 4, name: 'Lifestyle', slug: 'lifestyle', articles: 4 }
  ]);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [comments, setComments] = useState([
    { id: 1, author: "Jane Smith", email: "jane@example.com", content: "Great article! This really helped me understand the topic better.", post: "Getting Started with React", date: "2 hours ago" },
    { id: 2, author: "Alex Chen", email: "alex@example.com", content: "I have a question about the final section. Could you provide more details?", post: "Advanced Tailwind CSS", date: "5 hours ago", flagged: true },
    { id: 3, author: "Sam Taylor", email: "sam@example.com", content: "This is crap, the worst write-up, you suck.", post: "UI/UX Best Practices", date: "1 day ago", flagged: true }
  ]);


  const loadData = () => {
    setIsLoading(true);
    Promise.all([
      fetchStats(),
      fetchBlogs({ limit: 5 }),
      fetchBlogs({ limit: 100 }),
      fetchUsers()
    ]).then(([statsData, blogsData, allBlogsData, usersData]) => {
      setStats(statsData);
      setRecentBlogs(blogsData);
      setAllBlogs(allBlogsData);
      setUsers(usersData);
    }).catch((err) => {
      console.error(err);
      setStats({ totalBlogs: 0, totalViews: 0, totalLikes: 0, totalUsers: 0 });
      setRecentBlogs([]);
      setAllBlogs([]);
      setUsers([]);
    })
      .finally(() => setIsLoading(false));
  };
  
  const handleDeleteUser = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Error deleting user: ${e.message}`);
    }
  };


  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteBlog = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Error deleting blog: ${e.message}`);
    }
  };

  const renderContent = () => {
    if (activeTab === "blogs") {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-secondary text-lg">Manage All Posts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">Title & Category</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-center">Views</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link to={`/blog/${blog.slug}`} className="font-medium text-secondary hover:text-primary transition-colors line-clamp-1 max-w-sm" title={blog.title}>
                          {blog.title}
                        </Link>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{blog.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">
                      {blog.views?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          target="_blank"
                          to={`/blog/${blog.slug}`}
                          className="p-2 text-slate-400 hover:text-blue-500 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
                          title="View post"
                        >
                          <Eye size={16} />
                        </Link>
                        <button 
                          onClick={() => setEditingPost(blog)}
                          className="p-2 text-slate-400 hover:text-primary transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
                          title="Edit post"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
                          title="Delete post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {allBlogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No blog posts found. Create one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (activeTab === "users") {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-secondary text-lg">User Management</h3>
            <button onClick={() => setShowInviteUser(true)} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm">+ Invite User</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Last Active</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-secondary">{user.name}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-slate-400 hover:text-primary transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
                          title="Edit user"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (activeTab === "categories") {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-secondary text-lg">Categories</h3>
            <button onClick={() => {
              setEditingCategoryId(null);
              setNewCategoryName("");
              setShowAddCategory(true);
            }} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm">+ Add Category</button>
          </div>
          {showAddCategory && (
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <input 
                type="text" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                placeholder="Category Name" 
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" 
                autoFocus 
              />
              <button 
                onClick={() => {
                  if (newCategoryName.trim()) {
                    if (editingCategoryId) {
                      setCategories(categories.map(c => c.id === editingCategoryId ? { ...c, name: newCategoryName, slug: newCategoryName.toLowerCase().replace(/\s+/g, '-') } : c));
                    } else {
                      setCategories([...categories, { id: Date.now(), name: newCategoryName, slug: newCategoryName.toLowerCase().replace(/\s+/g, '-'), articles: 0 }]);
                    }
                    setShowAddCategory(false);
                  }
                }}
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-sm"
              >
                Save
              </button>
              <button onClick={() => setShowAddCategory(false)} className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-lg shadow-sm">Cancel</button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Articles</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-secondary">{cat.name}</td>
                    <td className="px-6 py-4 text-slate-500">{cat.slug}</td>
                    <td className="px-6 py-4 text-slate-500">{cat.articles}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingCategoryId(cat.id);
                            setNewCategoryName(cat.name);
                            setShowAddCategory(true);
                          }}
                          className="p-2 text-slate-400 hover:text-primary transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this category?")) {
                              setCategories(categories.filter(c => c.id !== cat.id));
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (activeTab === "comments") {
      const flaggedComments = comments.filter(c => c.flagged);
      const safeComments = comments.filter(c => !c.flagged);

      return (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-secondary text-lg">Comments Filtered for Bad Words</h3>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">{flaggedComments.length} Flagged</span>
            </div>
            
            {flaggedComments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <MessageSquare className="mx-auto mb-3 opacity-20" size={32} />
                <p>No flagged comments to review.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {flaggedComments.map(comment => (
                  <div key={comment.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-secondary">{comment.author} <span className="text-sm font-normal text-slate-400 ml-2">&lt;{comment.email}&gt;</span></h4>
                        <p className="text-sm text-slate-500 mt-1">On: <span className="text-primary font-medium">{comment.post}</span> ({comment.date})</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setComments(comments.map(c => c.id === comment.id ? { ...c, flagged: false } : c));
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 rounded-lg text-sm font-medium transition-colors border border-green-200"
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => {
                            setComments(comments.filter(c => c.id !== comment.id));
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-sm font-medium transition-colors border border-red-200"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-100 text-slate-600 italic">
                      "{comment.content}"
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-secondary text-lg">Published Comments</h3>
            </div>
            {safeComments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p>No published comments.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {safeComments.map(comment => (
                  <div key={comment.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-secondary">{comment.author} <span className="text-sm font-normal text-slate-400 ml-2">&lt;{comment.email}&gt;</span></h4>
                        <p className="text-sm text-slate-500 mt-1">On: <span className="text-primary font-medium">{comment.post}</span> ({comment.date})</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setComments(comments.filter(c => c.id !== comment.id));
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-600">
                      {comment.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    if (activeTab === "settings") {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="font-bold text-secondary text-lg">Platform Configuration</h3>
          </div>
          <div className="p-6 space-y-8">
            <div>
              <h4 className="text-secondary font-medium mb-4">Site Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                  <input type="text" defaultValue="JustBlog" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Support Email</label>
                  <input type="email" defaultValue="hello@justblog.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-secondary font-medium mb-4">SEO Preferences</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Default Meta Description</label>
                <textarea rows={3} defaultValue="A premium blogging platform for creators, makers, and innovators to share their stories with the world." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"></textarea>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-secondary font-medium mb-4">Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Twitter Profile</label>
                  <input type="url" defaultValue="https://twitter.com/justblog" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn Page</label>
                  <input type="url" defaultValue="https://linkedin.com/company/justblog" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Facebook Page</label>
                  <input type="url" defaultValue="https://facebook.com/justblog" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Instagram Profile</label>
                  <input type="url" defaultValue="https://instagram.com/justblog" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="flex items-center justify-between text-secondary font-medium mb-2">
                <span>Maintenance Mode</span>
                <input type="checkbox" className="w-5 h-5 accent-primary rounded border-slate-300" />
              </h4>
              <p className="text-sm text-slate-500 mb-6">Temporarily disable public access to your blog while making updates.</p>
              
              <h4 className="flex items-center justify-between text-secondary font-medium mb-2 mt-6">
                <span>Enable User Registration</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded border-slate-300" />
              </h4>
              <p className="text-sm text-slate-500 mb-6">Allow new users to sign up for accounts.</p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-secondary font-medium mb-4">Integrations</h4>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Google Analytics Tracking ID</label>
                <input type="text" placeholder="G-XXXXXXXXXX" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-secondary font-medium mb-4">Comments & Notifications</h4>
              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded border-slate-300 mt-0.5" />
                  <div>
                    <span className="block text-sm font-medium text-slate-700">Enable Comments</span>
                    <span className="block text-sm text-slate-500">Allow users to comment on published articles.</span>
                  </div>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded border-slate-300 mt-0.5" />
                  <div>
                    <span className="block text-sm font-medium text-slate-700">Auto-filter Bad Words</span>
                    <span className="block text-sm text-slate-500">Automatically publish safe comments and hold flagged comments for review.</span>
                  </div>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded border-slate-300 mt-0.5" />
                  <div>
                    <span className="block text-sm font-medium text-slate-700">Email Notifications</span>
                    <span className="block text-sm text-slate-500">Receive an email when a new comment is posted.</span>
                  </div>
                </label>
              </div>

              <button 
                onClick={(e) => {
                  const btn = e.currentTarget;
                  const original = btn.innerText;
                  btn.innerText = "Saved!";
                  setTimeout(() => btn.innerText = original, 2000);
                }}
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm focus:ring-4 focus:ring-primary/20"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default: Overview
    return (
      <>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 font-medium">Total Posts</p>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold text-secondary">{stats.totalBlogs}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 font-medium">Total Views</p>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Eye size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold text-secondary">{stats.totalViews.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 font-medium">Total Likes</p>
              <div className="p-2 bg-pink-50 text-pink-600 rounded-lg"><Heart size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold text-secondary">{stats.totalLikes.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 font-medium">Registered Users</p>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Users size={20} /></div>
            </div>
            <h3 className="text-3xl font-bold text-secondary">{stats.totalUsers}</h3>
          </div>
        </div>

        {/* Recent Activity / Blogs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-secondary text-lg">Recent Published Articles</h3>
            <button onClick={() => setActiveTab('blogs')} className="text-primary text-sm font-medium hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/blog/${blog.slug}`} className="font-medium text-secondary hover:text-primary transition-colors">
                        {blog.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs">{blog.category}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 font-medium">
                      {blog.views.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-slate-300 flex-shrink-0 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <span className="text-xl font-bold text-white tracking-tight">Just<span className="text-primary italic">Admin</span></span>
        </div>
        <div className="flex-grow py-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-primary/20 text-white' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <BarChart3 size={20} /> Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab("blogs")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'blogs' ? 'bg-primary/20 text-white' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <FileText size={20} /> Manage Blogs
          </button>
          <button 
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'categories' ? 'bg-primary/20 text-white' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <FolderOpen size={20} /> Categories
          </button>
          <button 
            onClick={() => setActiveTab("comments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'comments' ? 'bg-primary/20 text-white' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <MessageSquare size={20} /> Comments
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-primary/20 text-white' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={20} /> Users
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-primary/20 text-white' : 'hover:bg-white/5 hover:text-white'}`}
          >
            <Settings size={20} /> Settings
          </button>
        </div>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <LogOut size={20} /> Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold text-secondary capitalize">{activeTab}</h1>
              <p className="text-slate-500 mt-1">Welcome back, Admin. Here's what's happening.</p>
            </div>
            <div className="flex items-center gap-4">
              {activeTab === 'blogs' && (
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
                >
                  + Create New Post
                </button>
              )}
              {activeTab === 'users' && (
                <button 
                  onClick={() => setShowInviteUser(true)}
                  className="px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
                >
                  + Invite User
                </button>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-white rounded-xl text-slate-500 hover:text-primary transition-colors shadow-sm border border-slate-200 relative focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-secondary text-sm">Notifications</h3>
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications([])} className="text-xs text-slate-500 hover:text-primary">Clear all</button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 text-sm">No new notifications</div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {notifications.map(notif => (
                            <div 
                              key={notif.id} 
                              className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3" 
                              onClick={() => {
                                setActiveTab('comments');
                                setShowNotifications(false);
                                setNotifications(notifications.filter(n => n.id !== notif.id));
                              }}
                            >
                              <div className="mt-0.5 p-1.5 bg-orange-50 text-orange-600 rounded-lg h-fit">
                                <MessageSquare size={16} />
                              </div>
                              <div>
                                <p className="text-sm text-slate-800 font-medium mb-1 leading-snug">{notif.message}</p>
                                <p className="text-xs text-slate-400">Just now</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {isLoading || !stats ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
      {/* Modals */}
      {showCreatePost && (
        <CreatePostModal onClose={() => setShowCreatePost(false)} onSuccess={loadData} />
      )}
      
      {editingPost && (
        <CreatePostModal onClose={() => setEditingPost(null)} onSuccess={loadData} initialData={editingPost} />
      )}

      {showInviteUser && (
        <UserModal onClose={() => setShowInviteUser(false)} onSuccess={loadData} />
      )}

      {editingUser && (
        <UserModal onClose={() => setEditingUser(null)} onSuccess={loadData} initialData={editingUser} />
      )}
    </div>
  );
}
