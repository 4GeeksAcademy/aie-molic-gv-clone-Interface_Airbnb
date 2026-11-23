interface ResultsHeaderProps {
  count: number;
}

export const ResultsHeader = ({ count }: ResultsHeaderProps) => (
  <div>
    <h1 className="text-xl font-semibold tracking-tight text-stone-900">Alojamientos en España</h1>
    <p className="mt-1 text-sm text-stone-600" aria-live="polite">
      {count} {count === 1 ? "alojamiento" : "alojamientos"}
    </p>
  </div>
);