"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isHome ? "bg-transparent text-white" : "bg-brand-bg text-brand-fg"
      }`}
    >
      <Navbar />
      <main className={`flex-grow ${isHome ? "pt-0" : "pt-20"}`}>{children}</main>
      <Footer />
    </div>
  );
}
