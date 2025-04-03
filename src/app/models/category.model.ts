import { Product } from './product.model';

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  products?: Product[];
}

export interface CreateCategoryDto {
  name: string;       // max 100 chars
  description?: string; // optional, max 255 chars
}

export interface UpdateCategoryDto extends CreateCategoryDto {}