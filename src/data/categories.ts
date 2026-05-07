export interface SeedCategory {
  name: string;
  slug: string;
  image: string | null;
  sort_order: number;
  is_active: boolean;
}

export const categories: SeedCategory[] = [
  {
    name: "Noutbuklar",
    slug: "noutbuklar",
    image: "https://via.placeholder.com/200x200?text=Noutbuklar",
    sort_order: 1,
    is_active: true,
  },
  {
    name: "Printerlər",
    slug: "printerler",
    image: "https://via.placeholder.com/200x200?text=Printerler",
    sort_order: 2,
    is_active: true,
  },
  {
    name: "İT Avadanlıqları",
    slug: "it-avadanliqlari",
    image: "https://via.placeholder.com/200x200?text=IT+Avadanliqlari",
    sort_order: 3,
    is_active: true,
  },
];
