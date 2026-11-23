import type { Accommodation } from "@/types/accommodation";
import { AccommodationCard } from "@/components/listings/AccommodationCard";

interface AccommodationGridProps {
  accommodations: Accommodation[];
  isLoading?: boolean;
}

export const AccommodationGrid = ({ accommodations, isLoading = false }: AccommodationGridProps) => {
  if (!isLoading && accommodations.length === 0) {
    return <p role="status" className="rounded-2xl border border-stone-200 bg-stone-50 px-6 py-12 text-center text-stone-700">No encontramos alojamientos que coincidan con tu búsqueda.</p>;
  }
  return <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy={isLoading}>
    {accommodations.map((accommodation, index) => <AccommodationCard key={accommodation.id} accommodation={accommodation} priority={index === 0} />)}
  </div>;
};
