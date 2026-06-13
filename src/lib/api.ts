export const fetchBlogs = async (params: { category?: string; search?: string; sort?: string; limit?: number }) => {
  const url = new URL("/api/blogs", window.location.origin);
  if (params.category) url.searchParams.append("category", params.category);
  if (params.search) url.searchParams.append("search", params.search);
  if (params.sort) url.searchParams.append("sort", params.sort);
  if (params.limit) url.searchParams.append("targetLimit", params.limit.toString());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};

export const fetchBlogBySlug = async (slug: string) => {
  const res = await fetch(`/api/blogs/${slug}`);
  if (!res.ok) throw new Error("Blog not found");
  return res.json();
};

export const fetchStats = async () => {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

export const fetchUsers = async () => {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

