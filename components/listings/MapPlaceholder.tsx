interface MapPlaceholderProps {
  label?: string;
}

export const MapPlaceholder = ({ label = "Mapa" }: MapPlaceholderProps) => (
  <div
    role="region"
    aria-label={label}
    className="flex h-72 min-w-0 items-center justify-center rounded-3xl bg-stone-200 text-lg font-semibold text-stone-700 md:h-[20rem] lg:sticky lg:top-24 lg:h-[calc(100vh-130px)]"
  >
    {label}
  </div>
);