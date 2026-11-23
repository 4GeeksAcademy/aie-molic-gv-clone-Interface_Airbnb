export type CategoryIcon = "all" | "home" | "hotel";

export interface Category {
  id: string | null;
  label: string;
  icon: CategoryIcon;
}
