"use client";

import { useEffect, useMemo, useState } from "react";
import { accommodations as accommodationData } from "@/data/accommodations";
import { categories } from "@/data/categories";
import { AccommodationGrid } from "@/components/listings/AccommodationGrid";
import { CategoryFilters } from "@/components/listings/CategoryFilters";
import { Navbar } from "@/components/layout/Navbar";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import type { Accommodation } from "@/types/accommodation";

export default function HomePage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAccommodations(accommodationData);
      setIsLoading(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredAccommodations = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return accommodations.filter((accommodation) => {
      const matchesCategory = selectedCategory === null || accommodation.categoryIds.includes(selectedCategory);
      const matchesSearch = query.length === 0 || `${accommodation.title} ${accommodation.location}`.toLocaleLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [accommodations, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-stone-900">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <div className="sticky top-0 z-10 -mx-5 border-b border-stone-100 bg-white/95 px-5 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <CategoryFilters categories={categories} selectedId={selectedCategory} onSelect={setSelectedCategory} />
        </div>
        <section aria-label="Alojamientos disponibles" className="py-7">
          <h1 className="sr-only">Encuentra tu próximo alojamiento</h1>
          {isLoading ? <LoadingIndicator /> : <AccommodationGrid accommodations={filteredAccommodations} />}
        </section>
      </main>
    </div>
  );
}
