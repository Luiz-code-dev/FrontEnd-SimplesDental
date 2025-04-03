import { Category } from './category.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  code: string;
  status: boolean;
  category: Category;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductDto {
  name: string;       // max 100 chars
  description: string; // max 255 chars
  price: number;      // > 0
  code: string;
  status: boolean;
  category: {
    id: number;
  };
}

export interface UpdateProductDto extends CreateProductDto {}