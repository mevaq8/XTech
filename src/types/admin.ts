export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  discount_price: number | null;
  sale_price?: number | null;
  stock: number;
  description: string | null;
  is_active: boolean;
  category_id: string;
  main_image: string | null;
  additional_images: string[] | null;
  images?: string[] | null;
  created_at?: string;
  categories?: {
    name: string;
  } | null;
}

export interface SiteSettingsRow {
  id: string;
  site_name: string;
  logo: string | null;
  whatsapp: string | null;
  address: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  email: string | null;
}
