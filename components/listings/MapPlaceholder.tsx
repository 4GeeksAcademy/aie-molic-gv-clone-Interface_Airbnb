interface MapPlaceholderProps {
  label?: string;
}

export const MapPlaceholder = ({ label = "Mapa" }: MapPlaceholderProps) => (
  <div
    aria-label={label}
    className="flex min-h-72 items-center justify-center rounded-3xl bg-stone-200 text-lg font-semibold text-stone-700 md:sticky md:top-6 md:min-h-[calc(100vh-3rem)]"
  >
    {label}
  </div>
);