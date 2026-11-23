import type { Accommodation } from "@/types/accommodation";
import { AccommodationCard } from "@/components/listings/AccommodationCard";

interface AccommodationGridProps {
  accommodations: Accommodation[];
  isLoading?: boolean;
  layout?: "default" | "catalog";
}

export const AccommodationGrid = ({ accommodations, isLoading = false, layout = "default" }: AccommodationGridProps) => {
  if (!isLoading && accommodations.length === 0) {
    return <p role="status" className="rounded-2xl border border-stone-200 bg-stone-50 px-6 py-12 text-center text-stone-700">No encontramos alojamientos que coincidan con tu búsqueda.</p>;
  }
  const columns = layout === "catalog" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  return <div className={`grid gap-x-6 gap-y-9 ${columns}`} aria-busy={isLoading}>
    {accommodations.map((accommodation, index) => <AccommodationCard key={accommodation.id} accommodation={accommodation} priority={index === 0} titleLines={layout === "catalog" ? 2 : 1} />)}
  </div>;
};
