"use client";

import { useState, useEffect } from "react";

export default function AdminNewsPage() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  // 🟢 Load all news
  async function loadNews() {
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load news:", err);
      setMessage("❌ Failed to load news.");
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  // 🟢 Handle add/edit submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      if (form.image) formData.append("image", form.image);
      if (editingId) formData.append("id", editingId);

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/news", { method, body: formData });

      if (!res.ok) throw new Error("Failed to save news");

      setForm({ id: "", title: "", content: "", image: null });
      setEditingId(null);
      setMessage("✅ News saved successfully!");
      loadNews();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save news.");
    } finally {
      setLoading(false);
    }
  }

  // 🟠 Handle delete
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this news item?")) return;

    try {
      const res = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete");
      setMessage("🗑️ News item deleted.");
      loadNews();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete news item.");
    }
  }

  // 🟣 Start editing an item
  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      id: item.id,
      title: item.title,
      content: item.content,
      image: null,
    });
    setMessage("✏️ Editing mode");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">
        {editingId ? "Edit News" : "Add News"}
      </h1>

      {message && <p className="mb-4 text-sm text-gray-300">{message}</p>}

      {/* 🧾 Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-800 p-6 rounded-lg mb-10 shadow-lg"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400"
          required
        />

        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white min-h-[120px] placeholder-gray-400"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="w-full text-white"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded transition"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update News"
              : "Add News"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({ id: "", title: "", content: "", image: null });
                setEditingId(null);
                setMessage("");
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* 📰 News List */}
      <h2 className="text-2xl font-semibold mb-4">All News</h2>
      <div className="space-y-6">
        {news.length > 0 ? (
          news.map((n) => (
            <div
              key={n.id}
              className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700"
            >
              {n.bannerUrl && (
                <img
                  src={n.bannerUrl}
                  alt={n.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-xl font-bold mb-1 text-brand-primary">
                {n.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2">
                📅{" "}
                {new Date(n.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-gray-300 mb-4">{n.content}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(n)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No news items added yet.</p>
        )}
      </div>
    </div>
  );
}
