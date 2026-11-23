interface GuestCounterProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export const GuestCounter = ({ value, min, max, onChange }: GuestCounterProps) => (
  <div className="flex items-center gap-3">
    <button type="button" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} aria-label="Reducir huéspedes" className="h-9 w-9 rounded-full border border-stone-300 text-lg disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">−</button>
    <output aria-live="polite" aria-label="Número de huéspedes" className="min-w-6 text-center font-medium">{value}</output>
    <button type="button" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} aria-label="Aumentar huéspedes" className="h-9 w-9 rounded-full border border-stone-300 text-lg disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">+</button>
  </div>
);
