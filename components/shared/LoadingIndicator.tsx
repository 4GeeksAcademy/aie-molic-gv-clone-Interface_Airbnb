interface LoadingIndicatorProps {
  label?: string;
}

export const LoadingIndicator = ({
  label = "Buscando alojamientos…",
}: LoadingIndicatorProps) => (
  <div className="flex min-h-64 flex-col items-center justify-center gap-4 py-12" role="status" aria-live="polite">
    <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-stone-200 border-t-rose-600" aria-hidden="true" />
    <span className="text-sm font-medium text-stone-600">{label}</span>
  </div>
);
