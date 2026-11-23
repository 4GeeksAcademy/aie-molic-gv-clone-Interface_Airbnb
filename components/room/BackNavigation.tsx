import Link from "next/link";

export const BackNavigation = () => (
  <Link href="/catalog" className="inline-flex items-center gap-2 rounded-full py-2 text-sm font-semibold text-stone-700 transition hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-600">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true"><path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
    Volver al catálogo
  </Link>
);
