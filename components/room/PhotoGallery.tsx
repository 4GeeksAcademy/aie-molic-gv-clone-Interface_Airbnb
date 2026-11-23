"use client";

import { useState } from "react";
import Image from "next/image";

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

export const PhotoGallery = ({ images, title }: PhotoGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageCount = images.length;

  const move = (direction: number) => {
    if (imageCount < 2) return;
    setActiveIndex((current) => (current + direction + imageCount) % imageCount);
  };

  if (imageCount === 0) {
    return <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-stone-100 text-sm text-stone-500">Fotografía no disponible</div>;
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 sm:aspect-[16/9]">
      <Image
        src={images[activeIndex]}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 88vw, 1120px"
        loading="eager"
        className="object-cover"
      />
      {imageCount > 1 && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Fotografía anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:left-4 sm:px-4"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Fotografía siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 px-3 py-2 text-sm font-semibold shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 sm:right-4 sm:px-4"
          >
            Siguiente
          </button>
          <span
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-stone-950/70 px-3 py-1 text-sm text-white"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1} / {imageCount}
          </span>
        </>
      )}
    </div>
  );
};
