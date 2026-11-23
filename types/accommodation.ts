export interface Host {
  id: string;
  name: string;
  avatarUrl: string;
  yearsHosting: number;
}

export interface Amenity {
  id: string;
  label: string;
  icon: string;
}

export interface Accommodation {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  categoryIds: string[];
  images: string[];
  host: Host;
  amenities: Amenity[];
  minGuests: number;
  maxGuests: number;
  badge?: string;
}

export type SortOrder = "asc" | "desc";
