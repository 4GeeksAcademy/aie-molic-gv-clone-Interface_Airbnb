import Link from "next/link";

interface LogoProps {
  href?: string;
  className?: string;
  showWordmark?: boolean;
}

export const Logo = ({ href = "/", className = "", showWordmark = true }: LogoProps) => (
  <Link href={href} aria-label="Stayfinder, inicio" className={`inline-flex shrink-0 items-center gap-2 ${className}`}>
    <svg viewBox="0 0 40 40" className="h-9 w-9 text-rose-600" role="img" aria-label="Símbolo Stayfinder">
      <path d="M20 3.5 35.5 20 20 36.5 4.5 20 20 3.5Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="4.2" fill="currentColor" />
    </svg>
    {showWordmark && <span className="text-xl font-bold tracking-tight text-stone-900">stayfinder</span>}
  </Link>
);
