interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "Empieza a buscar" }: SearchBarProps) => (
  <label className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-stone-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-stone-500 focus-within:ring-2 focus-within:ring-stone-200 md:max-w-xl md:px-5">
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-stone-700" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label="Buscar alojamientos por nombre o ubicación"
      className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-600"
    />
  </label>
);
