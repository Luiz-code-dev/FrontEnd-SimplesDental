import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
}

export interface CreateProductDto {
  name: string;       // max 100 chars
  description: string; // max 255 chars
  price: number;      // > 0
  category: {
    id: number;
  };
}

export interface UpdateProductDto extends CreateProductDto {}