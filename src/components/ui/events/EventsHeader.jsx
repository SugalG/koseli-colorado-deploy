
export default function EventsHeader() {
  return (
    <header className="relative text-center bg-gradient-to-b from-[#ff4e50] via-[#2c2b30] to-[#1b1a1f] py-28 sm:py-24">
      {/* Decorative overlay for smoother gradient fade */}
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
          Events
        </h1>
        <div className="w-1 h-12 bg-brand-primary mx-auto my-5 rounded"></div>
        <p className="max-w-2xl mx-auto text-gray-200 text-lg md:text-xl leading-relaxed px-6">
          Discover all our upcoming and past Koseli Colorado experiences.
        </p>
      </div>
    </header>
  );
}
