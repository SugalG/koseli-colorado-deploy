"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return setMessage("Please enter your email.");
    setMessage("✅ Thanks for subscribing!");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center gap-4 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-white text-brand-primary font-semibold px-6 py-2 rounded-md hover:bg-gray-100 transition"
      >
        Subscribe
      </button>
      {message && <p className="text-sm text-white/80 mt-2">{message}</p>}
    </form>
  );
}
