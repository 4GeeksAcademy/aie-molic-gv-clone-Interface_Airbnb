"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { accommodations } from "@/data/accommodations";
import { Navbar } from "@/components/layout/Navbar";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import { AccommodationHeader } from "@/components/room/AccommodationHeader";
import { AmenitiesGrid } from "@/components/room/AmenitiesGrid";
import { BackNavigation } from "@/components/room/BackNavigation";
import { BookingCard } from "@/components/room/BookingCard";
import { HostInfo } from "@/components/room/HostInfo";
import { PhotoGallery } from "@/components/room/PhotoGallery";

export const RoomDetailClient = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setResolvedId(id);
      setIsLoading(false);
    }, 950);
    return () => window.clearTimeout(timer);
  }, [id]);

  const accommodation = resolvedId === id ? accommodations.find((item) => item.id === id) : undefined;
  const pageIsLoading = isLoading || resolvedId !== id;

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <Navbar searchQuery="" onSearchChange={() => undefined} showSearch={false} />
      <main className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-9">
        <BackNavigation />
        {pageIsLoading ? (
          <LoadingIndicator label="Cargando alojamiento…" />
        ) : !accommodation ? (
          <section className="flex min-h-72 flex-col items-center justify-center gap-3 text-center" aria-labelledby="not-found-heading">
            <h1 id="not-found-heading" className="text-2xl font-semibold">Alojamiento no encontrado</h1>
            <p className="text-sm text-stone-600">No hemos encontrado un alojamiento con ese identificador.</p>
          </section>
        ) : (
          <div className="mt-3 space-y-6 sm:space-y-8">
            <AccommodationHeader accommodation={accommodation} />
            <PhotoGallery key={accommodation.id} images={accommodation.images} title={accommodation.title} />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
              <div className="min-w-0 space-y-6">
                <HostInfo host={accommodation.host} />
                <AmenitiesGrid amenities={accommodation.amenities} />
              </div>
              <div className="lg:sticky lg:top-6 lg:self-start">
                <BookingCard key={accommodation.id} pricePerNight={accommodation.pricePerNight} minGuests={accommodation.minGuests} maxGuests={accommodation.maxGuests} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
