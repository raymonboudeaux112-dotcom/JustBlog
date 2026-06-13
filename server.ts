import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import multer from "multer";
import fs from "fs";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const upload = multer({ storage: multer.memoryStorage() });

let supabaseClient: SupabaseClient | null = null;
let hasLoggedMissingSupabase = false;
let hasMissingSupabaseCredentials = false;
let hasLoggedSupabaseSchemaIssue = false;
let hasSupabaseSchemaIssue = false;

function handleSupabaseSchemaIssue(error: any) {
  if (error?.code !== 'PGRST205') {
    return false;
  }

  hasSupabaseSchemaIssue = true;
  if (!hasLoggedSupabaseSchemaIssue) {
    console.warn("Supabase tables are missing. Using local_db.json fallback until the schema is created.");
    hasLoggedSupabaseSchemaIssue = true;
  }
  return true;
}

function getSupabase() {
  if (hasMissingSupabaseCredentials || hasSupabaseSchemaIssue) {
    return null;
  }

  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key || url === "YOUR_SUPABASE_URL") {
      hasMissingSupabaseCredentials = true;
      if (!hasLoggedMissingSupabase) {
        console.warn("Supabase credentials missing. Using local_db.json fallback.");
        hasLoggedMissingSupabase = true;
      }
      return null;
    }
    try {
      supabaseClient = createClient(url, key);
    } catch (err) {
      console.warn("Error initializing Supabase client:", err);
      return null;
    }
  }
  return supabaseClient;
}

const dbFile = path.join(process.cwd(), 'local_db.json');
let localDb = { blogs: [] as any[], users: [{ id: 1, name: "Admin", email: "admin@justblog.com", role: "Administrator", lastActive: new Date().toISOString() }] };
try {
  if (fs.existsSync(dbFile)) {
    localDb = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  } else {
    fs.writeFileSync(dbFile, JSON.stringify(localDb, null, 2));
  }
} catch (e) {
  console.error("Failed to read local DB", e);
}

