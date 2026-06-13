export async function parseApiResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const body = await res.text();

  let data: any = null;
  if (body && contentType.includes("application/json")) {
    try {
      data = JSON.parse(body);
    } catch {
      throw new Error("The server returned invalid JSON.");
    }
  }

  if (!res.ok) {
    throw new Error(data?.error || body || `Request failed with status ${res.status}`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error("The server did not return JSON. Check that the API route is deployed.");
  }

  return data as T;
}

export const fetchBlogs = async (params: { category?: string; search?: string; sort?: string; limit?: number }) => {
  const url = new URL("/api/blogs", window.location.origin);
  if (params.category) url.searchParams.append("category", params.category);
  if (params.search) url.searchParams.append("search", params.search);
  if (params.sort) url.searchParams.append("sort", params.sort);
  if (params.limit) url.searchParams.append("targetLimit", params.limit.toString());

  const res = await fetch(url.toString());
  return parseApiResponse<any[]>(res);
};

export const fetchBlogBySlug = async (slug: string) => {
  const res = await fetch(`/api/blogs/${slug}`);
  return parseApiResponse<any>(res);
};

export const fetchStats = async () => {
  const res = await fetch("/api/stats");
  return parseApiResponse<any>(res);
};

export const fetchUsers = async () => {
  const res = await fetch("/api/users");
  return parseApiResponse<any[]>(res);
};
