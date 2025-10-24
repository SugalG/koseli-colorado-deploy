"use client";
import Image from "next/image";
import Link from "next/link";

export default function UpcomingEventsSection({ upcoming = [] }) {
  const hasEvents = Array.isArray(upcoming) && upcoming.length > 0;

  return (
    <section className="relative bg-gray-50 py-24 px-6 md:px-12 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Upcoming <span className="text-brand-primary">Events</span>
        </h2>

        {hasEvents ? (
          <>
            {/* Event Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {upcoming.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={event.bannerUrl || "/placeholder.jpg"}
                      alt={event.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6 flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {event.description ||
                        "Join us for a night of music and culture!"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/events"
                className="inline-block px-8 py-3 rounded-full font-semibold border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition"
              >
                View All Events
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-8">
            No upcoming events yet. Stay tuned!
          </p>
        )}
      </div>
    </section>
  );
}