function saveLocalDb() {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(localDb, null, 2));
  } catch (e) {
    console.error("Failed to write to local DB", e);
  }
}

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- API Routes ---
  const apiRouter = express.Router();
  
  apiRouter.post("/blogs", async (req, res) => {
    const supabase = getSupabase();
    const { title, slug, content, thumbnail, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // Create tags array
    const tagsArray = tags ? (Array.isArray(tags) ? tags : tags.split(',').map((s: string) => s.trim())) : [];
    let finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const fallbackInsert = () => {
      const newMock = { 
        id: Date.now().toString(), 
        title, 
        slug: finalSlug, 
        content, 
        category, 
        tags: tagsArray,
        thumbnail,
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0
      };
      localDb.blogs.unshift(newMock);
      saveLocalDb();
      return res.status(201).json(newMock);
    };

    if (!supabase) {
      return fallbackInsert();
    }

    try {
      // Insert into Blogs table
      const { data, error } = await supabase.from('Blogs').insert([{
        title,
        slug: finalSlug,
        content,
        thumbnail,
        category,
        authorId: null // Optional if auth not connected, or we handle auth
      }]).select().single();

      if (error) {
        if (!handleSupabaseSchemaIssue(error)) {
          console.error("Insert error:", error);
        }
        return fallbackInsert();
      }

      res.status(201).json(data);
    } catch (e: any) {
      console.error("Server error:", e);
      return fallbackInsert();
    }
  });

  apiRouter.put("/blogs/:id", async (req, res) => {
    const supabase = getSupabase();
    const { id } = req.params;
    const { title, slug, content, thumbnail, category, tags } = req.body;

    const fallbackUpdate = () => {
      const idx = localDb.blogs.findIndex(b => b.id.toString() === id.toString());
      if (idx !== -1) {
        localDb.blogs[idx] = { 
          ...localDb.blogs[idx], 
          title: title || localDb.blogs[idx].title, 
          slug: slug || localDb.blogs[idx].slug, 
          content: content || localDb.blogs[idx].content, 
          category: category || localDb.blogs[idx].category, 
          thumbnail: thumbnail || localDb.blogs[idx].thumbnail,
          tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((s: string) => s.trim())) : localDb.blogs[idx].tags,
        };
        saveLocalDb();
        return res.json(localDb.blogs[idx]);
      }
      return res.status(404).json({ error: "Blog not found" });
    };

    if (!supabase) {
      return fallbackUpdate();
    }

    try {
      const { data, error } = await supabase.from('Blogs').update({
        title,
        slug,
        content,
        thumbnail,
        category
      }).eq('id', id).select().single();

      if (error) {
         if (!handleSupabaseSchemaIssue(error)) {
           console.error("Update error:", error);
         }
         return fallbackUpdate();
      }
      res.json(data);
    } catch (e: any) {
      console.error(e);
      return fallbackUpdate();
    }
  });

  apiRouter.delete("/blogs/:id", async (req, res) => {
    const supabase = getSupabase();
    const { id } = req.params;

    const fallbackDelete = () => {
      const idx = localDb.blogs.findIndex(b => b.id.toString() === id.toString());
      if (idx !== -1) {
        localDb.blogs.splice(idx, 1);
        saveLocalDb();
        return res.json({ success: true });
      }
      return res.status(404).json({ error: "Blog not found" });
    };

    if (!supabase) {
      return fallbackDelete();
    }

    try {
      const idx = localDb.blogs.findIndex(b => b.id.toString() === id.toString());
      let deletedLocal = false;
      if (idx !== -1) {
        localDb.blogs.splice(idx, 1);
        saveLocalDb();
        deletedLocal = true;
      }

      const { error } = await supabase.from('Blogs').delete().eq('id', id);
      if (error) {
        if (!handleSupabaseSchemaIssue(error)) {
          console.error("Delete error:", error);
        }
        if (!deletedLocal) return fallbackDelete();
      }
      res.json({ success: true });
    } catch (e: any) {
      console.error(e);
      return fallbackDelete();
    }
  });

  apiRouter.get("/blogs", async (req, res) => {
    const supabase = getSupabase();
    if (!supabase) return res.json(localDb.blogs);

    const { category, search, sort = 'latest', targetLimit } = req.query;
    
    // We try to request the nested relation for author data from Users table
    let query = supabase.from('Blogs').select('*, Users(name, avatar)');

    if (category) {
      query = query.eq('category', category);
    }
    
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    
    if (sort === 'popular') {
      query = query.order('views', { ascending: false });
    } else if (sort === 'trending') {
      query = query.order('likes', { ascending: false });
    } else {
      // Default latest
      query = query.order('createdAt', { ascending: false });
    }

    const limit = targetLimit ? parseInt(String(targetLimit)) : 20;
    query = query.limit(limit);

    const { data, error } = await query;
    
    let supabaseData: any[] = [];
    if (!error && data) {
      supabaseData = data.map(blog => ({
        ...blog,
        authorName: blog.Users?.name || "Unknown Author",
        authorAvatar: blog.Users?.avatar || "",
        tags: blog.tags || []
      }));
    } else if (error) {
      handleSupabaseSchemaIssue(error);
    }

    // Merge in localDb blogs
    const dataIds = new Set(supabaseData.map(b => b.id?.toString()));
    const localToAdd = localDb.blogs.filter(b => !dataIds.has(b.id?.toString()));

    const combined = [...localToAdd, ...supabaseData];
    
    if (sort === 'popular') combined.sort((a,b) => (b.views||0) - (a.views||0));
    else if (sort === 'trending') combined.sort((a,b) => (b.likes||0) - (a.likes||0));
    else combined.sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime());

    res.json(combined.slice(0, limit));
  });

  apiRouter.get("/blogs/:slug", async (req, res) => {
    const supabase = getSupabase();
    
    const fallbackGet = () => {
      const mockBlog = localDb.blogs.find(b => b.slug === req.params.slug);
      if (mockBlog) {
        return res.json({ ...mockBlog, authorName: "Admin", authorAvatar: "", commentsCount: 0 });
      }
      return res.status(404).json({ error: "Blog not found" });
    }

    if (!supabase) {
      return fallbackGet();
    }

    const { data: blog, error } = await supabase.from('Blogs')
      .select('*, Users(name, avatar)')
      .eq('slug', req.params.slug)
      .single();

    if (error || !blog) {
      return fallbackGet();
    }

    // Fire & Forget View Count Increment
    supabase.from('Blogs').update({ views: (blog.views || 0) + 1 }).eq('id', blog.id).then();

    res.json({
      ...blog,
      authorName: blog.Users?.name || "Unknown Author",
      authorAvatar: blog.Users?.avatar || "",
      tags: blog.tags || [],
      commentsCount: 0 // Mock comment count since it requires joining Comments relation
    });
  });
  
  // --- USER ROUTES ---
  apiRouter.get("/users", async (req, res) => {
    res.json(localDb.users);
  });

  apiRouter.post("/users", async (req, res) => {
    const { name, email, role } = req.body;
    const newUser = {
      id: Date.now(),
      name: name || "New User",
      email: email || "",
      role: role || "Editor",
      lastActive: new Date().toISOString()
    };
    localDb.users.push(newUser);
    saveLocalDb();
    res.status(201).json(newUser);
  });

  apiRouter.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const idx = localDb.users.findIndex(u => u.id.toString() === id.toString());
    if (idx !== -1) {
      localDb.users[idx] = { 
        ...localDb.users[idx], 
        name: name || localDb.users[idx].name, 
        email: email || localDb.users[idx].email, 
        role: role || localDb.users[idx].role 
      };
      saveLocalDb();
      return res.json(localDb.users[idx]);
    }
    return res.status(404).json({ error: "User not found" });
  });

  apiRouter.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    const idx = localDb.users.findIndex(u => u.id.toString() === id.toString());
    if (idx !== -1) {
      // Don't delete the last admin
      if (localDb.users[idx].role === 'Administrator' && localDb.users.filter(u => u.role === 'Administrator').length <= 1) {
         return res.status(400).json({ error: "Cannot delete the only administrator" });
      }
      localDb.users.splice(idx, 1);
      saveLocalDb();
      return res.json({ success: true });
    }
    return res.status(404).json({ error: "User not found" });
  });

  apiRouter.get("/stats", async (req, res) => {
    const supabase = getSupabase();
    
    const fallbackStats = () => {
      const views = localDb.blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
      const likes = localDb.blogs.reduce((acc, curr) => acc + (curr.likes || 0), 0);
      return res.json({ totalBlogs: localDb.blogs.length, totalViews: views, totalLikes: likes, totalUsers: localDb.users.length });
    };

    if (!supabase) {
      return fallbackStats();
    }

    try {
      const [
        { count: totalBlogs },
        { count: totalUsers },
        { data: engagementData }
      ] = await Promise.all([
        supabase.from('Blogs').select('*', { count: 'exact', head: true }),
        supabase.from('Users').select('*', { count: 'exact', head: true }),
        supabase.from('Blogs').select('views, likes')
      ]);

      const totalViews = (engagementData || []).reduce((acc, curr) => acc + (curr.views || 0), 0);
      const totalLikes = (engagementData || []).reduce((acc, curr) => acc + (curr.likes || 0), 0);

      res.json({ 
        totalBlogs: totalBlogs || localDb.blogs.length || 0, 
        totalViews, 
        totalLikes, 
        totalUsers: totalUsers || localDb.users.length 
      });
    } catch (e: any) {
      return fallbackStats();
    }
  });

  apiRouter.post("/upload", upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const supabase = getSupabase();
      if (!supabase) {
        // Fallback mock using base64 for demo if backend isn't ready
        const b64 = file.buffer.toString('base64');
        const url = `data:${file.mimetype};base64,${b64}`;
        return res.json({ url });
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const { data, error } = await supabase.storage
        .from('images') // The supabase bucket
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error("Supabase storage error:", error);
        // Fallback mock
        const b64 = file.buffer.toString('base64');
        const url = `data:${file.mimetype};base64,${b64}`;
        return res.json({ url });
      }

      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);
      return res.json({ url: publicUrlData.publicUrl });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  app.use("/api", apiRouter);

  return app;
}

async function startServer() {
  const app = createApp();
  const PORT = 3000;

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startServer();
}
