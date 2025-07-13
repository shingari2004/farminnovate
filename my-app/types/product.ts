// types/product.ts
export interface Product {
  name: string;
  price: number;
  brand: string;
  description: string;
}

export type Category = 'fruits' | 'vegetables' | 'cereal' | 'Coffee & Tea' | 'Milk & Dairy' | 'Meat';


export type MarketplaceData = {
  [category in Category]?: {
    [productId: string]: Product;
  };
};
