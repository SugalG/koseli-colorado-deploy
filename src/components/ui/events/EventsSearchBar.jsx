

import { FaSearch } from "react-icons/fa";

export default function EventsSearchBar({ search, setSearch }) {
  return (
    <div className="relative max-w-2xl mx-auto px-6 py-12">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <FaSearch className="absolute left-5 text-brand-primary text-lg" />

        {/* Input */}
        <input
          type="text"
          placeholder="Search events by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full px-14 py-4
            bg-gradient-to-r from-gray-800/80 to-gray-700/70
            border border-gray-600
            rounded-full
            focus:ring-4 focus:ring-brand-primary/40
            outline-none
            text-white placeholder-gray-400
            shadow-lg
            transition-all duration-300
            hover:shadow-brand-primary/20
          "
        />
      </div>

      {/* Decorative line */}
      <div className="w-32 h-[3px] bg-brand-primary/70 mx-auto mt-6 rounded"></div>
    </div>
  );
}
