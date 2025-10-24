"use client";

export default function GalleryHeader() {
  return (
    <section className="py-20 text-center bg-gradient-to-b from-[#ff4e50] via-[#2c2b30] to-[#1b1a1f]">
      <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
        Gallery
      </h1>
      <div className="w-1 h-10 bg-brand-primary mx-auto mt-3 rounded"></div>
      <p className="text-gray-200 mt-4 text-base max-w-xl mx-auto">
        Relive moments from Koseli Colorado’s concerts, film screenings, and
        cultural events — all in one vibrant space.
      </p>
    </section>
  );
}
