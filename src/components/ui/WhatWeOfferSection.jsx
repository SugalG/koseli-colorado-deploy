"use client";
import Image from "next/image";
import Link from "next/link";

const offers = [
  {
    title: "Cultural Events & Festivals",
    description:
      "Celebrate Nepali heritage with live music, dance, and cultural showcases that bring the community together.",
    image: "/offers/cultural.jpg",
  },
  {
    title: "Concerts & Artist Performances",
    description:
      "Experience live performances from talented Nepali artists and bands touring across the U.S.",
    image: "/offers/concerts.jpg",
  },
  {
    title: "Community & Charity Initiatives",
    description:
      "We host social gatherings, networking events, and fundraisers to support Nepali causes and unity.",
    image: "/offers/community.jpg",
  },
];

export default function WhatWeOfferSection() {
  return (
    <section className="relative bg-gray-50 py-28 px-6 md:px-12 text-gray-900">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          What <span className="text-brand-primary">We Offer</span>
        </h2>
        <div className="w-24 h-[3px] bg-brand-primary mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          From concerts to cultural galas, Koseli Colorado connects the Nepali
          community through music, art, and shared celebration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {offers.map((offer) => (
          <div
            key={offer.title}
            className="relative group overflow-hidden rounded-xl shadow-lg h-[400px]"
          >
            <Image
              src={offer.image}
              alt={offer.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-500"></div>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
              <h3 className="text-2xl font-extrabold text-white drop-shadow-lg mb-3">
                {offer.title}
              </h3>
              <p className="text-gray-100 text-sm mb-6 max-w-xs leading-relaxed drop-shadow-md">
                {offer.description}
              </p>

              <Link
                href="/about"
                className="relative text-white font-semibold text-sm uppercase tracking-wide border border-white px-5 py-2 hover:bg-white hover:text-black transition-all duration-300"
              >
                Know More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
