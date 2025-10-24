"use client";
import { useState, useEffect } from "react";

export default function AdminGalleryPage() {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:3000");

  // 🟢 Load gallery images
  async function loadImages() {
    try {
      const res = await fetch(`${base}/api/gallery`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load gallery images");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setMessage("⚠️ Could not fetch gallery images.");
    }
  }

  useEffect(() => {
    loadImages();
  }, [base]);

  // 🟡 Upload new image
  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setMessage("❌ Please select an image file.");

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", file);

      const res = await fetch(`${base}/api/gallery`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setCaption("");
        setFile(null);
        setMessage("✅ Image uploaded successfully!");
        await loadImages();
      } else {
        const err = await res.json();
        setMessage(`❌ ${err.error || "Failed to upload image."}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Network or server error while uploading.");
    } finally {
      setLoading(false);
    }
  }

  // 🔴 Delete image
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`${base}/api/gallery?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessage("🗑️ Image deleted successfully.");
        await loadImages();
      } else {
        setMessage("❌ Failed to delete image.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Server error while deleting image.");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Gallery</h1>

      {message && (
        <p
          className={`mb-4 text-sm font-medium ${
            message.startsWith("✅") || message.startsWith("🗑️")
              ? "text-green-400"
              : message.startsWith("⚠️")
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {/* 🖼️ Upload Form */}
      <form
        onSubmit={handleUpload}
        className="space-y-4 bg-gray-800 p-4 rounded-lg mb-10"
      >
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-primary text-white px-4 py-2 rounded hover:bg-brand-primary/90 disabled:opacity-50 transition"
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {/* 🖼️ Gallery Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {images.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center">
            No images uploaded yet.
          </p>
        ) : (
          images.map((img) => (
            <div
              key={img.id}
              className="bg-gray-900 rounded-lg overflow-hidden relative group"
            >
              <img
                src={img.imageUrl}
                alt={img.caption || "Gallery image"}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {img.caption && (
                <p className="p-3 text-sm text-gray-300 border-t border-gray-800">
                  {img.caption}
                </p>
              )}
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm opacity-90 hover:opacity-100 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
