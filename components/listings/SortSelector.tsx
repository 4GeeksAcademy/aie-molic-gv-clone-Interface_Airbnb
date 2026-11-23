import type { SortOrder } from "@/types/accommodation";

interface SortSelectorProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

export const SortSelector = ({ value, onChange }: SortSelectorProps) => (
  <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
    <span>Ordenar por</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as SortOrder)}
      className="max-w-52 rounded-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-rose-500"
    >
      <option value="asc">Precio: menor a mayor</option>
      <option value="desc">Precio: mayor a menor</option>
    </select>
  </label>
);