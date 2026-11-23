import { Logo } from "@/components/layout/Logo";
import { SearchBar } from "@/components/search/SearchBar";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar = ({ searchQuery, onSearchChange }: NavbarProps) => (
  <header className="border-b border-stone-200 bg-white">
    <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-12">
      <Logo className="hidden lg:inline-flex" />
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <button type="button" aria-label="Menú de usuario" className="flex shrink-0 items-center gap-2 rounded-full border border-stone-300 p-2 transition hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-stone-700" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-stone-700"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" /><path d="M5 21a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></span>
      </button>
    </div>
    <div className="border-t border-stone-100 px-5 py-3 lg:hidden"><Logo /></div>
  </header>
);
