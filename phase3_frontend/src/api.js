const API_BASE_URL = import.meta.env.VITE_API_URL;

export const fetchArticles = async () => {
  const res = await fetch(`${API_BASE_URL}/api/articles`);
  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }
  return res.json();
};
