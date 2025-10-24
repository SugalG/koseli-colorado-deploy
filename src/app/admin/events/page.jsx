"use client";
import { useState, useEffect } from "react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:3000");

  // 🟢 Load events
  async function loadEvents() {
    try {
      const res = await fetch(`${base}/api/events`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading events:", err);
      setMessage("⚠️ Failed to fetch events.");
    }
  }

  useEffect(() => {
    loadEvents();
  }, [base]);

  // 🟡 Handle form submit (Create or Update)
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("date", form.date);
      formData.append("location", form.location);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);

      const method = editing ? "PUT" : "POST";
      const url = editing ? `${base}/api/events?id=${editing}` : `${base}/api/events`;

      const res = await fetch(url, { method, body: formData });

      if (res.ok) {
        setForm({
          title: "",
          date: "",
          location: "",
          description: "",
          image: null,
        });
        setEditing(null);
        setMessage("✅ Event saved successfully!");
        await loadEvents();
      } else {
        const err = await res.json();
        setMessage(`❌ ${err.error || "Failed to save event"}`);
      }
    } catch (err) {
      console.error("Error saving event:", err);
      setMessage("❌ Network or server error.");
    } finally {
      setLoading(false);
    }
  }

  // 🔴 Delete event
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`${base}/api/events?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("🗑️ Event deleted successfully.");
        loadEvents();
      } else {
        setMessage("❌ Failed to delete event.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Server error while deleting.");
    }
  }

  // ✏️ Edit existing event
  function handleEdit(event) {
    setEditing(event.id);
    setForm({
      title: event.title,
      date: event.date.split("T")[0],
      location: event.location || "",
      description: event.description,
      image: null,
    });
    setMessage("");
  }

  // ⭐ Toggle featured
  async function toggleFeatured(id, currentStatus) {
    try {
      const res = await fetch(`${base}/api/events?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });
      if (res.ok) {
        setMessage(
          !currentStatus
            ? "🌟 Marked as featured event."
            : "⭐ Removed from featured."
        );
        loadEvents();
      } else {
        setMessage("❌ Failed to toggle featured event.");
      }
    } catch (err) {
      console.error("Feature toggle error:", err);
      setMessage("❌ Server error while updating featured status.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

      {message && (
        <p
          className={`mb-4 text-sm font-medium ${
            message.startsWith("✅") || message.startsWith("🌟")
              ? "text-green-400"
              : message.startsWith("⚠️")
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {/* 🧾 Form Section */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-10 bg-gray-800 p-4 rounded-lg"
      >
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white min-h-[120px]"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="w-full text-white"
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded transition"
          >
            {loading
              ? "Saving..."
              : editing
              ? "Update Event"
              : "Add Event"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  title: "",
                  date: "",
                  location: "",
                  description: "",
                  image: null,
                });
                setMessage("");
              }}
              className="text-gray-400 hover:text-white transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* 📋 Events List */}
      <div className="space-y-6">
        {events.map((e) => (
          <div
            key={e.id}
            className="border border-gray-700 rounded-lg p-4 bg-gray-900/40"
          >
            {e.bannerUrl && (
              <img
                src={e.bannerUrl}
                alt={e.title}
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <h2 className="text-xl font-semibold">{e.title}</h2>
            <p className="text-gray-400 text-sm mb-1">
              📅 {new Date(e.date).toLocaleDateString()}
            </p>
            {e.location && (
              <p className="text-gray-400 text-sm mb-2">📍 {e.location}</p>
            )}
            <p className="text-gray-300 mb-4">{e.description}</p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleEdit(e)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => toggleFeatured(e.id, e.isFeatured)}
                className={`px-3 py-1 rounded transition ${
                  e.isFeatured
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {e.isFeatured ? "★ Featured" : "☆ Make Featured"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
