import {Timestamp} from '@angular/fire/firestore';

export interface Inventory {
  id: string;
  code: string;
  store_id: string;
  state: boolean;//open - closed
  n_products: number;
  start_date: Timestamp;
  end_date: Timestamp;
  created_by: string;
  created_at: Timestamp;
  updated_by: string;
  updated_at: Timestamp;
}
export interface Detail_inventory {
  id: string;
  product_barcode: string;
  product_code: string;
  product_description: string;
  product_laboratory: string;
  product_quantity: number;
  product_fraction: number;
  product_comments: string;
  created_by: string;
  created_at: Timestamp;
  updated_by: string;
  updated_at: Timestamp;
}
