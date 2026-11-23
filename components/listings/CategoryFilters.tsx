import type { Category } from "@/types/category";

interface CategoryFiltersProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const CategoryIcon = ({ type }: { type: Category["icon"] }) => {
  const icon = type === "home" ? "home" : type === "hotel" ? "hotel" : "all";
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon === "home" && <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />}
      {icon === "hotel" && <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M3 21h18M8 7h2m4 0h2M8 11h2m4 0h2M9 21v-5h6v5" />}
      {icon === "all" && <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 9h8M8 13h8M8 17h3" /></>}
    </svg>
  );
};

export const CategoryFilters = ({ categories, selectedId, onSelect }: CategoryFiltersProps) => (
  <nav aria-label="Filtrar por tipo de alojamiento" className="flex gap-3 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {categories.map((category) => {
      const selected = category.id === selectedId;
      return (
        <button key={category.id ?? "all"} type="button" aria-pressed={selected} onClick={() => onSelect(category.id)} className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 ${selected ? "border-stone-500 bg-stone-100 text-stone-900 shadow-sm" : "border-stone-200 bg-white text-stone-700 shadow-sm hover:border-stone-400 hover:bg-stone-50"}`}>
          <CategoryIcon type={category.icon} />
          <span>{category.label}</span>
        </button>
      );
    })}
  </nav>
);
