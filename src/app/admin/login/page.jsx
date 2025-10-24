"use client";
import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        // ✅ redirect handled via middleware (cookie gets set)
        window.location.href = "/admin/dashboard";
      } else {
        const data = await res.json();
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b1a1f] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-80 border border-gray-700"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-brand-primary">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          className="border border-gray-700 bg-gray-800 text-white p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />

        <input
          className="border border-gray-700 bg-gray-800 text-white p-2 w-full mb-5 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold px-4 py-2 rounded w-full transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
