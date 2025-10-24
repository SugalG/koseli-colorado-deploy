"use client";
import { useState, useEffect } from "react";
import GalleryHeader from "@/components/ui/Gallery/GalleryHeader";
import GalleryGrid from "@/components/ui/Gallery/GalleryGrid";
import GalleryLightbox from "@/components/ui/Gallery/GalleryLightbox";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? "" : "http://localhost:3000");

    fetch(`${base}/api/gallery`)
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load gallery:", err));
  }, []);

  const openModal = (i) => setCurrentIndex(i);
  const closeModal = () => setCurrentIndex(null);
  const prevImage = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <main className="bg-[#1b1a1f] text-white min-h-screen">
      <GalleryHeader />
      <GalleryGrid images={images} openModal={openModal} />
      <GalleryLightbox
        images={images}
        currentIndex={currentIndex}
        onClose={closeModal}
        onPrev={prevImage}
        onNext={nextImage}
      />
    </main>
  );
}
