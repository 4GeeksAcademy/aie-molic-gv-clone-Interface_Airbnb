import Image from "next/image";
import Link from "next/link";
import type { Accommodation } from "@/types/accommodation";

interface AccommodationCardProps {
  accommodation: Accommodation;
  priority?: boolean;
}

export const AccommodationCard = ({ accommodation, priority = false }: AccommodationCardProps) => (
  <article className="min-w-0">
    <Link href={`/rooms/${accommodation.id}`} className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900" aria-label={`${accommodation.title}, ${accommodation.location}`}>
      <div className="relative aspect-[1/0.94] overflow-hidden rounded-2xl bg-stone-100">
        <Image src={accommodation.images[0] || "/accommodation-placeholder.svg"} alt={accommodation.title} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw" priority={priority} className="object-cover transition duration-300 group-hover:scale-[1.03]" />
        {accommodation.badge && <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-900 shadow-sm">{accommodation.badge}</span>}
        <span aria-hidden="true" className="absolute right-3 top-3 text-2xl leading-none text-white drop-shadow">♡</span>
      </div>
      <div className="pt-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-1 text-sm font-semibold text-stone-900">{accommodation.title}</h2>
          <span className="flex shrink-0 items-center gap-1 text-sm text-stone-800"><span aria-hidden="true">★</span>{accommodation.rating.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-sm text-stone-600">{accommodation.location}</p>
        <p className="mt-1 text-sm text-stone-900"><span className="font-semibold">${accommodation.pricePerNight}</span> <span className="text-stone-700">por noche</span></p>
      </div>
    </Link>
  </article>
);
