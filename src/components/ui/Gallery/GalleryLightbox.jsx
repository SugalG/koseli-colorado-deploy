"use client";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

export default function GalleryLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) {
  if (currentIndex === null) return null;

  const currentImage = images[currentIndex];

  // ✅ Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300"
      >
        <X size={36} />
      </button>

      {/* Prev */}
      <button
        onClick={onPrev}
        className="absolute left-6 text-white/70 hover:text-white"
      >
        <ChevronLeft size={48} />
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        className="absolute right-6 text-white/70 hover:text-white"
      >
        <ChevronRight size={48} />
      </button>

      {/* Image */}
      <div className="relative w-[90vw] max-w-5xl h-[80vh]">
        <Image
          src={currentImage.imageUrl}
          alt={currentImage.caption || "Gallery image"}
          fill
          className="object-contain"
        />
      </div>

      {/* Caption */}
      {currentImage.caption && (
        <p className="absolute bottom-10 text-center w-full text-gray-300 text-sm">
          {currentImage.caption}
        </p>
      )}
    </div>
  );
}
