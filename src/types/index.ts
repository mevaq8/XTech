export interface ProductSpecs {
  [key: string]: string | undefined;
  processor: string;
  ram: string;
  storage: string;
  screen?: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  category: string;
  category_id?: string;
  price: number;
  stock: number;
  specs?: ProductSpecs;
  description?: string;
  shortDescription?: string;
  main_image?: string | null;
  images?: string[] | null;
  created_at?: string;
  attributes?: Record<string, string>;
  categoryName?: string;
  categorySlug?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  variant_value: string;
  price_adjustment: number;
  stock: number;
}
