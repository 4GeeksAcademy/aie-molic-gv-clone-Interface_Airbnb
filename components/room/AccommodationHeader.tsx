import type { Accommodation } from "@/types/accommodation";

interface AccommodationHeaderProps {
  accommodation: Accommodation;
}

export const AccommodationHeader = ({ accommodation }: AccommodationHeaderProps) => (
  <header className="space-y-2">
    <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{accommodation.title}</h1>
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-600">
      <span>{accommodation.location}</span>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1 font-medium text-stone-900"><span className="text-rose-600" aria-hidden="true">★</span>{accommodation.rating.toFixed(2)} <span className="text-stone-500">({accommodation.reviewCount} reseñas)</span></span>
    </div>
  </header>
);
