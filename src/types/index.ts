export interface ProductSpecs {
  processor: string;
  ram: string;
  storage: string;
  screen?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  specs: ProductSpecs;
  description: string;
  shortDescription: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
