"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#1b1a1f] text-white flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-brand-primary">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Welcome, Admin! You’re successfully logged in.
        </p>

        {/* Quick Links for management */}
        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          {[
            { href: "/admin/events", label: "Manage Events" },
            { href: "/admin/gallery", label: "Manage Gallery" },
            { href: "/admin/about", label: "Edit About Us" },
            { href: "/admin/contact", label: "Edit Contact Info" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-lg border border-gray-700 font-medium transition text-center"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <form action="/api/admin/logout" method="POST" className="mt-10">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Log Out
          </button>
        </form>
      </div>
    </main>
  );
}
