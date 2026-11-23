import type { Amenity } from "@/types/accommodation";

interface AmenitiesGridProps {
  amenities: Amenity[];
}

const AmenityIcon = ({ name }: { name: string }) => {
  const paths: Record<string, string> = {
    wifi: "M2 8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0m-10 4a5 5 0 0 1 6 0M12 20h.01",
    kitchen: "M4 3v8m4-8v8M6 11v10m9-18v18m0-18c3 2 3 6 0 8",
    "air-conditioning": "M12 2v20m0-10 7-4m-7 4 7 4m-7-4-7-4m7 4-7 4",
    workspace: "M3 5h18v14H3zM8 5v-2h8v2m-7 6h6",
    tv: "M3 5h18v13H3zM8 22h8m-4-4v4",
    breakfast: "M4 10h15v8H4zm15 2h2a2 2 0 0 1 0 4h-2M7 6V3m5 3V3m5 3V3",
    pool: "M3 17c2 0 2-2 4-2s2 2 5 2 3-2 5-2 2 2 4 2M5 11h14M7 11V5h10v6",
    washer: "M5 3h14v18H5zM5 7h14m-7 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 5h.01",
    fireplace: "M12 22a7 7 0 0 0 7-7c0-4-4-6-3-11-3 2-4 5-4 7-2-2-3-4-3-6-4 4-5 7-4 11a7 7 0 0 0 7 6z",
    parking: "M6 21V3h7a5 5 0 0 1 0 10H6",
  };
  const path = paths[name] ?? paths.wifi;
  return <svg viewBox="0 0 24 24" className="h-6 w-6 text-rose-600" fill="none" aria-hidden="true"><path d={path} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
};

export const AmenitiesGrid = ({ amenities }: AmenitiesGridProps) => (
  <section className="space-y-4" aria-labelledby="amenities-heading">
    <h2 id="amenities-heading" className="text-xl font-semibold text-stone-900">Lo que ofrece este alojamiento</h2>
    {amenities.length ? <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">{amenities.map((amenity) => <li key={amenity.id} className="flex items-center gap-3 text-sm text-stone-700"><AmenityIcon name={amenity.icon} />{amenity.label}</li>)}</ul> : <p className="text-sm text-stone-600">No hay servicios disponibles para mostrar.</p>}
  </section>
);
