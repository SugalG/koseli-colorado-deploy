

"use client";


import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/news", label: "News" },
    { href: "/admin/gallery", label: "Gallery" },
    { href: "/admin/about", label: "About" },
    { href: "/admin/contact", label: "Contact" },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white">
     
      <nav className="flex justify-between items-center px-8 py-4 bg-brand-primary">
        <div className="flex gap-6 items-center">
          <h1 className="text-xl font-bold">Koseli Admin</h1>

         
          {pathname !== "/admin/login" && (
            <div className="flex gap-4">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${
                    pathname === href ? "underline font-semibold" : "opacity-80"
                  } hover:opacity-100`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

        
        {pathname !== "/admin/login" && (
          <button
            onClick={handleLogout}
            className="bg-white text-brand-primary px-3 py-1 rounded font-medium hover:bg-gray-100"
          >
            Logout
          </button>
        )}
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
