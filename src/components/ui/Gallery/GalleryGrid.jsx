"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GalleryGrid({ images, openModal }) {
  if (!images?.length)
    return <p className="text-center text-gray-400">No images added yet.</p>;

  // Animation variants for smooth staggered fade-in
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance] space-y-5"
      >
        {images.map((img, index) => (
          <motion.figure
            key={img.id}
            variants={item}
            className="relative group overflow-hidden rounded-xl shadow-lg break-inside-avoid cursor-pointer"
            onClick={() => openModal(index)}
          >
            <div className="relative w-full h-[350px]">
              <Image
                src={img.imageUrl}
                alt={img.caption || "Gallery image"}
                fill
                loading="lazy" // ✅ Lazy loading enabled
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Overlay caption */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center text-center">
              {img.caption && (
                <figcaption className="text-white text-sm md:text-base px-4 leading-relaxed">
                  {img.caption}
                </figcaption>
              )}
            </div>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
