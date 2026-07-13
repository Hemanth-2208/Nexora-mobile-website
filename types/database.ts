export type StockStatus = "In Stock" | "Limited Stock" | "Out of Stock";

export interface Mobile {
  id: string;
  name: string;
  brand: string;
  price: number;
  discount_price: number | null;
  ram: string;
  storage: string;
  processor: string;
  display: string;
  battery: string;
  camera: string;
  description: string;
  images: string[];
  stock_status: StockStatus;
  hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review: string;
  created_at: string;
}
