"use client";
import { useEffect, useState } from "react";

export default function AdminAboutPage() {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Base URL for both local + Vercel
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:3000");

  // 🟢 Fetch existing about info
  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch(`${base}/api/about`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch about info");
        const data = await res.json();
        setContent(data?.content || "");
      } catch (err) {
        console.error("Failed to load about info:", err);
        setMessage("⚠️ Failed to load content. Please refresh.");
      }
    }
    loadAbout();
  }, [base]);

  // 🟡 Save updated about info
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      const res = await fetch(`${base}/api/about`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setMessage("✅ Saved successfully!");
      } else {
        const err = await res.json();
        setMessage(`❌ ${err.error || "Failed to save"}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("❌ Network or server error while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-4">Edit About Us</h1>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="w-full p-3 border border-gray-300 rounded-md text-black"
      />
      <div className="mt-4 flex gap-4 items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-primary text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {message && <span className="text-gray-700 text-sm">{message}</span>}
      </div>
    </div>
  );
}
