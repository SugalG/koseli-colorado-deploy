"use client";
import { useEffect, useState } from "react";

export default function AdminContactPage() {
  const [form, setForm] = useState({
    address: "",
    phone: "",
    email: "",
    facebookUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Use correct base URL in both local and deployed environments
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:3000");

  // 🟢 Load existing contact info
  useEffect(() => {
    async function loadContact() {
      try {
        const res = await fetch(`${base}/api/contact`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load contact info");
        const data = await res.json();
        if (data) setForm((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error("Failed to load contact info:", err);
        setMessage("⚠️ Unable to fetch contact details. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, [base]);

  // 🟡 Handle input updates
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // 🟠 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${base}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("✅ Contact information updated successfully!");
      } else {
        const err = await res.json();
        setMessage(`❌ ${err.error || "Failed to update contact info."}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("❌ Network or server error while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <main className="flex justify-center items-center h-screen text-gray-400">
        Loading contact info...
      </main>
    );

  // ✅ Render form
  return (
    <section className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-brand-primary mb-6">
        Edit Contact Information
      </h1>

      {message && (
        <p
          className={`mb-4 text-sm font-medium ${
            message.startsWith("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-md"
      >
        {[
          { label: "Address", name: "address", type: "textarea" },
          { label: "Phone", name: "phone" },
          { label: "Email", name: "email", type: "email" },
          { label: "Facebook URL", name: "facebookUrl" },
          { label: "Instagram URL", name: "instagramUrl" },
          { label: "YouTube URL", name: "youtubeUrl" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-gray-200 font-medium mb-1">
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white min-h-[100px]"
              />
            ) : (
              <input
                type={type || "text"}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="bg-brand-primary text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
}
