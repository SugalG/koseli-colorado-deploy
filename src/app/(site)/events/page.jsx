"use client";
import { useState, useEffect } from "react";
import EventsHeader from "@/components/ui/events/EventsHeader";
import EventsSearchBar from "@/components/ui/events/EventsSearchBar";
import EventsList from "@/components/ui/events/EventsList";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

 const [loading, setLoading] = useState(true);

useEffect(() => {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? "" : "http://localhost:3000");

  fetch(`${base}/api/events`)
    .then((res) => res.json())
    .then((data) => setEvents(Array.isArray(data) ? data : []))
    .catch((err) => console.error("Failed to load events:", err))
    .finally(() => setLoading(false));
}, []);


  const today = new Date();

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.location || "").toLowerCase().includes(search.toLowerCase())
  );


  
  return (
    <main className="bg-[#1b1a1f] text-white min-h-screen">
      {/* Header handles its own background */}
      <EventsHeader />

      {/* Search */}
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-8">
        <EventsSearchBar search={search} setSearch={setSearch} />
      </div>

      {/* Events List */}
      <section className="container max-w-6xl mx-auto px-6 py-24 sm:py-20">
        <EventsList events={filtered} today={today} />
      </section>
    </main>
  );
}
