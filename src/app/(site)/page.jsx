import HeroSection from "@/components/ui/HeroSection";
import UpcomingEventsSection from "@/components/ui/UpcomingEventSection";
import WhatWeOfferSection from "@/components/ui/WhatWeOfferSection";
import SubscribeForm from "@/components/ui/SubscribeForm";

export const dynamic = "force-dynamic"; // 🟢 ensures always fresh data on Vercel

export default async function HomePage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  let allEvents = [];

  try {
    const res = await fetch(`${base}/api/events`, { cache: "no-store" });

    if (res.ok) {
      const data = await res.json();
      allEvents = Array.isArray(data) ? data : [];
    } else {
      console.error("Failed to fetch events:", res.status);
    }
  } catch (err) {
    console.error("HomePage event fetch error:", err);
  }

  // ✅ Ensure at least one safe fallback event (for build preview safety)
  if (allEvents.length === 0) {
    allEvents = [
      {
        id: "demo-event",
        title: "Upcoming Nepali Music Festival",
        description:
          "Experience the rhythm and energy of Nepali music live in Colorado!",
        date: new Date().toISOString(),
        location: "Denver, CO",
        bannerUrl: "/demo/hero-fallback.jpg",
        isFeatured: true,
      },
    ];
  }

  // ✅ Separate featured and upcoming
  const featured =
    allEvents.find((e) => e.isFeatured === true) || allEvents[0];

  const today = new Date();
  const upcoming = allEvents.filter(
    (e) => new Date(e.date) >= today
  );

  return (
    <main className="min-h-screen bg-transparent text-white">
      {/* 🔹 Hero Section */}
      <HeroSection featured={featured} />

      {/* Smooth fade divider between hero and events */}
      <div className="h-24 bg-gradient-to-b from-transparent to-gray-50"></div>

      {/* 🔹 Upcoming Events */}
      <UpcomingEventsSection upcoming={upcoming} />

      {/* Smooth divider between events and offers */}
      <div className="h-24 bg-gradient-to-b from-gray-50 to-white"></div>

      {/* 🔹 What We Offer Section */}
      <WhatWeOfferSection />

      {/* 🔹 Newsletter Section */}
      <section className="bg-brand-primary/95 text-center py-20 text-white">
        <h3 className="text-3xl font-bold mb-6">
          Stay Connected with Koseli Colorado
        </h3>
        <p className="text-white/80 mb-8">
          Get updates on upcoming concerts, cultural nights, and community events.
        </p>
        <SubscribeForm />
      </section>

    </main>
  );
}
