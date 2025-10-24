"use client";
import Image from "next/image";

export default function HeroSection({ featured }) {
  const backgroundImage = featured?.bannerUrl || "/hero-bg.jpg";

  return (
    <section className="relative flex flex-col justify-center items-center text-center min-h-[110vh] sm:min-h-[115vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={featured?.title || "Koseli Colorado"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-all duration-700 ease-in-out bg-black"
          onError={(e) => {
            e.currentTarget.src = "/hero-bg.jpg"; // fallback if image fails
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 max-w-3xl pt-32 md:pt-40 pb-16 text-white text-center drop-shadow-md">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          {featured?.title || "Welcome to Koseli Colorado"}
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mb-4">
          {featured?.description ||
            "Bringing the Nepali community together through music, culture, and celebration."}
        </p>
        {featured?.date && (
          <p className="text-sm text-gray-200 mt-2">
            {new Date(featured.date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </section>
  );
}
