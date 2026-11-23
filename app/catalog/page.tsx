"use client";

import { useEffect, useMemo, useState } from "react";
import { accommodations as accommodationData } from "@/data/accommodations";
import { Navbar } from "@/components/layout/Navbar";
import { AccommodationGrid } from "@/components/listings/AccommodationGrid";
import { MapPlaceholder } from "@/components/listings/MapPlaceholder";
import { ResultsHeader } from "@/components/listings/ResultsHeader";
import { SortSelector } from "@/components/listings/SortSelector";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import type { Accommodation, SortOrder } from "@/types/accommodation";

export default function CatalogPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAccommodations(accommodationData);
      setIsLoading(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  const sortedAccommodations = useMemo(
    () => [...accommodations].sort((a, b) =>
      sortOrder === "asc" ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight,
    ),
    [accommodations, sortOrder],
  );

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <Navbar searchQuery="" onSearchChange={() => undefined} showSearch={false} />
      <main className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] md:items-start md:gap-8 lg:gap-10">
          <section aria-label="Resultados de alojamientos" className="min-w-0">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <ResultsHeader count={sortedAccommodations.length} />
              <SortSelector value={sortOrder} onChange={setSortOrder} />
            </div>
            {isLoading ? (
              <LoadingIndicator label="Cargando alojamientos…" />
            ) : (
              <AccommodationGrid accommodations={sortedAccommodations} />
            )}
          </section>
          <MapPlaceholder />
        </div>
      </main>
    </div>
  );
}